import axios from "axios";
import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import app from "../../src/app";

vi.mock("axios", () => ({
  default: { get: vi.fn() },
}));

const jobRoles = [
  {
    roleName: "Front-End Engineer",
    location: "Gdansk",
    capability: "Engineering",
    band: "Associate",
    closingDate: "2026-08-31T00:00:00.000Z",
  },
  {
    roleName: "Apprentice Software Engineer",
    location: "Belfast",
    capability: "Engineering",
    band: "Apprentice",
    closingDate: null,
  },
];

describe("GET /job-roles", () => {
  beforeEach(() => {
    vi.mocked(axios.get).mockResolvedValue({ data: jobRoles });
  });

  it("renders a row for every job role", async () => {
    const result = await request(app).get("/job-roles");

    expect(result.status).toBe(200);
    expect(result.text).toContain("Front-End Engineer");
    expect(result.text).toContain("Apprentice Software Engineer");
  });

  it("formats closing dates and handles missing ones", async () => {
    const result = await request(app).get("/job-roles");

    expect(result.text).toContain("31 August 2026");
    expect(result.text).toContain("Not specified");
  });
});
