import pool from "../config/db";
import { Invoice, InvoiceLineItem } from "../interfaces/invoice";

export const InvoiceModel = {
  async createInvoice(
    job_id: number,
    lineItems: InvoiceLineItem[],
    taxRate = 0.1
  ): Promise<Invoice> {
    const subtotal = lineItems.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0
    );
    const tax = subtotal * taxRate;
    const total = subtotal + tax;

    const result = await pool.query(
      `INSERT INTO invoices (job_id, subtotal, tax, total)
       VALUES ($1, $2, $3, $4) RETURNING id, job_id, subtotal, tax, total`,
      [job_id, subtotal, tax, total]
    );

    const invoice = result.rows[0];

    for (const item of lineItems) {
      await pool.query(
        `INSERT INTO invoice_line_items (invoice_id, description, quantity, unit_price)
         VALUES ($1, $2, $3, $4)`,
        [invoice.id, item.description, item.quantity, item.unitPrice]
      );
    }

    return {
      ...invoice,
      lineItems,
    };
  },

  async findByJobId(job_id: number): Promise<Invoice | null> {
    const res = await pool.query(`SELECT * FROM invoices WHERE job_id = $1`, [
      job_id,
    ]);
    return res.rows[0] || null;
  },
};
