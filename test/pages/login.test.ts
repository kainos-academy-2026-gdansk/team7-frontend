import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "../../src/app";

describe("GET /login", () => {
  it("renders the login page", async () => {
    const response = await request(app).get("/login");

    expect(response.status).toBe(200);
    expect(response.text).toContain("<title>Log in</title>");
    expect(response.text).toContain("Email address");
    expect(response.text).toContain("Password");
  });

  it("sends the form over POST so credentials never reach the URL", async () => {
    const response = await request(app).get("/login");

    expect(response.text).toContain('method="post"');
    expect(response.text).toContain('action="/login"');
  });

  it("masks the password field", async () => {
    const response = await request(app).get("/login");

    expect(response.text).toContain('name="password"');
    expect(response.text).toContain('type="password"');
  });

  it("links to the login page from the header", async () => {
    const response = await request(app).get("/");

    expect(response.text).toContain('href="/login"');
  });
});
