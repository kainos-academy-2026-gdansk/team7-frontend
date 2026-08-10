import axios from "axios";
import type { JobRole } from "../models/JobRole";

const API_BASE_URL = process.env.API_BASE_URL ?? "http://localhost:3000";

export async function getJobRoles(): Promise<JobRole[]> {
  const response = await axios.get<JobRole[]>(`${API_BASE_URL}/job-roles`, {
    timeout: 5000,
  });

  return response.data;
}
