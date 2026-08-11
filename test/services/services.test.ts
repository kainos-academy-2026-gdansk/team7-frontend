import type { AxiosInstance } from "axios";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { CreateJobRoleDto } from "../../src/Dto/CreateJobRoleDto";
import type { UpdateJobRoleDto } from "../../src/Dto/UpdateJobRoleDto";
import { JobRoleStatus } from "../../src/models/JobRole";
import { BandService } from "../../src/services/BandService";
import { CapabilityService } from "../../src/services/CapabilityService";
import { JobRoleNotFoundError, JobRoleService } from "../../src/services/JobRoleService";

const apiClient = {
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
};

const jobRole = {
  id: 7,
  jobRoleName: "Front-End Engineer",
  description: "Build interfaces.",
  responsibilities: "Ship features.",
  link: "https://example.sharepoint.com/role",
  location: "Gdansk",
  capability: "Engineering",
  band: "Associate",
  closingDate: "2026-08-31T00:00:00.000Z",
  status: JobRoleStatus.OPEN,
  numberOfOpenPositions: 3,
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("JobRoleService", () => {
  const service = new JobRoleService(apiClient as unknown as AxiosInstance);

  it("returns only open job roles", async () => {
    const openRole = { ...jobRole, roleName: jobRole.jobRoleName };
    const closedRole = {
      ...openRole,
      id: 8,
      roleName: "Closed role",
      status: JobRoleStatus.CLOSED,
    };
    apiClient.get.mockResolvedValue({ data: [openRole, closedRole] });

    await expect(service.getJobRoles()).resolves.toEqual([openRole]);
    expect(apiClient.get).toHaveBeenCalledWith("/api/job-roles");
  });

  it("creates a job role with the supplied payload", async () => {
    const payload: CreateJobRoleDto = {
      roleName: "Front-End Engineer",
      location: "Gdansk",
      bandId: 2,
      capabilityId: 3,
      description: null,
      responsibilities: null,
      openPositions: 3,
      sharePointLink: null,
      closingDate: null,
    };
    apiClient.post.mockResolvedValue({ data: jobRole });

    await expect(service.createJobRole(payload)).resolves.toEqual(jobRole);
    expect(apiClient.post).toHaveBeenCalledWith("/api/job-roles", payload);
  });

  it("gets one job role by id", async () => {
    apiClient.get.mockResolvedValue({ data: jobRole });

    await expect(service.getJobRoleById(7)).resolves.toEqual(jobRole);
    expect(apiClient.get).toHaveBeenCalledWith("/api/job-roles/7");
  });

  it("updates one job role with the supplied payload", async () => {
    const payload: UpdateJobRoleDto = {
      jobRoleName: "Senior Front-End Engineer",
      location: "Gdansk",
      status: JobRoleStatus.OPEN,
      bandName: "Associate",
      capabilityName: "Engineering",
      description: null,
      responsibilities: null,
      sharePointLink: null,
      openPositions: 2,
      closingDate: null,
    };
    apiClient.put.mockResolvedValue({ data: jobRole });

    await expect(service.updateJobRole(7, payload)).resolves.toEqual(jobRole);
    expect(apiClient.put).toHaveBeenCalledWith("/api/job-roles/7", payload);
  });

  describe("getJobRoleInformation", () => {
    it("gets one job role with a request timeout", async () => {
      apiClient.get.mockResolvedValue({ data: jobRole });

      await expect(service.getJobRoleInformation(7)).resolves.toEqual(jobRole);
      expect(apiClient.get).toHaveBeenCalledWith("/api/job-roles/7", { timeout: 5000 });
    });

    it("translates an API 404 into JobRoleNotFoundError", async () => {
      apiClient.get.mockRejectedValue(
        Object.assign(new Error("Request failed"), { response: { status: 404 } }),
      );

      await expect(service.getJobRoleInformation(7)).rejects.toEqual(new JobRoleNotFoundError(7));
    });

    it("rethrows other API failures", async () => {
      const error = new Error("API unavailable");
      apiClient.get.mockRejectedValue(error);

      await expect(service.getJobRoleInformation(7)).rejects.toBe(error);
    });
  });
});

describe("BandService", () => {
  it("returns bands from the API", async () => {
    const bands = [{ id: 2, name: "Associate" }];
    apiClient.get.mockResolvedValue({ data: bands });

    await expect(
      new BandService(apiClient as unknown as AxiosInstance).getBands(),
    ).resolves.toEqual(bands);
    expect(apiClient.get).toHaveBeenCalledWith("/api/bands");
  });
});

describe("CapabilityService", () => {
  it("returns capabilities from the API", async () => {
    const capabilities = [{ id: 3, name: "Engineering" }];
    apiClient.get.mockResolvedValue({ data: capabilities });

    await expect(
      new CapabilityService(apiClient as unknown as AxiosInstance).getCapabilities(),
    ).resolves.toEqual(capabilities);
    expect(apiClient.get).toHaveBeenCalledWith("/api/capabilities");
  });
});
