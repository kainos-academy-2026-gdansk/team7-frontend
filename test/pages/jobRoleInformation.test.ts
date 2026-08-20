import request from "supertest";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import app from "../../src/app";
import { JobRoleNotFoundError, JobRoleService } from "../../src/services/JobRoleService";

const apiClient = vi.hoisted(() => ({ get: vi.fn(), post: vi.fn(), put: vi.fn() }));

vi.mock("axios", () => ({
  default: { create: () => apiClient },
  isAxiosError: (error: unknown) => Boolean((error as { isAxiosError?: boolean })?.isAxiosError),
}));

afterEach(() => {
  vi.restoreAllMocks();
});

const jobRoleDetail = {
  id: 1,
  jobRoleName: "Front-End Engineer",
  description: "Build amazing web interfaces",
  responsibilities: "Develop and maintain frontend components",
  sharepointUrl: "https://sharepoint.com/sites/jobs/front-end-engineer",
  location: "Gdansk",
  capability: "Engineering",
  band: "Associate",
  closingDate: "2026-08-31T00:00:00.000Z",
  status: "OPEN",
  numberOfOpenPositions: 3,
};

describe("GET /job-roles/:id", () => {
  describe("when job role exists", () => {
    beforeEach(() => {
      vi.clearAllMocks();
      apiClient.get.mockResolvedValue({ data: jobRoleDetail });
    });

    it("renders the job role detail page with 200 status", async () => {
      const result = await request(app).get("/job-roles/1");

      expect(result.status).toBe(200);
      expect(apiClient.get).toHaveBeenCalledWith("/api/job-roles/1");
      expect(result.text).toContain("Front-End Engineer");
    });

    it("displays all job role information", async () => {
      const result = await request(app).get("/job-roles/1");

      expect(result.text).toContain("Build amazing web interfaces");
      expect(result.text).toContain("Develop and maintain frontend components");
      expect(result.text).toContain("Gdansk");
      expect(result.text).toContain("Engineering");
      expect(result.text).toContain("Associate");
      expect(result.text).toContain("3");
      expect(result.text).toContain("31 August 2026");
    });

    it("displays the SharePoint link", async () => {
      const result = await request(app).get("/job-roles/1");

      expect(result.text).toContain("https://sharepoint.com/sites/jobs/front-end-engineer");
    });

    it("displays job role status", async () => {
      const result = await request(app).get("/job-roles/1");

      expect(result.text).toContain("OPEN");
    });

    it("provides a back link to job roles list", async () => {
      const result = await request(app).get("/job-roles/1");

      expect(result.text).toContain("Back to job roles");
      expect(result.text).toContain('href="/job-roles"');
    });

    it("shows an unauthenticated user the application banner with a login link", async () => {
      const result = await request(app).get("/job-roles/1");

      expect(result.text).toContain("Interested in this role?");
      expect(result.text).toContain('href="/login" class="govuk-button kainos-button"');
      expect(result.text).toContain("Log in to apply for this role");
      expect(result.text).not.toContain('href="/job-roles/1/apply"');
    });

    it("uses sequential heading levels on the job role detail page", async () => {
      const result = await request(app).get("/job-roles/1");

      expect(result.text).toContain(
        '<h2 class="kainos-job-detail__section-title">Description</h2>',
      );
      expect(result.text).not.toContain('<h3 class="kainos-job-detail__section-title">');
    });
  });

  describe("when description is missing", () => {
    beforeEach(() => {
      vi.clearAllMocks();
      apiClient.get.mockResolvedValue({
        data: { ...jobRoleDetail, description: null },
      });
    });

    it("displays a fallback message", async () => {
      const result = await request(app).get("/job-roles/1");

      expect(result.text).toContain("There was no description provided for this role");
    });
  });

  describe("when responsibilities are missing", () => {
    beforeEach(() => {
      vi.clearAllMocks();
      apiClient.get.mockResolvedValue({
        data: { ...jobRoleDetail, responsibilities: "" },
      });
    });

    it("displays a SharePoint link fallback message", async () => {
      const result = await request(app).get("/job-roles/1");

      expect(result.text).toContain(
        "Check out the SharePoint link for more information on this role.",
      );
    });
  });

  describe("when SharePoint link is missing", () => {
    beforeEach(() => {
      vi.clearAllMocks();
      apiClient.get.mockResolvedValue({
        data: { ...jobRoleDetail, sharepointUrl: null },
      });
    });

    it("does not render the SharePoint link section", async () => {
      const result = await request(app).get("/job-roles/1");

      expect(result.text).not.toContain("SharePoint link");
    });
  });

  describe("when job role does not exist (404)", () => {
    beforeEach(() => {
      vi.clearAllMocks();
      vi.spyOn(JobRoleService.prototype, "getJobRoleById").mockRejectedValue(
        new JobRoleNotFoundError(999),
      );
    });

    it("answers 404 with error page", async () => {
      const result = await request(app).get("/job-roles/999");

      expect(result.status).toBe(404);
      expect(result.text).toContain("Job role not found");
    });

    it("keeps the error out of the page", async () => {
      const result = await request(app).get("/job-roles/999");

      expect(result.text).not.toContain("404");
    });

    it("provides a link back to job roles list", async () => {
      const result = await request(app).get("/job-roles/999");

      expect(result.text).toContain("/job-roles");
    });
  });

  describe("when the API is unreachable (503)", () => {
    beforeEach(() => {
      vi.clearAllMocks();
      apiClient.get.mockRejectedValue(new Error("connect ECONNREFUSED 127.0.0.1:3000"));
    });

    it("answers 503 with a message instead of crashing", async () => {
      const result = await request(app).get("/job-roles/1");

      expect(result.status).toBe(503);
      expect(result.text).toContain("unavailable");
    });

    it("keeps the underlying error out of the page", async () => {
      const result = await request(app).get("/job-roles/1");

      expect(result.text).not.toContain("ECONNREFUSED");
    });
  });
});
