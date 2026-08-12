import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "../../src/app";

const postLogin = (values: Record<string, string>) =>
  request(app).post("/login").type("form").send(values);

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

  it("masks the password field and lets a password manager fill it", async () => {
    const response = await request(app).get("/login");

    expect(response.text).toContain('type="password"');
    expect(response.text).toContain('autocomplete="current-password"');
  });

  it("links to the login page from the header", async () => {
    const response = await request(app).get("/");

    expect(response.text).toContain('href="/login"');
  });
});

describe("POST /login", () => {
  it("rejects an empty form", async () => {
    const response = await postLogin({ email: "", password: "" });

    expect(response.status).toBe(400);
    expect(response.text).toContain("Enter your email address");
    expect(response.text).toContain("Enter your password");
  });

  it("rejects an email address that is not an email address", async () => {
    const response = await postLogin({ email: "zuzanna", password: "whatever" });

    expect(response.status).toBe(400);
    expect(response.text).toContain("Enter an email address in the correct format");
  });

  it("keeps the email but never sends the password back", async () => {
    const response = await postLogin({ email: "zuzanna", password: "hunter2" });

    expect(response.text).toContain('value="zuzanna"');
    expect(response.text).not.toContain("hunter2");
  });

  it("explains that logging in is not available yet", async () => {
    const response = await postLogin({ email: "zuzanna@kainos.com", password: "hunter2" });

    expect(response.status).toBe(503);
    expect(response.text).toContain("Logging in is unavailable");
  });
});

describe("logging out", () => {
  it("offers a log out button that submits a form", async () => {
    const response = await request(app).get("/");

    expect(response.text).toContain('action="/logout"');
    expect(response.text).toContain("Log out");
  });

  it("sends the user back to the home page", async () => {
    const response = await request(app).post("/logout");

    expect(response.status).toBe(302);
    expect(response.headers.location).toBe("/");
  });

  it("cannot be triggered by a GET, so another site cannot log the user out", async () => {
    const response = await request(app).get("/logout");

    expect(response.status).toBe(404);
  });
});
