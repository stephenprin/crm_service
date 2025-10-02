import { Request, Response } from "express";
import { JobService } from "../services/job_service";
import { ErrorType } from "../utils/constants/error_type";
import { HttpStatus } from "../utils/constants/http_status";

export const JobController = {
  async createJob(req: Request, res: Response) {
    try {
      const job = await JobService.createJob(req.body);
      return res.status(HttpStatus.CREATED).json(job);
    } catch (err: any) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: err.message });
    }
  },

  async getAllJobs(_: Request, res: Response) {
    try {
      const jobs = await JobService.getAllJobs();
      return res.json(jobs);
    } catch (err: any) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: err.message });
    }
  },

  async getJobById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await JobService.getJobById(Number(id));
      return res.status(200).json(result);
    } catch (error: any) {
      if (error.code === "42703") {
        return res
          .status(400)
          .json({ message: "Invalid column in query", error });
      }
      return res.status(error.code || 500).json({
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
      const statusCode =
        Number.isInteger(error.code) && error.code >= 100 && error.code <= 599
          ? error.code
          : HttpStatus.INTERNAL_SERVER_ERROR;

      return res.status(statusCode).json({
        error: error.type || ErrorType.INTERNAL_ERROR,
        message: error.message || "Something went wrong",
      });
    }
  },
};
