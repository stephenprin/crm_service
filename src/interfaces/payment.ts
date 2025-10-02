export interface Payment {
  id?: number;
  invoice_id: number;
  amount: number;
  payment_date?: Date;
}
