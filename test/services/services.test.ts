import type { AxiosInstance } from "axios";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { CreateJobRoleDto } from "../../src/Dto/CreateJobRoleDto";
import type { LoginDto } from "../../src/Dto/LoginDto";
import type { RegisterDto } from "../../src/Dto/RegisterDto";
import type { UpdateJobRoleDto } from "../../src/Dto/UpdateJobRoleDto";
import { AuthService } from "../../src/services/AuthService";
import { BandService } from "../../src/services/BandService";
import { CapabilityService } from "../../src/services/CapabilityService";
import { JobRoleNotFoundError, JobRoleService } from "../../src/services/JobRoleService";
import { StatusService } from "../../src/services/StatusService";

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
  sharepointUrl: "https://example.sharepoint.com/role",
  location: "Gdansk",
  capability: "Engineering",
  band: "Associate",
  closingDate: "2026-08-31T00:00:00.000Z",
  status: "OPEN",
  numberOfOpenPositions: 3,
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("AuthService", () => {
  const service = new AuthService(apiClient as unknown as AxiosInstance);

  it("registers a user with the supplied credentials", async () => {
    const credentials: RegisterDto = {
      email: "applicant@example.com",
      password: "Password!",
    };
    const registeredUser = {
      id: 1,
      email: "applicant@example.com",
      role: "USER",
    };
    apiClient.post.mockResolvedValue({ data: registeredUser });

    await expect(service.register(credentials)).resolves.toEqual(registeredUser);
    expect(apiClient.post).toHaveBeenCalledWith("/api/auth/register", credentials);
  });

  it("logs in with the supplied credentials", async () => {
    const credentials: LoginDto = {
      email: "applicant@example.com",
      password: "Password!",
    };
    const loginResponse = {
      token: "jwt-token",
      user: {
        id: 1,
        email: "applicant@example.com",
        role: "USER",
      },
    };
    apiClient.post.mockResolvedValue({ data: loginResponse });

    await expect(service.login(credentials)).resolves.toEqual(loginResponse);
    expect(apiClient.post).toHaveBeenCalledWith("/api/auth/login", credentials);
  });
});

describe("JobRoleService", () => {
  const service = new JobRoleService(apiClient as unknown as AxiosInstance);

  it("returns only open job roles", async () => {
    const openRole = { ...jobRole, roleName: jobRole.jobRoleName };
    const closedRole = {
      ...openRole,
      id: 8,
      roleName: "Closed role",
      status: "CLOSED",
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
      numberOfOpenPositions: 3,
      sharepointUrl: null,
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
      statusId: 1,
      bandName: "Associate",
      capabilityName: "Engineering",
      description: null,
      responsibilities: null,
      sharepointUrl: null,
      numberOfOpenPositions: 2,
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

describe("StatusService", () => {
  it("returns statuses from the API", async () => {
    const statuses = [
      { statusId: 1, statusName: "OPEN" },
      { statusId: 2, statusName: "CLOSED" },
    ];
    apiClient.get.mockResolvedValue({ data: statuses });

    await expect(
      new StatusService(apiClient as unknown as AxiosInstance).getStatuses(),
    ).resolves.toEqual(statuses);
    expect(apiClient.get).toHaveBeenCalledWith("/api/statuses");
  });
});
