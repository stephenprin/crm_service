import { JobModel } from "../models/job_model";
import { Job } from "../interfaces/job";
import { CustomerModel } from "../models/customer_model";
import { AppointmentModel } from "../models/appointment_model";
import { ErrorType } from "../utils/constants/error_type";
import { HttpStatus } from "../utils/constants/http_status";
import { JOB_STATUS, JobStatus } from "../utils/constants/job_status";

export const JobService = {
  async createJob(data: Job): Promise<Job> {
    const customer = await CustomerModel.findCustomerById(data.customer_id);
    if (!customer) {
      throw new Error("Customer does not exist");
    }
    return await JobModel.createJob(data);
  },

  async getAllJobs(): Promise<Job[]> {
    return await JobModel.findAllJobs();
  },

  async getJobById(id: number): Promise<Job | null> {
    return await JobModel.findJobById(id);
  },

  async updateJobStatus(job_id: number, newStatus: JobStatus): Promise<void> {
    const job = await JobModel.findJobById(job_id);
    if (!job) {
      const error: any = new Error("Job not found");
      throw error;
    }

    const currentStatus = job.status;

    const validTransitions: Record<JobStatus, JobStatus[]> = {
      [JOB_STATUS.NEW]: [JOB_STATUS.SCHEDULED, JOB_STATUS.CANCELLED],
      [JOB_STATUS.SCHEDULED]: [JOB_STATUS.COMPLETED, JOB_STATUS.CANCELLED],
      [JOB_STATUS.COMPLETED]: [JOB_STATUS.INVOICED],
      [JOB_STATUS.IN_PROGRESS]: [JOB_STATUS.COMPLETED, JOB_STATUS.CANCELLED],
      [JOB_STATUS.INVOICED]: [],
      [JOB_STATUS.CANCELLED]: [],
    };

    if (!currentStatus) {
      const err: any = new Error("Job has no current status");
      return err;
    }

    if (!validTransitions[currentStatus].includes(newStatus)) {
      const error: any = new Error(
        `Invalid status transition from ${currentStatus} to ${newStatus}`
      );
      error.type = ErrorType.INVALID_TRANSITION;
      error.code = HttpStatus.BAD_REQUEST;
      return error;
    }

    if (newStatus === JOB_STATUS.COMPLETED) {
      const appointment = await AppointmentModel.findByJobId(job_id);
      if (!appointment) {
        const error: any = new Error(
          "Cannot complete a job without an appointment"
        );
        error.type = ErrorType.JOB_NO_APPOINTMENT;
        error.code = HttpStatus.BAD_REQUEST;
        return error;
      }
    }

    if (
      newStatus === JOB_STATUS.INVOICED &&
      currentStatus !== JOB_STATUS.COMPLETED
    ) {
      const error: any = new Error(
        "Cannot invoice a job that is not completed"
      );
      error.type = ErrorType.INVALID_TRANSITION;
      error.code = HttpStatus.BAD_REQUEST;
      throw error;
    }

    await JobModel.updateJobStatus(job_id, newStatus);
  },

  async completeJob(jobId: number): Promise<void> {
    const appointment = await AppointmentModel.findByJobId(jobId);
    if (!appointment) {
      const error: any = new Error("Cannot complete job without appointment");
      error.type = ErrorType.JOB_NO_APPOINTMENT;
      error.code = HttpStatus.BAD_REQUEST;
      throw error;
    }

    await this.updateJobStatus(jobId, JOB_STATUS.COMPLETED);
  },
};
