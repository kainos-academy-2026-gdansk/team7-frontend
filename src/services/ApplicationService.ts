import type { AxiosInstance } from "axios";
import type { CreateApplicationDto } from "../Dto/CreateApplicationDto";
import type { Application } from "../models/Application";
import type { AdminViewApplication } from "../models/Application";

export class ApplicationService {
  constructor(private readonly apiClient: AxiosInstance) {}

<<<<<<< HEAD
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
  async getAllApplications(jobRoleId: number, token: string): Promise<AdminViewApplication[]> {
=======
  async getApplicationsForJobRole(
    jobRoleId: number,
    token: string,
  ): Promise<AdminViewApplication[]> {
>>>>>>> 98e6179 (admin operations on jobrole, displaying applications for role)
    const response = await this.apiClient.get<AdminViewApplication[]>(
      `/api/admin/job-roles/${jobRoleId}/applications`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  }
}
