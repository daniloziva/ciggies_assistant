import express, { Request, Response, Router } from 'express';
import { createClient } from '@supabase/supabase-js';

require('dotenv').config();

const router = Router();
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_ANON_KEY!;

console.log(supabaseUrl);

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  db: { schema: 'public' }
});

// Endpoint to get all invoices
router.get('/', async (req: Request, res: Response) => {
  try {
    const { data: Invoices, error: InvoicesError } = await supabase
      .from('invoice_header')
      .select('*')
      .order('invoicedate', { ascending: false });
      
    if (InvoicesError) throw InvoicesError;
    return res.json(Invoices);
  } catch (Error) {
    console.error('Error fetching invoices:', Error);
    return res.status(500).json({ error: 'Error fetching invoices' });
  }
});

// Endpoint to get a specific invoice and its lines
router.get('/:InvoiceId', async (req: Request, res: Response) => {
  const { InvoiceId } = req.params;
  try {
    const { data: HeaderData, error: HeaderError } = await supabase
      .from('invoice_header')
      .select('*')
      .eq('id', InvoiceId)
      .single();

    if (HeaderError) throw HeaderError;

    const { data: LinesData, error: LinesError } = await supabase
      .from('invoice_line')
      .select('*')
      .eq('header_id', InvoiceId);

    if (LinesError) throw LinesError;

    return res.json({ HeaderData, LinesData });
  } catch (Error) {
    console.error('Error fetching invoice details:', Error);
    return res.status(500).json({ error: 'Error fetching invoice details' });
  }
});

// Endpoint to update an invoice header and its lines
router.put('/:InvoiceId', async (req: Request, res: Response) => {
  const { InvoiceId } = req.params;
  const { Invoice, InvoiceLines } = req.body; // Expect the full invoice and its lines in the request body

  try {
    // Update header
    const { error: HeaderError } = await supabase
      .from('invoice_header')
      .update(Invoice)
      .eq('id', InvoiceId);
    if (HeaderError) throw HeaderError;

    // Update each line. For new lines or changes, you might want to handle inserts separately.
    for (const Line of InvoiceLines) {
      const { error: LineError } = await supabase
        .from('invoice_line')
        .update(Line)
        .eq('header_id', InvoiceId)
        .eq('lineno', Line.lineno);
      if (LineError) throw LineError;
    }

    return res.json({ message: 'Invoice updated successfully' });
  } catch (Error) {
    console.error('Error updating invoice:', Error);
    return res.status(500).json({ error: 'Error updating invoice' });
  }
});

// Endpoint to delete an invoice
router.delete('/:InvoiceId', async (req: Request, res: Response) => {
  const { InvoiceId } = req.params;

  try {
    // Delete invoice lines first
    const { error: LinesError } = await supabase
      .from('invoice_line')
      .delete()
      .eq('header_id', InvoiceId);

    if (LinesError) throw LinesError;

    // Then delete the header
    const { error: HeaderError } = await supabase
      .from('invoice_header')
      .delete()
      .eq('id', InvoiceId);

    if (HeaderError) throw HeaderError;

    return res.json({ message: 'Invoice deleted successfully' });
  } catch (Error) {
    console.error('Error deleting invoice:', Error);
    return res.status(500).json({ error: 'Error deleting invoice' });
  }
});

export default router; 