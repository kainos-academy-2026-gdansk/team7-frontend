import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";

import app from "../../src/app";

const apiClient = vi.hoisted(() => ({ get: vi.fn(), post: vi.fn() }));

vi.mock("axios", () => ({
  default: { create: () => apiClient },
  isAxiosError: (error: unknown) => Boolean((error as { isAxiosError?: boolean })?.isAxiosError),
}));

const createAuthenticatedAgent = async () => {
  apiClient.post.mockResolvedValue({
    data: {
      token: "test-jwt-token",
      user: { id: 1, email: "applicant@kainos.com", role: "USER" },
    },
  });

  const agent = request.agent(app);
  await agent.post("/login").type("form").send({
    email: "applicant@kainos.com",
    password: "Password1!",
  });

  return agent;
};

const createAdminAgent = async () => {
  apiClient.post.mockResolvedValue({
    data: {
      token: "test-admin-jwt-token",
      user: { id: 1, email: "admin@kainos.local", role: "ADMIN" },
    },
  });

  const agent = request.agent(app);
  await agent.post("/login").type("form").send({
    email: "admin@kainos.local",
    password: "Admin!123",
  });

  return agent;
};

beforeEach(() => {
  apiClient.get.mockReset();
  apiClient.post.mockReset();
  apiClient.get.mockResolvedValue({ data: [] });
});

describe("GET /my-profile", () => {
  it("redirects an unauthenticated user to the home page", async () => {
    const response = await request(app).get("/my-profile");

    expect(response.status).toBe(302);
    expect(response.headers.location).toBe("/");
    expect(apiClient.get).not.toHaveBeenCalled();
  });

  it("redirects an administrator to the home page", async () => {
    const agent = await createAdminAgent();
    const response = await agent.get("/my-profile");

    expect(response.status).toBe(302);
    expect(response.headers.location).toBe("/");
    expect(apiClient.get).not.toHaveBeenCalled();
  });

  it("renders the empty state when the user has no applications", async () => {
    const agent = await createAuthenticatedAgent();
    const response = await agent.get("/my-profile");

    expect(response.status).toBe(200);
    expect(response.text).toContain("<title>My Profile</title>");
    expect(response.text).toContain("My applications");
    expect(response.text).toContain('class="kainos-empty-state"');
    expect(response.text).toContain("You do not have any applications yet...");
    expect(response.text).toContain('href="/job-roles">Find your next opportunity</a>');
    expect(apiClient.get).toHaveBeenCalledWith("/api/applications", {
      headers: { Authorization: "Bearer test-jwt-token" },
    });
  });

  it("renders the user's applications", async () => {
    const agent = await createAuthenticatedAgent();
    apiClient.get.mockResolvedValue({
      data: [
        {
          id: 3,
          jobRoleId: 7,
          roleName: "Front-End Engineer",
          experience: "Two years of experience",
          salaryExpectation: "45000",
          skills: "TypeScript",
          status: "IN_PROGRESS",
          createdAt: "2026-08-17T00:00:00.000Z",
          updatedAt: "2026-08-17T00:00:00.000Z",
        },
      ],
    });

    const response = await agent.get("/my-profile");

    expect(response.status).toBe(200);
    expect(response.text).toContain("My applications");
    expect(response.text).toContain("Front-End Engineer");
    expect(response.text).toContain("In progress");
    expect(response.text).toContain("Applied on 17 August 2026");
    expect(response.text).toContain('href="/job-roles/7"');
  });

  it("uses status-specific colours for hired and rejected applications", async () => {
    const agent = await createAuthenticatedAgent();
    apiClient.get.mockResolvedValue({
      data: [
        {
          id: 3,
          jobRoleId: 7,
          roleName: "Front-End Engineer",
          experience: "Two years of experience",
          salaryExpectation: "45000",
          skills: "TypeScript",
          status: "HIRED",
          createdAt: "2026-08-17T00:00:00.000Z",
          updatedAt: "2026-08-17T00:00:00.000Z",
        },
        {
          id: 4,
          jobRoleId: 8,
          roleName: "Platform Engineer",
          experience: "Three years of experience",
          salaryExpectation: "50000",
          skills: "Node.js",
          status: "REJECTED",
          createdAt: "2026-08-17T00:00:00.000Z",
          updatedAt: "2026-08-17T00:00:00.000Z",
        },
      ],
    });

    const response = await agent.get("/my-profile");

    expect(response.text).toContain("Hired");
    expect(response.text).toContain("Rejected");
    expect(response.text).toContain("kainos-profile__application-status--hired");
    expect(response.text).toContain("kainos-profile__application-status--rejected");
  });

  it("renders a safe error page when applications are unavailable", async () => {
    const agent = await createAuthenticatedAgent();
    apiClient.get.mockRejectedValue(new Error("Connection refused"));

    const response = await agent.get("/my-profile");

    expect(response.status).toBe(503);
    expect(response.text).toContain("Applications are unavailable");
    expect(response.text).not.toContain("Connection refused");
  });
});
