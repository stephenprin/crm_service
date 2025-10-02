import pool from "../config/db";
import { Invoice, InvoiceLineItem } from "../interfaces/invoice";

export const InvoiceModel = {
  async createInvoice(
    job_id: number,
    lineItems: InvoiceLineItem[],
    subtotal: number,
    tax: number,
    total_amount: number
  ): Promise<Invoice> {
    const result = await pool.query(
      `INSERT INTO invoices (job_id, subtotal, tax, total_amount)
       VALUES ($1, $2, $3, $4)
       RETURNING id, job_id, subtotal, tax, total_amount`,
      [job_id, subtotal, tax, total_amount]
    );

    const invoice = result.rows[0];

    for (const item of lineItems) {
      await pool.query(
        `INSERT INTO invoice_line_items (invoice_id, description, quantity, unit_price)
         VALUES ($1, $2, $3, $4)`,
        [
          invoice.id,
          item.description,
          Number(item.quantity) || 0,
          Number(item.unit_price) || 0,
        ]
      );
    }

    return {
      ...invoice,
      lineItems,
    };
  },

  async findInvoiceById(id: number): Promise<Invoice | null> {
    const res = await pool.query(`SELECT * FROM invoices WHERE id = $1`, [id]);
    if (res.rows.length === 0) {
      return null;
    }
    const invoice = res.rows[0];

    const lineItemsRes = await pool.query(
      `SELECT description, quantity, unit_price AS "unitPrice"
       FROM invoice_line_items
       WHERE invoice_id = $1`,
      [id]
    );

    const lineItems: InvoiceLineItem[] = lineItemsRes.rows;

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

  async updateBalances(
    invoice_id: number,
    paid_amount: number,
    total_amount: number,
    status?: string
  ): Promise<Invoice | null> {
    let query: string;
    let params: any[];

    if (status) {
      query = `
        UPDATE invoices
        SET paid_amount = $1, total_amount = $2, status = $3, updated_at = NOW()
        WHERE id = $4
        RETURNING *;
      `;
      params = [paid_amount, total_amount, status, invoice_id];
    } else {
      query = `
        UPDATE invoices
        SET amount = $1, total_amount = $2, updated_at = NOW()
        WHERE id = $3
        RETURNING *;
      `;
      params = [paid_amount, total_amount, invoice_id];
    }

    const res = await pool.query(query, params);
    return res.rows[0] || null;
  },
};
