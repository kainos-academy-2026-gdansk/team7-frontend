import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "../../src/app";

describe("GET /register", () => {
  it("renders the registration page", async () => {
    const response = await request(app).get("/register");

    expect(response.status).toBe(200);
    expect(response.text).toContain("<title>Register</title>");
    expect(response.text).toContain("Email address");
    expect(response.text).toContain("Password");
  });

  it("shows the password requirements", async () => {
    const response = await request(app).get("/register");

    expect(response.text).toContain("at least 8 characters");
    expect(response.text).toContain("an uppercase letter");
    expect(response.text).toContain("a lowercase letter");
    expect(response.text).toContain("a special character");
  });

  it("uses registration autocomplete values", async () => {
    const response = await request(app).get("/register");

    expect(response.text).toContain('autocomplete="email"');
    expect(response.text).toContain('autocomplete="new-password"');
    expect(response.text).toMatch(/aria-describedby="[^"]*password-hint[^"]*"/);
  });

  it("does not include a role field", async () => {
    const response = await request(app).get("/register");

    expect(response.text).not.toContain('name="role"');
  });

  it("links back to the login page", async () => {
    const response = await request(app).get("/register");

    expect(response.text).toContain('href="/login"');
  });
});
