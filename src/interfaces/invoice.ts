export interface InvoiceLineItem {
  description: string;
  quantity: number;
  unit_price: number;
}

export interface Invoice {
  id: number;
  job_id: number;
  subtotal: number;
  tax: number;
  lineItems: InvoiceLineItem[];
  total_amount?: number | 0;
  paid_amount?: number | 0;
  status: "PAID" | "UNPAID";
  created_at?: Date;
}
