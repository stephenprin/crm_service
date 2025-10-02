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


  async updateJobStatus(id: number, status: JobStatus): Promise<Job | null> {
    const result = await pool.query(
      `UPDATE jobs SET status = $1 WHERE id = $2 RETURNING id, customer_id, title, description, status`,
      [status, id]
    );
    return result.rows[0] || null;
  },

  async findJobById(job_id: number): Promise<Job | null> {
    const query = `
    SELECT 
      j.id AS job_id,
      j.customer_id,
      j.title,
      j.description,
      j.status AS status,
      j.created_at AS created_at
    FROM jobs j
    WHERE j.id = $1;
  `;

    const res = await pool.query(query, [job_id]);
    return res.rows[0] || null;
  },
};
