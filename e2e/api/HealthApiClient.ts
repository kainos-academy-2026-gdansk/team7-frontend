import type { APIRequestContext, APIResponse } from "@playwright/test";

export class HealthApiClient {
  constructor(private readonly request: APIRequestContext) {}

  public async getHealth(): Promise<APIResponse> {
    return this.request.get("/health");
  }
}
