export const JOB_STATUS = {
  NEW: "New",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
} as const;

export type JobStatus = typeof JOB_STATUS[keyof typeof JOB_STATUS];