export const JOB_STATUS = {
  NEW: "NEW",
  SCHEDULED: "SCHEDULED",
  COMPLETED: "COMPLETED",
  INVOICED: "INVOICED",
  CANCELLED: "CANCELLED",
  PAID: "PAID",
  UNPAID: "UNPAID",
} as const;

export type JobStatus = (typeof JOB_STATUS)[keyof typeof JOB_STATUS];
