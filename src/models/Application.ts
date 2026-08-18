export interface AdminViewApplication {
  id: number;
  applicantEmail: string;
  status: StatusEnum;
  experience: string;
  salaryExpectation: string;
  skills: string;
}

export interface ApplicationStatusChanged {
  status: StatusEnum;
}
export type StatusEnum = "IN_PROGRESS" | "REJECTED" | "HIRED";
