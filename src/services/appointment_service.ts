import { AppointmentModel } from "../models/appointment_model";
import { Appointment } from "../interfaces/appointment";
import { JOB_STATUS } from "../constants/job_status";
import { ErrorCode } from "../constants/error_code";
import pool from "../config/db";

export const AppointmentService = {
  async scheduleAppointment(data: Appointment): Promise<Appointment> {
    const job = await pool.query("SELECT * FROM jobs WHERE id = $1", [data.job_id]);
    if (job.rows.length === 0) {
      const error: any = new Error("Job not found");
      error.code = ErrorCode.JOB_NOT_FOUND;
      throw error;
    }

    // check overlap
    const overlaps = await AppointmentModel.findOverlaps(
      data.technician,
      data.start_time,
      data.end_time
    );
    if (overlaps.length > 0) {
      const error: any = new Error("Technician is already booked during this time window");
      error.code = ErrorCode.APPOINTMENT_OVERLAP;
      throw error;
    }

    const appointment = await AppointmentModel.createAppointment(data)

    await pool.query("UPDATE jobs SET status = $1 WHERE id = $2", [JOB_STATUS.SCHEDULED, data.job_id]);

    return appointment;
  }
};
