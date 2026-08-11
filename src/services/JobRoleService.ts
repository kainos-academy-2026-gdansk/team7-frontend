import { isAxiosError } from "axios";
import type { AxiosInstance } from "axios";
import type { CreateJobRoleDto } from "../Dto/CreateJobRoleDto";
import type { UpdateJobRoleDto } from "../Dto/UpdateJobRoleDto";
import { type JobRole, type JobRoleDetailed, JobRoleStatus } from "../models/JobRole";

export class JobRoleNotFoundError extends Error {
  constructor(id: number) {
    super(`Job role with ID ${id} not found`);
    this.name = "JobRoleNotFoundError";
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
      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 404) {
        throw new JobRoleNotFoundError(id);
      }
      throw error;
    }
  }
}
