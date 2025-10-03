import pool from "../config/db";
import { Appointment } from "../interfaces/appointment";

export const AppointmentModel = {
  async createAppointment(appointment: Appointment): Promise<Appointment> {
    const { job_id, technician, start_time, end_time } = appointment;
    const result = await pool.query(
      `INSERT INTO appointments (job_id, technician, start_time, end_time)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [job_id, technician, start_time, end_time]
    );
    return result.rows[0];
  },

  async findLatestAppointmentByJobId(
    job_id: number
  ): Promise<Appointment | null> {
    const result = await pool.query(
      `SELECT id, job_id, technician, start_time, end_time
     FROM appointments
     WHERE job_id = $1
     ORDER BY id DESC
     LIMIT 1`,
      [job_id]
    );

    console.log("Latest appointment query result:", result.rows);

    return result.rows.length ? result.rows[0] : null;
  },

  async findOverlaps(
    technician: string,
    start: Date,
    end: Date
  ): Promise<Appointment[]> {
    const result = await pool.query(
      `SELECT * FROM appointments 
       WHERE technician = $1
       AND (start_time, end_time) OVERLAPS ($2, $3)`,
      [technician, start, end]
    );
    return result.rows;
  },

  async findByJobId(job_id: number): Promise<Appointment | null> {
    const result = await pool.query(
      `SELECT id, job_id, start_time, end_time
   FROM appointments
   WHERE job_id = $1
   LIMIT 1`,
      [job_id]
    );

    return result.rows.length ? result.rows[0] : null;
  },
};
