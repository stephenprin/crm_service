export interface InvoiceLineItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface Invoice {
  id: number;
  job_id: number;
  subtotal: number;
  tax: number;
  total: number;
  lineItems: InvoiceLineItem[];
}
