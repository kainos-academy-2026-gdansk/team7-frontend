import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import app from "../../src/app";

const apiClient = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
  patch: vi.fn(),
}));

vi.mock("axios", () => ({
  default: { create: () => apiClient },
  isAxiosError: (error: unknown) => Boolean((error as { isAxiosError?: boolean })?.isAxiosError),
}));

const applications = [
  {
    id: 4,
    applicantEmail: "applicant@example.com",
    status: "IN_PROGRESS",
    experience: "Three years",
    salaryExpectation: "50000",
    skills: "TypeScript",
  },
];

const loginAs = async (role: "ADMIN" | "USER") => {
  apiClient.post.mockResolvedValueOnce({
    data: {
      token: `${role.toLowerCase()}-token`,
      user: { id: 1, email: `${role.toLowerCase()}@example.com`, role },
    },
  });

  const agent = request.agent(app);
  await agent
    .post("/login")
    .type("form")
    .send({
      email: `${role.toLowerCase()}@example.com`,
      password: "Password1!",
    });

  return agent;
};

beforeEach(() => {
  vi.clearAllMocks();
  apiClient.get.mockResolvedValue({ data: applications });
  apiClient.patch.mockResolvedValue({ data: { status: "HIRED" } });
});

describe("application administration", () => {
  it("redirects a guest away from the applications list", async () => {
    const response = await request(app).get("/admin/job-roles/7/applications");

    expect(response.status).toBe(302);
    expect(response.headers.location).toBe("/");
    expect(apiClient.get).not.toHaveBeenCalled();
  });

  it("redirects an applicant away from the applications list", async () => {
    const agent = await loginAs("USER");

    const response = await agent.get("/admin/job-roles/7/applications");

    expect(response.status).toBe(302);
    expect(response.headers.location).toBe("/");
    expect(apiClient.get).not.toHaveBeenCalled();
  });

  it("renders applications and only shows status actions for in-progress applications", async () => {
    const agent = await loginAs("ADMIN");

    const response = await agent.get("/admin/job-roles/7/applications");

    expect(response.status).toBe(200);
    expect(response.text).toContain("applicant@example.com");
    expect(response.text).toContain("Hire");
    expect(response.text).toContain("Reject");
    expect(response.text).toContain('href="/admin/job-roles/7/applications/4/hire"');
    expect(apiClient.get).toHaveBeenCalledWith("/api/admin/job-roles/7/applications", {
      headers: { Authorization: "Bearer admin-token" },
    });
  });

  it("renders the hire confirmation for an administrator", async () => {
    const agent = await loginAs("ADMIN");

    const response = await agent.get("/admin/job-roles/7/applications/4/hire");

    expect(response.status).toBe(200);
    expect(response.text).toContain("Hire applicant@example.com?");
    expect(response.text).toContain('action="/admin/job-roles/7/applications/4/hire"');
  });

  it("patches an application to hired and redirects to its applications list", async () => {
    const agent = await loginAs("ADMIN");

    const response = await agent.post("/admin/job-roles/7/applications/4/hire");

    expect(response.status).toBe(302);
    expect(response.headers.location).toBe("/admin/job-roles/7/applications");
    expect(apiClient.patch).toHaveBeenCalledWith(
      "/api/admin/job-roles/7/applications/4",
      { status: "HIRED" },
      { headers: { Authorization: "Bearer admin-token" } },
    );
  });

  it("patches an application to rejected and redirects to its applications list", async () => {
    const agent = await loginAs("ADMIN");
    apiClient.patch.mockResolvedValue({ data: { status: "REJECTED" } });

    const response = await agent.post("/admin/job-roles/7/applications/4/reject");

    expect(response.status).toBe(302);
    expect(response.headers.location).toBe("/admin/job-roles/7/applications");
    expect(apiClient.patch).toHaveBeenCalledWith(
      "/api/admin/job-roles/7/applications/4",
      { status: "REJECTED" },
      { headers: { Authorization: "Bearer admin-token" } },
    );
  });

  it("redirects to login and clears the expired administrator session after an API 401", async () => {
    const agent = await loginAs("ADMIN");
    apiClient.get.mockRejectedValue({ isAxiosError: true, response: { status: 401 } });

    const response = await agent.get("/admin/job-roles/7/applications");

    expect(response.status).toBe(302);
    expect(response.headers.location).toBe("/login");
  });
});
