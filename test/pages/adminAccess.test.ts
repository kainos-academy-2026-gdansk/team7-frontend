import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import app from "../../src/app";

const apiClient = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
  patch: vi.fn(),
}));

vi.mock("axios", () => ({
  default: { create: () => apiClient },
  isAxiosError: (error: unknown) => Boolean((error as { isAxiosError?: boolean })?.isAxiosError),
}));

const jobRole = {
  id: 7,
  roleName: "Front-End Engineer",
  jobRoleName: "Front-End Engineer",
  description: "Build interfaces.",
  responsibilities: "Ship features.",
  sharepointUrl: null,
  location: "Gdansk",
  capability: "Engineering",
  band: "Associate",
  closingDate: null,
  status: "OPEN",
  numberOfOpenPositions: 3,
};

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
  apiClient.post.mockClear();

  return agent;
};

beforeEach(() => {
  vi.clearAllMocks();
  apiClient.get.mockResolvedValue({ data: jobRole });
});

describe("administrator-only job-role actions", () => {
  it("redirects a guest away from every protected job-role route", async () => {
    const requests = [
      () => request(app).get("/job-roles/new"),
      () => request(app).post("/job-roles/new"),
      () => request(app).get("/job-roles/7/edit"),
      () => request(app).post("/job-roles/7/edit"),
      () => request(app).get("/job-roles/7/delete"),
      () => request(app).post("/job-roles/7/delete"),
    ];
    const responses = [];

    for (const requestToProtectedRoute of requests) {
      responses.push(await requestToProtectedRoute());
    }

    for (const response of responses) {
      expect(response.status).toBe(302);
      expect(response.headers.location).toBe("/");
    }
  });

  it("redirects an applicant away from every protected job-role route", async () => {
    const agent = await loginAs("USER");

    const requests = [
      () => agent.get("/job-roles/new"),
      () => agent.post("/job-roles/new"),
      () => agent.get("/job-roles/7/edit"),
      () => agent.post("/job-roles/7/edit"),
      () => agent.get("/job-roles/7/delete"),
      () => agent.post("/job-roles/7/delete"),
    ];
    const responses = [];

    for (const requestToProtectedRoute of requests) {
      responses.push(await requestToProtectedRoute());
    }

    for (const response of responses) {
      expect(response.status).toBe(302);
      expect(response.headers.location).toBe("/");
    }
  });

  it("shows administrator controls on job-role list and detail pages", async () => {
    apiClient.get.mockImplementation((url: string) => {
      if (url === "/api/job-roles") {
        return Promise.resolve({ data: [jobRole] });
      }

      return Promise.resolve({ data: jobRole });
    });
    const agent = await loginAs("ADMIN");

    const listResponse = await agent.get("/job-roles");
    const detailResponse = await agent.get("/job-roles/7");

    expect(listResponse.text).toContain('href="/job-roles/new"');
    expect(detailResponse.text).toContain('href="/job-roles/7/edit"');
    expect(detailResponse.text).toContain('href="/job-roles/7/delete"');
    expect(detailResponse.text).toContain('href="/admin/job-roles/7/applications"');
  });

  it("hides administrator controls from an applicant", async () => {
    apiClient.get.mockImplementation((url: string) => {
      if (url === "/api/job-roles") {
        return Promise.resolve({ data: [jobRole] });
      }

      return Promise.resolve({ data: jobRole });
    });
    const agent = await loginAs("USER");

    const listResponse = await agent.get("/job-roles");
    const detailResponse = await agent.get("/job-roles/7");

    expect(listResponse.text).not.toContain('href="/job-roles/new"');
    expect(detailResponse.text).not.toContain('href="/job-roles/7/edit"');
    expect(detailResponse.text).not.toContain('href="/job-roles/7/delete"');
    expect(detailResponse.text).not.toContain('href="/admin/job-roles/7/applications"');
  });
});
