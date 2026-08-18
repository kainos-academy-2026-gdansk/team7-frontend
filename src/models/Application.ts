export interface AdminViewApplication {
  id: number;
  applicationEmail: string;
  status: StatusEnum;
  experience: string;
  salaryExpectation: number;
  skills: string;
}

export interface ApplicationStatusChanged {
  status: StatusEnum;
}
export type StatusEnum = "IN_PROGRESS" | "REJECTED" | "HIRED";
