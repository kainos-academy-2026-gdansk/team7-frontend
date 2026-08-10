export interface JobRole {
  roleName: string;
  location: string;
  capability: string;
  band: string;
  closingDate: string | null;
  status: "OPEN" | "CLOSED";
}
