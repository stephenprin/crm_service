import pool from "../config/db";
import { Job } from "../interfaces/job";
import { JOB_STATUS, JobStatus } from "../utils/constants/job_status";

export const JobModel = {
  async createJob(job: Job): Promise<Job> {
    const { customer_id, title, description } = job;
    const result = await pool.query(
      "INSERT INTO jobs (customer_id, title, description, status) VALUES ($1, $2, $3, $4) RETURNING *",
      [customer_id, title, description, JOB_STATUS.NEW]
    );
    return result.rows[0];
  },

  async findAllJobs(): Promise<Job[]> {
    const result = await pool.query("SELECT * FROM jobs");
    return result.rows;
  },
  //   async findJobById(id: number): Promise<Job | null> {
  //     const result = await pool.query("SELECT * FROM jobs WHERE id = $1", [id]);
  //     return result.rows[0] || null;
  //   },

  async updateJobStatus(id: number, status: JobStatus): Promise<Job | null> {
    const result = await pool.query(
      `UPDATE jobs SET status = $1 WHERE id = $2 RETURNING id, customer_id, title, description, status`,
      [status, id]
    );
    return result.rows[0] || null;
  },

  async findJobById(job_id: number): Promise<any | null> {
    const query = `
      SELECT
        j.id AS job_id,
        j.title,
        j.description,
        j.status AS job_status,
        j.created_at AS job_created_at,

        json_build_object(
          'id', c.id,
          'name', c.name,
          'email', c.email,
          'phone', c.phone,
          'address', c.address
        ) AS customer,

        json_build_object(
          'id', a.id,
          'technician', a.technician,
          'start', a.start_time,
          'end', a.end_time
        ) AS appointment,

        json_build_object(
          'id', i.id,
          'subtotal', i.subtotal,
          'tax', i.tax,
          'totalAmount', i.total,
          'status', i.status,
          'paidAmount', i.paid_amount,
          'remainingBalance', i.total - i.paid_amount,
          'payments', COALESCE(
            (
              SELECT json_agg(
                json_build_object(
                  'id', p.id,
                  'amount', p.amount,
                  'created_at', p.payment_date
                )
              )
              FROM payments p
              WHERE p.invoice_id = i.id
            ), '[]'::json
          )
        ) AS invoice

      FROM jobs j
      INNER JOIN customers c ON j.customer_id = c.id
      LEFT JOIN appointments a ON a.job_id = j.id
      LEFT JOIN invoices i ON i.job_id = j.id
      WHERE j.id = $1;
    `;

    const res = await pool.query(query, [job_id]);
    return res.rows[0] || null;
  },
};
