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
  async findJobById(id: number): Promise<Job | null> {
    const result = await pool.query("SELECT * FROM jobs WHERE id = $1", [id]);
    return result.rows[0] || null;
  },

  async updateJobStatus(id: number, status: JobStatus): Promise<Job | null> {
    const result = await pool.query(
      `UPDATE jobs SET status = $1 WHERE id = $2 RETURNING id, customer_id, title, description, status`,
      [status, id]
    );
    return result.rows[0] || null;
  },
};
