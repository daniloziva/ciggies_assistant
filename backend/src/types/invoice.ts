export interface InvoiceHeader {
  Id?: string;
  InvoiceNumber: string;
  VendorName: string;
  InvoiceDate: string;
  TotalAmount: number;
  IsProcessed: boolean;
}

export interface InvoiceLine {
  Id?: string;
  HeaderId: string;
  Description: string;
  Quantity: number;
  UnitPrice: number;
  LineAmount: number;
} 