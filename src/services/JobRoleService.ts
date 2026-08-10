import axios from "axios";
import type { JobRole } from "../models/JobRole";

const API_BASE_URL = process.env.API_BASE_URL ?? "http://localhost:3000";

export async function getJobRoles(): Promise<JobRole[]> {
  const response = await axios.get<JobRole[]>(`${API_BASE_URL}/api/job-roles`, {
    timeout: 5000,
  });

  // The API returns every role, so applicants only see the open ones.
  return response.data.filter((jobRole) => jobRole.status === "OPEN");
}
