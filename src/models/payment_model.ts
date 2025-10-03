import pool from "../config/db";
import { Payment } from "../interfaces/payment";

export const PaymentModel = {
  async recordPayment(payment: Payment): Promise<Payment> {
    const { invoice_id, amount} = payment;
    const result = await pool.query(
      `INSERT INTO payments (invoice_id, amount, payment_date)
       VALUES ($1, $2, NOW()) RETURNING *`,
      [invoice_id, amount]
    );
    return result.rows[0];
  },
};
