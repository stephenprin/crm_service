import { JobModel } from "../models/job_model";
import { Job } from "../interfaces/job";
import { CustomerModel } from "../models/customer_model";

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
  }
};
