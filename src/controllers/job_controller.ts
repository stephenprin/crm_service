import { Request, Response } from "express";
import { JobService } from "../services/job_service";

export const JobController = {
  async createJob(req: Request, res: Response) {
    try {
      const job = await JobService.createJob(req.body);
      res.status(201).json(job);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },

  async getAllJobs(req: Request, res: Response) {
    try {
      const jobs = await JobService.getAllJobs();
      res.json(jobs);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
};
