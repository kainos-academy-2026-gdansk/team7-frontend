import axios, { isAxiosError } from "axios";
import { type JobRole, type JobRoleDetailed, JobRoleStatus } from "../models/JobRole";

const API_BASE_URL = process.env.API_BASE_URL ?? "http://localhost:3000";

export class JobRoleNotFoundError extends Error {
  constructor(id: number) {
    super(`Job role with ID ${id} not found`);
    this.name = "JobRoleNotFoundError";
  }
}

export async function getJobRoles(): Promise<JobRole[]> {
  const response = await axios.get<JobRole[]>(`${API_BASE_URL}/api/job-roles`, {
    timeout: 5000,
  });

  // The API returns every role, so applicants only see the open ones.
  return response.data.filter((jobRole) => jobRole.status === JobRoleStatus.OPEN);
}

export async function getJobRoleInformation(id: number): Promise<JobRoleDetailed> {
  try {
    const response = await axios.get<JobRoleDetailed>(`${API_BASE_URL}/api/job-roles/${id}`, {
      timeout: 5000,
    });
    return response.data;
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) {
      throw new JobRoleNotFoundError(id);
    }
    throw error;
  }
}
