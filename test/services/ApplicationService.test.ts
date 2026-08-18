import type { AxiosInstance } from "axios";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { CreateApplicationDto } from "../../src/Dto/CreateApplicationDto";
import { ApplicationService } from "../../src/services/ApplicationService";

const apiClient = {
  get: vi.fn(),
  post: vi.fn(),
};

const application = {
  id: 3,
  jobRoleId: 7,
  roleName: "Front-End Engineer",
  experience: "Two years of experience",
  salaryExpectation: "45000",
  skills: "TypeScript",
  status: "IN_PROGRESS",
  createdAt: "2026-08-17T00:00:00.000Z",
  updatedAt: "2026-08-17T00:00:00.000Z",
};

const service = new ApplicationService(apiClient as unknown as AxiosInstance);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("ApplicationService", () => {
  it("submits an application with the session token", async () => {
    const payload: CreateApplicationDto = {
      experience: "Two years of experience",
      salaryExpectation: "45000",
      skills: "TypeScript",
    };
    apiClient.post.mockResolvedValue({ data: application });

    await expect(service.createApplication(7, payload, "jwt-token")).resolves.toEqual(application);

    expect(apiClient.post).toHaveBeenCalledWith("/api/job-roles/7/apply", payload, {
      headers: { Authorization: "Bearer jwt-token" },
    });
  });

  it("gets the current user's applications with the session token", async () => {
    apiClient.get.mockResolvedValue({ data: [application] });

    await expect(service.getMyApplications("jwt-token")).resolves.toEqual([application]);

    expect(apiClient.get).toHaveBeenCalledWith("/api/applications", {
      headers: { Authorization: "Bearer jwt-token" },
    });
  });
});
