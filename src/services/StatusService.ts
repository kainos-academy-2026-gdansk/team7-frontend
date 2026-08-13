import type { AxiosInstance } from "axios";
import type { Status } from "../models/Status";

export class StatusService {
  constructor(private readonly apiClient: AxiosInstance) {}

  async getStatuses(): Promise<Status[]> {
    const response = await this.apiClient.get<Status[]>("/api/statuses");

    return response.data;
  }
}
