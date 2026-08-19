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

const postLogin = (values: Record<string, string>) =>
  request(app).post("/login").type("form").send(values);
const createAuthenticatedAgent = async () => {
  apiClient.post.mockResolvedValue({
    data: {
      token: "test-jwt-token",
      user: { id: 1, email: "zuzanna@kainos.com", role: "USER" },
    },
  });

  const agent = request.agent(app);
  await agent.post("/login").type("form").send({
    email: "zuzanna@kainos.com",
    password: "Password1!",
  });

  return agent;
};

const createAdminAgent = async () => {
  apiClient.post.mockResolvedValue({
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

describe("GET /login", () => {
  it("renders the login page", async () => {
    const response = await request(app).get("/login");

    expect(response.status).toBe(200);
    expect(response.text).toContain("<title>Log in</title>");
    expect(response.text).toContain("Email address");
    expect(response.text).toContain("Password");
  });

  it("links to the registration page", async () => {
    const response = await request(app).get("/login");

    expect(response.text).toContain('href="/register"');
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

  it("renders the signed-out header state by default", async () => {
    const response = await request(app).get("/");

    expect(response.text).toContain('href="/login">Log in</a>');
    expect(response.text).toContain('href="/register">Register</a>');
    expect(response.text).not.toContain('href="/my-profile">My Profile</a>');
    expect(response.text).not.toContain('action="/logout"');
  });
});

describe("administrator header", () => {
  it("hides My Profile and shows Log out", async () => {
    const agent = await createAdminAgent();
    const response = await agent.get("/");

    expect(response.status).toBe(200);
    expect(response.text).not.toContain('href="/my-profile">My Profile</a>');
    expect(response.text).toContain('action="/logout"');
    expect(response.text).toContain(">Log out</button>");
  });
});

describe("authenticated-only pages", () => {
  it("redirects an authenticated user away from login and register", async () => {
    const agent = await createAuthenticatedAgent();

    const loginResponse = await agent.get("/login");
    const registerResponse = await agent.get("/register");

    expect(loginResponse.status).toBe(302);
    expect(loginResponse.headers.location).toBe("/my-profile");
    expect(registerResponse.status).toBe(302);
    expect(registerResponse.headers.location).toBe("/my-profile");
  });

  it("redirects an administrator away from login and register", async () => {
    const agent = await createAdminAgent();

    const loginResponse = await agent.get("/login");
    const registerResponse = await agent.get("/register");

    expect(loginResponse.status).toBe(302);
    expect(loginResponse.headers.location).toBe("/");
    expect(registerResponse.status).toBe(302);
    expect(registerResponse.headers.location).toBe("/");
  });
});

describe("POST /login", () => {
  it("rejects an empty form", async () => {
    const response = await postLogin({ email: "", password: "" });

    expect(response.status).toBe(400);
    expect(response.text).toContain('class="kainos-auth-error-summary"');
    expect(response.text).toContain("govuk-error-summary__list");
    expect(response.text).toContain('href="#email">Enter your email address</a>');
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

  it("shows a form error when the credentials are invalid", async () => {
    apiClient.post.mockRejectedValue({
      isAxiosError: true,
      response: { status: 401 },
    });

    const response = await postLogin({ email: "zuzanna@kainos.com", password: "hunter2" });

    expect(response.status).toBe(401);
    expect(response.text).toContain('href="#email">Invalid email or password</a>');
    expect(response.text).toContain('href="#password">Invalid email or password</a>');
  });

  it("creates a session and redirects to the profile after a successful login", async () => {
    apiClient.post.mockResolvedValue({
      data: {
        token: "test-jwt-token",
        user: { id: 1, email: "zuzanna@kainos.com", role: "USER" },
      },
    });

    const response = await postLogin({
      email: "zuzanna@kainos.com",
      password: "Password1!",
    });

    expect(apiClient.post).toHaveBeenCalledWith("/api/auth/login", {
      email: "zuzanna@kainos.com",
      password: "Password1!",
    });
    expect(response.status).toBe(302);
    expect(response.headers.location).toBe("/my-profile");
    expect(response.headers["set-cookie"]).toBeDefined();
  });

  it("renders a 503 page when the login API is unavailable", async () => {
    apiClient.post.mockRejectedValue(new Error("Connection refused"));

    const response = await postLogin({
      email: "zuzanna@kainos.com",
      password: "Password1!",
    });

    expect(response.status).toBe(503);
    expect(response.text).toContain("Logging in is unavailable");
    expect(response.text).not.toContain("Connection refused");
  });
});

describe("logging out", () => {
  it("renders the signed-in header state", async () => {
    const agent = await createAuthenticatedAgent();
    const response = await agent.get("/");

    expect(response.text).toContain('href="/my-profile">My Profile</a>');
    expect(response.text).toContain('action="/logout"');
    expect(response.text).toContain("Log out");
    expect(response.text).not.toContain('href="/login">Log in</a>');
    expect(response.text).not.toContain('href="/register">Register</a>');
  });

  it("ends the session and sends the user back to the home page", async () => {
    const agent = await createAuthenticatedAgent();

    const logoutResponse = await agent.post("/logout");

    expect(logoutResponse.status).toBe(302);
    expect(logoutResponse.headers.location).toBe("/");

    const profileResponse = await agent.get("/my-profile");

    expect(profileResponse.status).toBe(302);
    expect(profileResponse.headers.location).toBe("/");
  });

  it("cannot be triggered by a GET, so another site cannot log the user out", async () => {
    const response = await request(app).get("/logout");

    expect(response.status).toBe(404);
  });
});
