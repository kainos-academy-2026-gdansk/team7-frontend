export enum JobRoleStatus {
  OPEN = "OPEN",
  CLOSED = "CLOSED",
}

export interface JobRole {
  id: number;
  roleName: string;
  location: string;
  capability: string;
  band: string;
  closingDate: string | null;
  status: JobRoleStatus;
}

export interface JobRoleDetailed {
  id: number;
  jobRoleName: string;
  description: string | null;
  responsibilities: string;
  link: string | null;
  location: string;
  capability: string;
  band: string;
  closingDate: string | null;
  status: JobRoleStatus;
  numberOfOpenPositions: number;
}
