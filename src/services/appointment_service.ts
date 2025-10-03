import { AppointmentModel } from "../models/appointment_model";
import { Appointment } from "../interfaces/appointment";
import { JOB_STATUS } from "../utils/constants/job_status";
import { ErrorType } from "../utils/constants/error_type";
import pool from "../config/db";
import { HttpStatus } from "../utils/constants/http_status";
import { JobModel } from "../models/job_model";

export const AppointmentService = {
  async scheduleAppointment(data: Appointment): Promise<Appointment> {
    console.log("Scheduling appointment with data:", data);
    const job = await AppointmentModel.findLatestAppointmentByJobId(
      data.job_id
    );
    console.log("Latest appointment for job:", job);
    if (job === null) {
      const error: any = new Error("Job not found");
      error.errorType = ErrorType.JOB_NOT_FOUND;
      error.code = HttpStatus.NOT_FOUND;
      throw error;
    }

    const job_status = await JobModel.findJobById(data.job_id);

    if (job_status?.job.status === JOB_STATUS.COMPLETED) {
      const error: any = new Error(
        "Cannot schedule appointment for COMPLETED job"
      );
      error.errorType = ErrorType.JOB_ALREADY_COMPLETED;
      error.code = HttpStatus.BAD_REQUEST;
      throw error;
    }


    // check overlap
    const overlaps = await AppointmentModel.findOverlaps(
      data.technician,
      data.start_time,
      data.end_time
    );
    if (overlaps.length > 0) {
      const error: any = new Error(
        "Technician is already booked during this time window"
      );
      error.code = ErrorType.APPOINTMENT_OVERLAP;
      throw error;
    }

    const appointment = await AppointmentModel.createAppointment(data);

    await pool.query("UPDATE jobs SET status = $1 WHERE id = $2", [
      JOB_STATUS.SCHEDULED,
      data.job_id,
    ]);

    return appointment;
  },
};
