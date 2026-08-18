import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import app from "../../src/app";

const apiClient = vi.hoisted(() => ({ get: vi.fn(), post: vi.fn() }));

vi.mock("axios", () => ({
  default: { create: () => apiClient },
  isAxiosError: (error: unknown) => Boolean((error as { isAxiosError?: boolean })?.isAxiosError),
}));

const bands = [
  { id: 1, name: "Apprentice" },
  { id: 2, name: "Associate" },
];

const capabilities = [
  { id: 3, name: "Engineering" },
  { id: 4, name: "Data" },
];

const statuses = [
  { statusId: 1, statusName: "OPEN" },
  { statusId: 2, statusName: "CLOSED" },
];

const validForm = {
  roleName: "Front-End Engineer",
  location: "Gdansk",
  bandId: "2",
  capabilityId: "3",
  description: "Builds the client side.",
  responsibilities: "Ship features.",
  numberOfOpenPositions: "3",
  sharepointUrl: "https://example.com/role",
  closingDate: "2026-08-31",
};

const postJobRole = (overrides: Record<string, string> = {}) =>
  adminAgent
    .post("/job-roles/new")
    .type("form")
    .send({ ...validForm, ...overrides });

const apiError = (status: number, data: unknown) =>
  Object.assign(new Error("Request failed"), { isAxiosError: true, response: { status, data } });

let adminAgent: ReturnType<typeof request.agent>;

beforeEach(async () => {
  apiClient.get.mockReset();
  apiClient.post.mockReset();
  apiClient.get.mockImplementation((url: string) => {
    if (url === "/api/bands") return Promise.resolve({ data: bands });
    if (url === "/api/statuses") return Promise.resolve({ data: statuses });
    return Promise.resolve({ data: capabilities });
  });
  apiClient.post
    .mockResolvedValueOnce({
      data: {
        token: "admin-token",
        user: { id: 1, email: "admin@example.com", role: "ADMIN" },
      },
    })
    .mockResolvedValue({ data: {} });

  adminAgent = request.agent(app);
  await adminAgent.post("/login").type("form").send({
    email: "admin@example.com",
    password: "Password1!",
  });
  apiClient.post.mockClear();
});

describe("GET /job-roles/new", () => {
  it("renders the form with bands and capabilities in the dropdowns", async () => {
    const result = await adminAgent.get("/job-roles/new");

    expect(result.status).toBe(200);
    expect(result.text).toContain("Add a job role");
    expect(result.text).toContain('<option value="2"');
    expect(result.text).toContain("Associate");
    expect(result.text).toContain("Engineering");
    expect(result.text).not.toContain("There is a problem");
  });

  it("answers 503 when the reference data cannot be loaded", async () => {
    apiClient.get.mockRejectedValue(new Error("connect ECONNREFUSED 127.0.0.1:3000"));

    const result = await adminAgent.get("/job-roles/new");

    expect(result.status).toBe(503);
    expect(result.text).toContain("The job role form is unavailable");
  });

  it("does not depend on the statuses endpoint, which this form has no field for", async () => {
    apiClient.get.mockImplementation((url: string) => {
      if (url === "/api/bands") return Promise.resolve({ data: bands });
      if (url === "/api/capabilities") return Promise.resolve({ data: capabilities });
      return Promise.reject(new Error("connect ECONNREFUSED 127.0.0.1:3000"));
    });

    const result = await adminAgent.get("/job-roles/new");

    expect(result.status).toBe(200);
    expect(apiClient.get).not.toHaveBeenCalledWith("/api/statuses");
  });
});

describe("POST /job-roles/new", () => {
  it("converts the form values into the payload the API expects", async () => {
    const result = await postJobRole();

    expect(result.status).toBe(302);
    expect(result.headers.location).toBe("/job-roles");
    expect(apiClient.post).toHaveBeenCalledWith(
      "/api/job-roles",
      {
        roleName: "Front-End Engineer",
        location: "Gdansk",
        bandId: 2,
        capabilityId: 3,
        description: "Builds the client side.",
        responsibilities: "Ship features.",
        numberOfOpenPositions: 3,
        sharepointUrl: "https://example.com/role",
        closingDate: "2026-08-31T00:00:00.000Z",
      },
      { headers: { Authorization: "Bearer admin-token" } },
    );
  });

  it("sends null for the optional fields left blank", async () => {
    await postJobRole({
      description: "",
      responsibilities: "",
      numberOfOpenPositions: "",
      sharepointUrl: "",
      closingDate: "",
    });

    expect(apiClient.post.mock.calls[0][1]).toMatchObject({
      description: null,
      responsibilities: null,
      numberOfOpenPositions: null,
      sharepointUrl: null,
      closingDate: null,
    });
  });

  it("rejects a missing role name without calling the API", async () => {
    const result = await postJobRole({ roleName: "  " });

    expect(result.status).toBe(400);
    expect(result.text).toContain("There is a problem");
    expect(result.text).toContain("Enter a role name");
    expect(apiClient.post).not.toHaveBeenCalled();
  });

  it("rejects an unselected band", async () => {
    const result = await postJobRole({ bandId: "" });

    expect(result.status).toBe(400);
    expect(result.text).toContain("Select a band");
    expect(apiClient.post).not.toHaveBeenCalled();
  });

  it("rejects a SharePoint link that is not a URL", async () => {
    const result = await postJobRole({ sharepointUrl: "not-a-link" });

    expect(result.status).toBe(400);
    expect(result.text).toContain("Enter a valid link");
    expect(apiClient.post).not.toHaveBeenCalled();
  });

  it("keeps what the user typed when validation fails", async () => {
    const result = await postJobRole({ roleName: "" });

    expect(result.text).toContain('value="Gdansk"');
  });

  it("shows the errors the API reports against the right fields", async () => {
    apiClient.post.mockRejectedValue(
      apiError(400, { errors: [{ field: "bandId", message: "Band does not exist" }] }),
    );

    const result = await postJobRole();

    expect(result.status).toBe(400);
    expect(result.text).toContain("Band does not exist");
  });

  it("answers 503 when the API is unreachable", async () => {
    apiClient.post.mockRejectedValue(new Error("connect ECONNREFUSED 127.0.0.1:3000"));

    const result = await postJobRole();

    expect(result.status).toBe(503);
    expect(result.text).toContain("The job role could not be saved");
    expect(result.text).not.toContain("ECONNREFUSED");
  });
});
