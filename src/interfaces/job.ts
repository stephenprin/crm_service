import { JobStatus } from "../utils/constants/job_status";

export interface Job {
  id?: number;
  customer_id: number;
  title: string;
  description: string;
  status?: JobStatus;
  created_at?: Date;
}
