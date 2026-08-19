import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import app from "../../src/app";

const apiClient = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
  delete: vi.fn(),
}));

vi.mock("axios", () => ({
  default: { create: () => apiClient },
  isAxiosError: (error: unknown) => Boolean((error as { isAxiosError?: boolean })?.isAxiosError),
}));

const jobRole = {
  id: 7,
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

const loginAsAdmin = async () => {
  apiClient.post.mockResolvedValueOnce({
    data: {
      token: "admin-token",
      user: { id: 1, email: "admin@example.com", role: "ADMIN" },
    },
  });

  const agent = request.agent(app);
  await agent.post("/login").type("form").send({
    email: "admin@example.com",
    password: "Password1!",
  });

  return agent;
};

beforeEach(() => {
  vi.clearAllMocks();
  apiClient.get.mockResolvedValue({ data: jobRole });
  apiClient.delete.mockResolvedValue({ status: 204 });
});

describe("job-role deletion", () => {
  it("redirects a guest away from delete confirmation", async () => {
    const response = await request(app).get("/job-roles/7/delete");

    expect(response.status).toBe(302);
    expect(response.headers.location).toBe("/");
    expect(apiClient.get).not.toHaveBeenCalled();
  });

  it("renders delete confirmation for an administrator", async () => {
    const agent = await loginAsAdmin();

    const response = await agent.get("/job-roles/7/delete");

    expect(response.status).toBe(200);
    expect(response.text).toContain("Delete Front-End Engineer?");
    expect(response.text).toContain('action="/job-roles/7/delete"');
  });

  it("deletes a role with the administrator token and redirects to the list", async () => {
    const agent = await loginAsAdmin();

    const response = await agent.post("/job-roles/7/delete");

    expect(response.status).toBe(302);
    expect(response.headers.location).toBe("/job-roles");
    expect(apiClient.delete).toHaveBeenCalledWith("/api/admin/job-roles/7", {
      headers: { Authorization: "Bearer admin-token" },
    });
  });
});
