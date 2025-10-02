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
  total_amount?: number | 0;
  amount?: number | 0;
  status: "PAID" | "UNPAID";
}
