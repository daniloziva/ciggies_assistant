import express, { Request, Response, Router } from 'express';
import { AzureOpenAI } from "openai";
import axios from 'axios';
import { createClient } from '@supabase/supabase-js';

require('dotenv').config();

const router = express.Router();

//openai init 
const endpoint = process.env["OPENAI_ENDPOINT"]!;
const apiKey = process.env["OPENAI_API_KEY"]!;
const docIntelligenceSecrets = process.env["DOC_INTELLIGENCE_SECRETS"]!;
const apiVersion = "2024-05-01-preview";
const deployment = "test"; //This must match your deployment name.

//supabase init     
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    db: { schema: 'public' }
  });

router.post('/getJson', async (req: Request, res: Response) => {
    const body = req.body;
    console.log('Received body for getJson procedure');

    console.log('Running Document Intelligence scan');
    const tableDetails = await readDocument(body.document);
    console.log('Running OpenAI to get JSON processed from the scan');
    let jsonResult = await getJSONFromOpenAI(tableDetails);
    console.log('Saving invoice to database');
    await saveInvoiceFromJson(jsonResult);

    return res.json({ success: true });        
});

router.post('/chat', async (req: Request, res: Response) => {
    const body = req.body;
    console.log(body);

    let jsonResult = await getJSONFromOpenAI(body.request);
    return res.json(jsonResult);
});

router.post('/extract', async (req: Request, res: Response) => {
    const body = req.body;
    console.log(body);

    const tableDetails = await readDocument(body.document);

    return res.json({ body: tableDetails });
});

async function getJSONFromOpenAI(prompt: any){
    try {
        const client = new AzureOpenAI({ endpoint, apiKey, apiVersion, deployment });
        const result = await client.chat.completions.create({
            messages: [
                {
                    role: "system", content: `You are an assistant that can help with invoices that returns responses in JSON format. Answer nothing but the JSON response.
                    You will receive a result of a scan of an invoice from OpenAI document intelligence resource. It will first contain the summary of the OCR scan, then below will be the table details. 
                    Use the summary to extract the header data. The table details will be in the format of "Header at row X column Y is: Z. Value at row A column B is: C." etc.
                    The JSON properties should match the names of the field that follow. Rižoto doo( vat 21866571 and reg no 113436605) is my company name, disregard this from the analysis. The invoice number should have "faktura" or "fakturu" next to it.
                    You will then extract the invoice data and return it in JSON format. It should contain header with property named "header" and inside it data:vendorName, registrationNo, vatNo, invoicenumber, invoiceDate, totalAmount, totalVatAmount, totalAmountWithVat.
                    Line data in an array inside of "lines". The line data I am insterested in is: description, itemNo, qty, uom, unitPrice, discount, vatpercent, vatamount, lineamount.
                    If any of the data is not available, return null. Return a clean JSON object in plain text. Dates should be in the format YYYY-MM-DD. Decimal separator should be a dot.
                    ` },
                { role: "user", content: prompt },
            ],
            model: "",
        });


        for (const choice of result.choices) {
            console.log(choice.message);
        }
        let jsonResult = await JSON.parse(result.choices[0].message.content!);
        return jsonResult;
    } catch (Error) {
        console.error('Error calling Azure OpenAI:', Error);
        // return Error.message;
        throw Error;
    }
}

async function saveInvoiceFromJson(invoice: any) {
    try {
        // Log the incoming data
        console.log('Received invoice data:', invoice);

        const Header = {
            vendorname: invoice.header.vendorName || '',
            registrationno: invoice.header.registrationNo || '',
            vatno: invoice.header.vatNo || '',
            invoicenumber: invoice.header.invoiceNo || '', // Changed from invoiceNo to invoicenumber to match DB
            invoicedate: invoice.header.invoiceDate || '',
            totalamount: invoice.header.totalAmount || 0,
            // totalvatamount: invoice.header.totalVatAmount || 0,
            // totalamountwithvat: invoice.header.totalAmountWithVat || 0,
            status: 'new'
        };

        console.log('Prepared header data:', Header);
        
        const { data, error } = await supabase
            .from('invoice_header')
            .insert(Header)
            .select()
            .single();

        if (error) {
            console.error('Supabase insert error:', error);
            throw error;
        }

        console.log('Insert successful, returned data:', data);

        if (!data) {
            throw new Error('No data returned from insert operation');
        }

        // Create line records
        const Lines = invoice.lines.map((line: any) => ({
            header_id: data.id,
            description: line.description || '',
            no: line.itemNo || '',
            qty: line.qty || 0,
            uom: line.uom || '',
            price: line.unitPrice || 0,
            discount: line.discount || 0,
            vatpercent: line.vatpercentage || 0,
            vatamount: line.vatamount || 0,
            lineamount: line.lineamount || 0
        }));

        console.log('Prepared lines data:', Lines);

        const { error: LinesError } = await supabase
            .from('invoice_line')
            .insert(Lines);

        if (LinesError) {
            console.error('Error inserting lines:', LinesError);
            throw LinesError;
        }

        return { success: true, invoiceId: data.id };
    } catch (error: any) {
        console.error('Error in saveInvoiceFromJson:', error);
        return { success: false, error: error.message };
    }
}

async function readDocument(document: any) {
    let secrets = JSON.parse(docIntelligenceSecrets);
    const fullUrl = `${secrets.endpoint}${secrets.resourcePathV4}?api-version=${secrets.apiVersion}`;

    const headers = {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': secrets.subscriptionKey,
    };

    const data = {
        base64Source: document
    }

    const response = await axios.post(fullUrl, data, { headers });
    const operationLocation = await response.headers['operation-location'];

    const result = await getLayoutAnalysisResult(operationLocation, secrets.subscriptionKey)

    return result;
}


const getLayoutAnalysisResult = async (operationLocation: any, key: any) => {
    var tableDetails = '';

    const headers = {
        'Ocp-Apim-Subscription-Key': key,
    };
    try {
        let response;
        do {
            response = await axios.get(operationLocation, { headers });

            if (response.status === 200) {
                if (response.data.status === 'succeeded') {
                    // console.log('API call successful:', response.data);
                    for (const table of response.data.analyzeResult.tables) {
                        tableDetails += 'Found new table structure. Data included: '
                        for (const cell of table.cells) {
                            if (cell.kind == 'columnHeader') {
                                tableDetails += ' Header at row ' + cell.rowIndex + ' column ' + cell.columnIndex + ' is: ' + cell.content + '.';
                            } else {
                                tableDetails += ' value at row ' + cell.rowIndex + ' column ' + cell.columnIndex + ' is: ' + cell.content + '.';
                            }
                        }
                    }

                    console.log('The content summary is: ' + response.data.analyzeResult.content);
                    console.log('Table details is ' + tableDetails);

                    return (response.data.analyzeResult.content + ' ' +tableDetails); // Exit the loop if analysis is complete
                } else {
                    console.log('Analysis still running. Waiting...');
                    await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds before polling again
                }
            } else {
                console.error('API call failed with status:', response.status, response.data);
                break; // Exit the loop on error
            }
        } while (response.data.status !== 'succeeded');

        return response.data
    } catch (error) {
        console.error('Error during API call:', error);
    }
}

export default router;
