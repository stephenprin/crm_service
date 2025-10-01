export interface Appointment {
  id?: number;
  job_id: number;
  technician: string;
  start_time: Date;
  end_time: Date;
}
