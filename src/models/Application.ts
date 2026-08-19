export interface Application {
  id: number;
  jobRoleId: number;
  roleName: string;
  experience: string;
  salaryExpectation: string;
  skills: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}
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
