import type { Request, Response } from "express";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { JobRoleController } from "../../src/controllers/JobRoleController";
import { JobRoleStatus } from "../../src/models/JobRole";
import type { BandService } from "../../src/services/BandService";
import type { CapabilityService } from "../../src/services/CapabilityService";
import { JobRoleNotFoundError, type JobRoleService } from "../../src/services/JobRoleService";

const jobRoleService = {
  getJobRoles: vi.fn(),
  getJobRoleById: vi.fn(),
};

const bandService = {
  getBands: vi.fn(),
};

const capabilityService = {
  getCapabilities: vi.fn(),
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

const createResponse = () => {
  const response = {
    status: vi.fn(),
    render: vi.fn(),
    redirect: vi.fn(),
  };
  response.status.mockReturnValue(response);

  return response;
};

const controller = new JobRoleController(
  jobRoleService as unknown as JobRoleService,
  bandService as unknown as BandService,
  capabilityService as unknown as CapabilityService,
);

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(console, "error").mockImplementation(() => undefined);
});

describe("JobRoleController", () => {
  describe("getJobRolesPage", () => {
    it("renders all job roles returned by the service", async () => {
      const roles = [{ ...jobRole, roleName: jobRole.jobRoleName }];
      const response = createResponse();
      jobRoleService.getJobRoles.mockResolvedValue(roles);

      await controller.getJobRolesPage({} as Request, response as unknown as Response);

      expect(response.render).toHaveBeenCalledWith("pages/jobRoles.njk", {
        jobRoles: roles,
        totalCount: 1,
      });
    });

    it("renders a 503 page when the service fails", async () => {
      const response = createResponse();
      jobRoleService.getJobRoles.mockRejectedValue(new Error("API unavailable"));

      await controller.getJobRolesPage({} as Request, response as unknown as Response);

      expect(response.status).toHaveBeenCalledWith(503);
      expect(response.render).toHaveBeenCalledWith(
        "pages/error.njk",
        expect.objectContaining({
          heading: "Job roles are unavailable",
          retryUrl: "/job-roles",
        }),
      );
    });
  });

  describe("getJobRoleInformationPage", () => {
    it("renders the job role returned by the service", async () => {
      const response = createResponse();
      jobRoleService.getJobRoleById.mockResolvedValue(jobRole);

      await controller.getJobRoleInformationPage(
        { params: { id: "7" } } as unknown as Request,
        response as unknown as Response,
      );

      expect(jobRoleService.getJobRoleById).toHaveBeenCalledWith(7);
      expect(response.render).toHaveBeenCalledWith("pages/jobRoleInformation.njk", { jobRole });
    });

    it("renders a 404 page for JobRoleNotFoundError", async () => {
      const response = createResponse();
      jobRoleService.getJobRoleById.mockRejectedValue(new JobRoleNotFoundError(7));

      await controller.getJobRoleInformationPage(
        { params: { id: "7" } } as unknown as Request,
        response as unknown as Response,
      );

      expect(response.status).toHaveBeenCalledWith(404);
      expect(response.render).toHaveBeenCalledWith(
        "pages/error.njk",
        expect.objectContaining({ heading: "Job role not found" }),
      );
    });

    it("renders a 503 page for other failures", async () => {
      const response = createResponse();
      jobRoleService.getJobRoleById.mockRejectedValue(new Error("API unavailable"));

      await controller.getJobRoleInformationPage(
        { params: { id: "7" } } as unknown as Request,
        response as unknown as Response,
      );

      expect(response.status).toHaveBeenCalledWith(503);
      expect(response.render).toHaveBeenCalledWith(
        "pages/error.njk",
        expect.objectContaining({
          heading: "Job role is unavailable",
          retryUrl: "/job-roles/",
        }),
      );
    });
  });
});
