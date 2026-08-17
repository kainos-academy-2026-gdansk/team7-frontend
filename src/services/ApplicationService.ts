import type { AxiosInstance } from "axios";
import type { AdminViewApplication } from "../models/Application";

export class ApplicationService {
  constructor(private readonly apiClient: AxiosInstance) {}

  async getAllApplications(jobRoleId: number, token: string): Promise<AdminViewApplication[]> {
    const response = await this.apiClient.get<AdminViewApplication[]>(
      `/api/admin/job-roles/${jobRoleId}/applications`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    console.log(response.data);
    return response.data;
  }
}
