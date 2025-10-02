import { Request, Response } from "express";
import { JobService } from "../services/job_service";
import { ErrorType } from "../utils/constants/error_type";
import { HttpStatus } from "../utils/constants/http_status";

export const JobController = {
  async createJob(req: Request, res: Response) {
    try {
      const job = await JobService.createJob(req.body);
      res.status(HttpStatus.CREATED).json(job);
    } catch (err: any) {
      res.status(HttpStatus.BAD_REQUEST).json({ error: err.message });
    }
  },

  async getAllJobs(req: Request, res: Response) {
    try {
      const jobs = await JobService.getAllJobs();
      res.json(jobs);
    } catch (err: any) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: err.message });
    }
  },

  async getJobById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await JobService.getJobById(Number(id));
      res.status(200).json(result);
    } catch (error: any) {
      res.status(error.code || 500).json({
        error: error.type || "INTERNAL_ERROR",
        errorCode: error.errorCode || HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      });
    }
  },

  async updateJobStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      await JobService.updateJobStatus(Number(id), status);

      return res.status(HttpStatus.OK).json({
        message: `Job status updated to ${status}`,
      });
    } catch (error: any) {
      console.error("Error updating job status:", error);

      return res.status(error.code || HttpStatus.INTERNAL_SERVER_ERROR).json({
        error: error.type || ErrorType.INTERNAL_ERROR,
        message: error.message || "Something went wrong",
      });
    }
  },
};
