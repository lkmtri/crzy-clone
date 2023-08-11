export type Status = "queued" | "in-progress" | "completed" | "failed";

export interface PasswordAuth {
  username: string;
  password: string;
}

export interface JobState {
  startTime: number;
  endTime: number | null;
  status: Status;
  error: string | null;
}

export interface Job extends JobState {
  auth: PasswordAuth;
  uuid: string;
  url: string;
}
