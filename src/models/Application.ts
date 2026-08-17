export interface AdminViewApplication {
  id: number;
  applicationEmail: string;
  status: StatusEnum;
  experience: string;
  salaryExpectation: number;
  skills: string;
}

export type StatusEnum = "IN PROGRESS" | "REJECTED" | "HIRED";
