export const JOB_STATUS = {
  NEW: "NEW",
  SCHEDULED: "SCHEDULED",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
} as const;

export type JobStatus = typeof JOB_STATUS[keyof typeof JOB_STATUS];
