import pool from "../config/db";
import { Job, JobInformations } from "../interfaces/job";
import { JOB_STATUS, JobStatus } from "../utils/constants/job_status";

export const JobModel = {
  async createJob(data: Job): Promise<Job> {
    const { title, description, customer } = data;
    const { id: customer_id } = customer;

    const jobResult = await pool.query(
      "INSERT INTO jobs (customer_id, title, description, status) VALUES ($1, $2, $3, $4) RETURNING *",
      [customer_id, title, description, JOB_STATUS.NEW]
    );

    const createdJob = jobResult.rows[0];

    return {
      ...createdJob,
    };
  },

  async findAllJobs(status?: string): Promise<any[]> {
    let result;

    if (status) {
      result = await pool.query(
        `SELECT j.*, c.id AS customer_id, c.name AS customer_name, c.email AS customer_email, c.phone AS customer_phone
       FROM jobs j
       JOIN customers c ON j.customer_id = c.id
       WHERE j.status = $1
       ORDER BY j.created_at DESC`,
        [status]
      );
    } else {
      result = await pool.query(
        `SELECT j.*, c.id AS customer_id, c.name AS customer_name, c.email AS customer_email, c.phone AS customer_phone
       FROM jobs j
       JOIN customers c ON j.customer_id = c.id
       ORDER BY j.created_at DESC`
      );
    }
    return result.rows.map((row) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      status: row.status,
      created_at: row.created_at,
      customer: {
        id: row.customer_id,
        name: row.customer_name,
        email: row.customer_email,
        phone: row.customer_phone,
      },
    }));
  },

  async updateJobStatus(id: number, status: JobStatus): Promise<Job | null> {
    const result = await pool.query(
      `UPDATE jobs SET status = $1 WHERE id = $2 RETURNING id, customer_id, title, description, status`,
      [status, id]
    );
    return result.rows[0] || null;
  },

  async findJobById(job_id: number): Promise<JobInformations | null> {
    const jobQuery = `
    SELECT 
      j.id AS job_id,
      j.title,
      j.description,
      j.status,
      j.created_at,
      c.id AS customer_id,
      c.name AS customer_name,
      c.email AS customer_email,
      c.phone AS customer_phone
    FROM jobs j
    JOIN customers c ON j.customer_id = c.id
    WHERE j.id = $1;
  `;
    const jobRes = await pool.query(jobQuery, [job_id]);
    const jobRow = jobRes.rows[0];

    if (!jobRow) return null;

    const appointmentRes = await pool.query(
      `SELECT technician, start_time, "end_time" FROM appointments WHERE job_id = $1 ORDER BY created_at DESC LIMIT 1`,
      [job_id]
    );

    const appointment = appointmentRes.rows[0] || undefined;

    // Fetch invoice if exists
    const invoiceRes = await pool.query(
      `SELECT id, status, subtotal, tax, total_amount, paid_amount
     FROM invoices WHERE job_id = $1`,
      [job_id]
    );
    const invoiceRow = invoiceRes.rows[0];
    let invoice: any = undefined;

    if (invoiceRow) {
      const lineItemsRes = await pool.query(
        `SELECT description, quantity, unit_price FROM invoice_line_items WHERE invoice_id = $1`,
        [invoiceRow.id]
      );

      invoice = {
        ...invoiceRow,
        lineItems: lineItemsRes.rows,
      };
    }

    return {
      job: jobRow,
      appointment,
      invoice,
    };
  },
};
