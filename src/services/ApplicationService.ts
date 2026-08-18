import type { AxiosInstance } from "axios";
import type { CreateApplicationDto } from "../Dto/CreateApplicationDto";
import type { Application } from "../models/Application";

export class ApplicationService {
  constructor(private readonly apiClient: AxiosInstance) {}

  async createApplication(
    jobRoleId: number,
    application: CreateApplicationDto,
    authToken: string,
  ): Promise<Application> {
    const response = await this.apiClient.post<Application>(
      `/api/job-roles/${jobRoleId}/apply`,
      application,
      { headers: { Authorization: `Bearer ${authToken}` } },
    );
    return response.data;
  }

  async getMyApplications(authToken: string): Promise<Application[]> {
    const response = await this.apiClient.get<Application[]>("/api/applications", {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    return response.data;
  }
}
