import express, { Request, Response, Router } from 'express';
import { AzureOpenAI } from "openai";
import axios from 'axios';

require('dotenv').config();

const router = express.Router();
const endpoint = process.env["OPENAI_ENDPOINT"]!;
const apiKey = process.env["OPENAI_API_KEY"]!;
const docIntelligenceSecrets = process.env["DOC_INTELLIGENCE_SECRETS"]!;
const apiVersion = "2024-05-01-preview";
const deployment = "test"; //This must match your deployment name.


router.post('/chat', async (req: Request, res: Response) => {
    const body = req.body;
    console.log(body);
    try {
        const client = new AzureOpenAI({ endpoint, apiKey, apiVersion, deployment });
        const result = await client.chat.completions.create({
            messages: [
                {
                    role: "system", content: `You are an assistant that can help with invoices that returns responses in JSON forma
            
            t. Answer nothing but the JSON response.
            You will receive a result of a scan of an invoice from OpenAI document intelligence resource.
            You will then extract the invoice data and return it in JSON format. It should contain header witih property named "header" and inside it data:vendorName, registrationNo, vatNo, invoiceNo, invoiceDate, totalAmount, totalVatAmount, totalAmountWithVat.
            Line data in an array inside of "lines". The line data I am insterested in is: description, itemNo, quantity, uom, unitPrice, discount, vatpercentage, vatamount, lineamount.
            If any of the data is not available, return null. Return a clean JSON object in plain text.
            ` },
                { role: "user", content: body.request },
            ],
            model: "",
        });


        for (const choice of result.choices) {
            console.log(choice.message);
        }
        let jsonResult = await JSON.parse(result.choices[0].message.content!);
        return res.json(jsonResult);
    } catch (Error) {
        console.error('Error calling Azure OpenAI:', Error);
        return res.status(500).json({ error: 'Error communicating with Azure OpenAI' });
    }
});

router.post('/extract', async (req: Request, res: Response) => {
    const body = req.body;
    console.log(body);

    const tableDetails = await readDocument(body.document);

    return res.json({ body: tableDetails });
});


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

                    console.log(tableDetails);

                    return (tableDetails); // Exit the loop if analysis is complete
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
