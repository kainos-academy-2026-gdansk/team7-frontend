import type { AxiosInstance } from "axios";
import type { Capability } from "../models/Capability";

export class CapabilityService {
  constructor(private readonly apiClient: AxiosInstance) {
    this.apiClient = apiClient;
  }

  async getCapabilities(): Promise<Capability[]> {
    const response = await this.apiClient.get<Capability[]>("/api/capabilities");

    return response.data;
  }
}
