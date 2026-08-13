import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import app from "../../src/app";

const apiClient = vi.hoisted(() => ({ post: vi.fn() }));

vi.mock("axios", () => ({
  default: { create: () => apiClient },
  isAxiosError: (error: unknown) => Boolean((error as { isAxiosError?: boolean })?.isAxiosError),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

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

describe("POST /register", () => {
  it("rejects an empty form", async () => {
    const response = await request(app).post("/register").type("form").send({
      email: "",
      password: "",
    });

    expect(response.status).toBe(400);
    expect(response.text).toContain("Enter your email address");
    expect(response.text).toContain("Enter your password");
  });

  it("rejects a password without the required complexity", async () => {
    const response = await request(app).post("/register").type("form").send({
      email: "zuzanna@kainos.com",
      password: "password",
    });

    expect(response.status).toBe(400);
    expect(response.text).toContain("Password must include an uppercase letter");
  });

  it("redirects to login after a successful registration", async () => {
    apiClient.post.mockResolvedValue({
      data: { id: 1, email: "zuzanna@kainos.com", role: "APPLICANT" },
    });

    const response = await request(app).post("/register").type("form").send({
      email: "zuzanna@kainos.com",
      password: "Password1!",
    });

    expect(apiClient.post).toHaveBeenCalledWith("/api/auth/register", {
      email: "zuzanna@kainos.com",
      password: "Password1!",
    });
    expect(response.status).toBe(302);
    expect(response.headers.location).toBe("/login");
  });
  it("shows backend validation errors on the matching field", async () => {
    apiClient.post.mockRejectedValue({
      isAxiosError: true,
      response: {
        status: 400,
        data: {
          errors: [{ field: "email", message: "Email address is already registered" }],
        },
      },
    });

    const response = await request(app).post("/register").type("form").send({
      email: "zuzanna@kainos.com",
      password: "Password1!",
    });

    expect(response.status).toBe(400);
    expect(response.text).toContain("Email address is already registered");
    expect(response.text).toContain('value="zuzanna@kainos.com"');
  });

  it("renders a 503 page when the registration API is unavailable", async () => {
    apiClient.post.mockRejectedValue(new Error("Connection refused"));

    const response = await request(app).post("/register").type("form").send({
      email: "zuzanna@kainos.com",
      password: "Password1!",
    });

    expect(response.status).toBe(503);
    expect(response.text).toContain("Registration is unavailable");
    expect(response.text).not.toContain("Connection refused");
  });
});
