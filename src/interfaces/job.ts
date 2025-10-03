import { JobStatus } from "../utils/constants/job_status";
import { Customer } from "./customer";

export interface Job {
  id?: number;
  customer: Customer;
  customer_id?: number;
  title: string;
  description: string;
  status?: JobStatus;
  created_at?: Date;
}

export interface JobWithCustomer {
  job: Job;
  customer: Customer;
}
