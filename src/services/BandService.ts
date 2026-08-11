import type { AxiosInstance } from "axios";
import type { Band } from "../models/Band";

export class BandService {
  constructor(private readonly apiClient: AxiosInstance) {}

  async getBands(): Promise<Band[]> {
    const response = await this.apiClient.get<Band[]>("/api/bands");

    return response.data;
  }
}
