export type JobRoleStatus = "OPEN" | "CLOSED";
export interface Band {
  id: number;
  name: string;
}
export interface Capability {
  id: number;
  name: string;
}
export interface JobRole {
  id: number;
  roleName: string;
  location: string;
  closingDate: string | null;
  status: JobRoleStatus;
  description: string | null;
  openPositions: number | null;
  sharePointLink: string | null;
  band: Band;
  capability: Capability;
}
