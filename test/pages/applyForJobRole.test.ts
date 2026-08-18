import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";

import app from "../../src/app";

const apiClient = vi.hoisted(() => ({ get: vi.fn(), post: vi.fn() }));

vi.mock("axios", () => ({
  default: { create: () => apiClient },
  isAxiosError: (error: unknown) => Boolean((error as { isAxiosError?: boolean })?.isAxiosError),
}));

const jobRole = {
  id: 1,
  jobRoleName: "Front-End Engineer",
  description: "Build amazing web interfaces",
  responsibilities: "Develop frontend components",
  sharepointUrl: null,
  location: "Gdansk",
  capability: "Engineering",
  band: "Associate",
  closingDate: "2026-08-31T00:00:00.000Z",
  status: "OPEN",
  numberOfOpenPositions: 3,
};

const validApplication = {
  experience: "Two years building web applications",
  salaryExpectation: "45000",
  skills: "TypeScript, HTML, CSS",
};

const apiError = (status: number, data: unknown) =>
  Object.assign(new Error("Request failed"), {
    isAxiosError: true,
    response: { status, data },
  });

const createAuthenticatedAgent = async () => {
  apiClient.post.mockResolvedValueOnce({
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
  apiClient.post.mockResolvedValueOnce({
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
  vi.clearAllMocks();
  apiClient.get.mockResolvedValue({ data: jobRole });
  apiClient.post.mockResolvedValue({ data: {} });
});

describe("GET /job-roles/:id/apply", () => {
  it("redirects a signed-out visitor to login", async () => {
    const response = await request(app).get("/job-roles/1/apply");

    expect(response.status).toBe(302);
    expect(response.headers.location).toBe("/login");
    expect(apiClient.get).not.toHaveBeenCalled();
  });

  it("redirects an administrator to the home page", async () => {
    const agent = await createAdminAgent();
    const response = await agent.get("/job-roles/1/apply");

    expect(response.status).toBe(302);
    expect(response.headers.location).toBe("/");
    expect(apiClient.get).not.toHaveBeenCalled();
  });

  it("renders the application form for a signed-in user", async () => {
    const agent = await createAuthenticatedAgent();
    const response = await agent.get("/job-roles/1/apply");

    expect(response.status).toBe(200);
    expect(response.text).toContain("Apply for Front-End Engineer");
    expect(response.text).toContain('action="/job-roles/1/apply"');
    expect(response.text).toContain('name="experience"');
    expect(response.text).toContain('name="salaryExpectation"');
    expect(response.text).toContain('name="skills"');
  });
});

describe("POST /job-roles/:id/apply", () => {
  it("rejects invalid form data without calling the application API", async () => {
    const agent = await createAuthenticatedAgent();
    const response = await agent
      .post("/job-roles/1/apply")
      .type("form")
      .send({ ...validApplication, experience: "" });

    expect(response.status).toBe(400);
    expect(response.text).toContain("Enter your experience");
    expect(response.text).toContain('value="45000"');
    expect(apiClient.post).toHaveBeenCalledTimes(1);
  });

  it("submits valid data with the session token and redirects", async () => {
    const agent = await createAuthenticatedAgent();
    const response = await agent.post("/job-roles/1/apply").type("form").send(validApplication);

    expect(response.status).toBe(302);
    expect(response.headers.location).toBe("/job-roles/1");
    expect(apiClient.post).toHaveBeenNthCalledWith(2, "/api/job-roles/1/apply", validApplication, {
      headers: { Authorization: "Bearer test-jwt-token" },
    });
  });

  it("renders a 404 page when the job role no longer exists", async () => {
    const agent = await createAuthenticatedAgent();
    apiClient.post.mockRejectedValueOnce(apiError(404, { message: "Job role not found" }));

    const response = await agent.post("/job-roles/1/apply").type("form").send(validApplication);

    expect(response.status).toBe(404);
    expect(response.text).toContain("Job role not found");
  });

  it("renders a conflict page when the user has already applied", async () => {
    const agent = await createAuthenticatedAgent();
    apiClient.post.mockRejectedValueOnce(
      apiError(409, { message: "You have already applied for this job role" }),
    );

    const response = await agent.post("/job-roles/1/apply").type("form").send(validApplication);

    expect(response.status).toBe(409);
    expect(response.text).toContain("You have already applied for this job role.");
  });

  it("renders a safe 503 page when the application API is unavailable", async () => {
    const agent = await createAuthenticatedAgent();
    apiClient.post.mockRejectedValueOnce(new Error("ECONNREFUSED"));

    const response = await agent.post("/job-roles/1/apply").type("form").send(validApplication);

    expect(response.status).toBe(503);
    expect(response.text).toContain("The application could not be submitted");
    expect(response.text).not.toContain("ECONNREFUSED");
  });
});
