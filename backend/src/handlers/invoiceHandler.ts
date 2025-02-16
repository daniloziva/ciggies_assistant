import { createClient } from '@supabase/supabase-js';

const Supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);

export const storeInvoice = async (req: any, res: any) => {
  const { Header, Lines } = req.body;
  
  try {
    // Insert header
    const { data: HeaderData, error: HeaderError } = await Supabase
      .from('invoice_headers')
      .insert(Header)
      .select()
      .single();

    if (HeaderError) throw HeaderError;

    // Insert lines
    const LinesWithHeaderId = Lines.map((line: any) => ({
      ...line,
      HeaderId: HeaderData.Id
    }));

    const { error: LinesError } = await Supabase
      .from('invoice_lines')
      .insert(LinesWithHeaderId);

    if (LinesError) throw LinesError;

    res.status(200).json({ success: true, data: HeaderData });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const markAsProcessed = async (req: any, res: any) => {
  const { InvoiceId } = req.params;

  try {
    const { error } = await Supabase
      .from('invoice_headers')
      .update({ IsProcessed: true })
      .eq('Id', InvoiceId);

    if (error) throw error;

    res.status(200).json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}; 