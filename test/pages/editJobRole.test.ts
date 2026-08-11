import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import app from "../../src/app";

const apiClient = vi.hoisted(() => ({ get: vi.fn(), post: vi.fn(), put: vi.fn() }));

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

const existingJobRole = {
  id: 7,
  jobRoleName: "Front-End Engineer",
  description: "Builds the client side.",
  responsibilities: "Ship features.",
  link: "https://example.com/role",
  location: "Gdansk",
  capability: "Engineering",
  band: "Associate",
  closingDate: "2026-08-31T00:00:00.000Z",
  status: "OPEN",
  numberOfOpenPositions: 3,
};

const validForm = {
  jobRoleName: "Senior Front-End Engineer",
  location: "Belfast",
  status: "CLOSED",
  bandName: "Associate",
  capabilityName: "Engineering",
  description: "Builds the client side.",
  responsibilities: "Ship features.",
  openPositions: "3",
  sharePointLink: "https://example.com/role",
  closingDate: "2026-08-31",
};

const editJobRole = (overrides: Record<string, string> = {}, id = 7) =>
  request(app)
    .post(`/job-roles/${id}/edit`)
    .type("form")
    .send({ ...validForm, ...overrides });

const apiError = (status: number, data: unknown = {}) =>
  Object.assign(new Error("Request failed"), { isAxiosError: true, response: { status, data } });

beforeEach(() => {
  apiClient.get.mockReset();
  apiClient.put.mockReset();
  apiClient.get.mockImplementation((url: string) => {
    if (url === "/api/bands") return Promise.resolve({ data: bands });
    if (url === "/api/capabilities") return Promise.resolve({ data: capabilities });
    return Promise.resolve({ data: existingJobRole });
  });
  apiClient.put.mockResolvedValue({ data: existingJobRole });
});

describe("GET /job-roles/:id/edit", () => {
  it("prefills the form with the role held by the API", async () => {
    const result = await request(app).get("/job-roles/7/edit");

    expect(result.status).toBe(200);
    expect(apiClient.get).toHaveBeenCalledWith("/api/job-roles/7");
    expect(result.text).toContain('value="Front-End Engineer"');
    expect(result.text).toContain('value="Gdansk"');
    expect(result.text).toContain('value="3"');
    expect(result.text).not.toContain("There is a problem");
  });

  it("trims the timestamp down to what a date input accepts", async () => {
    const result = await request(app).get("/job-roles/7/edit");

    expect(result.text).toContain('value="2026-08-31"');
    expect(result.text).not.toContain("2026-08-31T00:00:00.000Z");
  });

  it("preselects the band, capability and status the role already has", async () => {
    const result = await request(app).get("/job-roles/7/edit");

    expect(result.text).toContain('<option value="Associate" selected>');
    expect(result.text).toContain('<option value="Engineering" selected>');
    expect(result.text).toContain('<option value="OPEN" selected>');
  });

  it("answers 404 when the id is not a positive integer", async () => {
    const result = await request(app).get("/job-roles/drop-table/edit");

    expect(result.status).toBe(404);
    expect(result.text).toContain("Job role not found");
    expect(apiClient.get).not.toHaveBeenCalled();
  });

  it("answers 404 when the API does not know the role", async () => {
    apiClient.get.mockImplementation((url: string) =>
      url === "/api/bands" || url === "/api/capabilities"
        ? Promise.resolve({ data: [] })
        : Promise.reject(apiError(404)),
    );

    const result = await request(app).get("/job-roles/7/edit");

    expect(result.status).toBe(404);
    expect(result.text).toContain("Job role not found");
  });

  it("answers 503 when the API is unreachable", async () => {
    apiClient.get.mockRejectedValue(new Error("connect ECONNREFUSED 127.0.0.1:3000"));

    const result = await request(app).get("/job-roles/7/edit");

    expect(result.status).toBe(503);
    expect(result.text).not.toContain("ECONNREFUSED");
  });
});

describe("POST /job-roles/:id/edit", () => {
  it("sends the payload the update endpoint expects and redirects", async () => {
    const result = await editJobRole();

    expect(result.status).toBe(302);
    expect(result.headers.location).toBe("/job-roles");
    expect(apiClient.put).toHaveBeenCalledWith("/api/job-roles/7", {
      jobRoleName: "Senior Front-End Engineer",
      location: "Belfast",
      status: "CLOSED",
      bandName: "Associate",
      capabilityName: "Engineering",
      description: "Builds the client side.",
      responsibilities: "Ship features.",
      openPositions: 3,
      sharePointLink: "https://example.com/role",
      closingDate: "2026-08-31T00:00:00.000Z",
    });
  });

  it("sends null for the optional fields left blank", async () => {
    await editJobRole({
      description: "",
      responsibilities: "",
      openPositions: "",
      sharePointLink: "",
      closingDate: "",
    });

    expect(apiClient.put.mock.calls[0][1]).toMatchObject({
      description: null,
      responsibilities: null,
      openPositions: null,
      sharePointLink: null,
      closingDate: null,
    });
  });

  it("drops posted fields that are not part of the update payload", async () => {
    await editJobRole({ id: "9", bandId: "2", capabilityId: "3" });

    expect(apiClient.put.mock.calls[0][1]).not.toHaveProperty("id");
    expect(apiClient.put.mock.calls[0][1]).not.toHaveProperty("bandId");
    expect(apiClient.put.mock.calls[0][1]).not.toHaveProperty("capabilityId");
  });

  it("rejects a missing role name without calling the API", async () => {
    const result = await editJobRole({ jobRoleName: "  " });

    expect(result.status).toBe(400);
    expect(result.text).toContain("There is a problem");
    expect(result.text).toContain("Enter a role name");
    expect(apiClient.put).not.toHaveBeenCalled();
  });

  it("rejects an unknown status", async () => {
    const result = await editJobRole({ status: "MAYBE" });

    expect(result.status).toBe(400);
    expect(result.text).toContain("Select a status");
    expect(apiClient.put).not.toHaveBeenCalled();
  });

  it("keeps what the user typed when validation fails", async () => {
    const result = await editJobRole({ jobRoleName: "" });

    expect(result.text).toContain('value="Belfast"');
  });

  it("posts back to the same role after a validation failure", async () => {
    const result = await editJobRole({ jobRoleName: "" });

    expect(result.text).toContain('action="/job-roles/7/edit"');
  });

  it("answers 404 when the id is not a positive integer", async () => {
    const result = await editJobRole({}, 0);

    expect(result.status).toBe(404);
    expect(apiClient.put).not.toHaveBeenCalled();
  });

  it("answers 404 when the role disappeared before the save", async () => {
    apiClient.put.mockRejectedValue(apiError(404));

    const result = await editJobRole();

    expect(result.status).toBe(404);
    expect(result.text).toContain("Job role not found");
  });

  it("shows the errors the API reports against the right fields", async () => {
    apiClient.put.mockRejectedValue(
      apiError(400, { errors: [{ field: "bandName", message: "Band does not exist" }] }),
    );

    const result = await editJobRole();

    expect(result.status).toBe(400);
    expect(result.text).toContain("Band does not exist");
  });

  it("answers 503 when the API is unreachable", async () => {
    apiClient.put.mockRejectedValue(new Error("connect ECONNREFUSED 127.0.0.1:3000"));

    const result = await editJobRole();

    expect(result.status).toBe(503);
    expect(result.text).toContain("The job role could not be updated");
    expect(result.text).not.toContain("ECONNREFUSED");
  });
});
