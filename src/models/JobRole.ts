export const OPEN_STATUS_NAME = "OPEN";

export interface JobRole {
  id: number;
  roleName: string;
  location: string;
  capability: string;
  band: string;
  closingDate: string | null;
  status: string;
}

export interface JobRoleDetailed {
  id: number;
  jobRoleName: string;
  description: string | null;
  responsibilities: string;
  sharepointUrl: string | null;
  location: string;
  capability: string;
  band: string;
  closingDate: string | null;
  status: string;
  numberOfOpenPositions: number;
}
