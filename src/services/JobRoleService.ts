import type { AxiosInstance } from "axios";
import type { CreateJobRoleDto } from "../Dto/CreateJobRoleDto";
import type { UpdateJobRoleDto } from "../Dto/UpdateJobRoleDto";
import type { JobRole, JobRoleDetailed } from "../models/JobRole";
export class JobRoleService {
  constructor(private readonly apiClient: AxiosInstance) {
    this.apiClient = apiClient;
  }

  async getJobRoles(): Promise<JobRole[]> {
    const response = await this.apiClient.get<JobRole[]>("/api/job-roles");

    // The API returns every role, so applicants only see the open ones.
    return response.data.filter((jobRole) => jobRole.status === "OPEN");
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
}
