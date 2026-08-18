import type { AxiosInstance } from "axios";
import type { AdminViewApplication } from "../models/Application";
import type { ApplicationStatusChanged, StatusEnum } from "../models/Application";

export class ApplicationService {
  constructor(private readonly apiClient: AxiosInstance) {}

  async getApplicationsForJobRole(
    jobRoleId: number,
    token: string,
  ): Promise<AdminViewApplication[]> {
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

  async changeApplicationStatus(
    applicationId: number,
    jobRoleId: number,
    token: string,
    status: StatusEnum,
  ): Promise<ApplicationStatusChanged> {
    const response = await this.apiClient.patch<ApplicationStatusChanged>(
      `/api/admin/job-roles/${jobRoleId}/applications/${applicationId}`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  }
}
