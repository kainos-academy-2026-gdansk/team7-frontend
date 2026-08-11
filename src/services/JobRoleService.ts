import type { AxiosInstance } from "axios";
import type { CreateJobRoleDto } from "../Dto/CreateJobRoleDto";
import type { UpdateJobRoleDto } from "../Dto/UpdateJobRoleDto";
import { type JobRole, type JobRoleDetailed, JobRoleStatus } from "../models/JobRole";

const ALLOWED_DOMAINS = ["sharepoint.com"];

export class JobRoleNotFoundError extends Error {
  constructor(id: number) {
    super(`Job role with ID ${id} not found`);
    this.name = "JobRoleNotFoundError";
  }
}

function isValidSharePointUrl(url: string | null): boolean {
  if (!url) return true;

  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.protocol !== "https:") return false;
    return ALLOWED_DOMAINS.some((domain) => parsedUrl.hostname.endsWith(domain));
  } catch {
    return false;
  }
}

export class JobRoleService {
  constructor(private readonly apiClient: AxiosInstance) {
    this.apiClient = apiClient;
  }

  async getJobRoles(): Promise<JobRole[]> {
    const response = await this.apiClient.get<JobRole[]>("/api/job-roles");

    return response.data.filter((jobRole) => jobRole.status === JobRoleStatus.OPEN);
  }

  async createJobRole(jobRole: CreateJobRoleDto): Promise<JobRole> {
    const response = await this.apiClient.post<JobRole>("/api/job-roles", jobRole);
    return response.data;
  }

  async getJobRoleById(id: number): Promise<JobRoleDetailed> {
    const response = await this.apiClient.get<JobRoleDetailed>(`/api/job-roles/${id}`);

    return response.data;
  }

  async updateJobRole(id: number, jobRole: UpdateJobRoleDto): Promise<JobRoleDetailed> {
    const response = await this.apiClient.put<JobRoleDetailed>(`/api/job-roles/${id}`, jobRole);

    return response.data;
  }

  async getJobRoleInformation(id: number): Promise<JobRoleDetailed> {
    try {
      const response = await this.apiClient.get<JobRoleDetailed>(`/api/job-roles/${id}`, {
        timeout: 5000,
      });

      const jobRole = response.data;

      if (!isValidSharePointUrl(jobRole.link)) {
        jobRole.link = null;
      }

      return jobRole;
    } catch (error) {
      if (error instanceof Error && "response" in error) {
        const response = (error as { response?: { status: number } }).response;
        if (response?.status === 404) {
          throw new JobRoleNotFoundError(id);
        }
      }
      throw error;
    }
  }
}
