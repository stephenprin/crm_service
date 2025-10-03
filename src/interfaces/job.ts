import { JobStatus } from "../utils/constants/job_status";
import { Appointment } from "./appointment";
import { Customer } from "./customer";
import { Invoice } from "./invoice";

export interface Job {
  id?: number;
  customer: Customer;
  customer_id?: number;
  title: string;
  description: string;
  status?: JobStatus;
  created_at?: Date;
}

export interface JobInformations {
  job: Job;
  appointment: Appointment | null;
  invoice: Invoice;
}
export interface JobWithCustomer extends Job {
  customer: Customer;
}
