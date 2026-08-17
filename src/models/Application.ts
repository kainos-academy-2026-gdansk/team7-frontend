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
  applicationEmail: string;
  status: StatusEnum;
  experience: string;
  salaryExpectation: number;
  skills: string;
}

export type StatusEnum = "IN PROGRESS" | "REJECTED" | "HIRED";
