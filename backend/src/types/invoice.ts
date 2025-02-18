export interface InvoiceHeader {
  id: string;
  invoicenumber: string;
  vendorno: string;
  vendorname: string;
  invoicedate: string;
  totalamount: number;
  isprocessed: boolean;
  registrationno: string;
  vatno: string;
  status: string;
}

export interface InvoiceLine {
  header_id: string;
  lineno: number;
  no: string;
  description: string;
  qty: number;
  price: number;
  lineamount: number;
  discount: number;
  uom: string;
  vatpercent: number;
  no_mapped: string | null;
  desc_mapped: string | null;
  vatamount: number;
}