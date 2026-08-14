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

  it("loads the client-side authentication script", async () => {
    const response = await request(app).get("/login");

    expect(response.text).toContain('<script src="/js/auth.js"></script>');
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

    expect(response.text).toContain('href="/login" data-auth-login>Log in</a>');
    expect(response.text).toContain('href="/register" data-auth-register>Register</a>');
    expect(response.text).toContain("data-auth-profile hidden");
    expect(response.text).toContain("data-auth-logout hidden");
  });
});

describe("GET /my-profile", () => {
  it("renders an empty applications state with a job roles link", async () => {
    const response = await request(app).get("/my-profile");

    expect(response.status).toBe(200);
    expect(response.text).toContain("<title>My Profile</title>");
    expect(response.text).toContain('class="kainos-empty-state"');
    expect(response.text).toContain("You do not have any applications yet...");
    expect(response.text).toContain(
      "Explore our available job roles to find your next opportunity.",
    );
    expect(response.text).toContain('href="/job-roles">Find your next opportunity</a>');
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
    expect(response.text).toContain("Invalid email or password");
  });

  it("returns the token after a successful login", async () => {
    apiClient.post.mockResolvedValue({
      data: {
        token: "test-jwt-token",
        user: { id: 1, email: "zuzanna@kainos.com", role: "APPLICANT" },
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
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      token: "test-jwt-token",
      user: { id: 1, email: "zuzanna@kainos.com", role: "APPLICANT" },
    });
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

describe("client-side token handling", () => {
  it("serves the script that manages the authentication session", async () => {
    const response = await request(app).get("/js/auth.js");

    expect(response.status).toBe(200);
    expect(response.text).toContain('sessionStorage.setItem("authToken", token)');
    expect(response.text).toContain('window.location.assign("/my-profile")');
    expect(response.text).toContain('sessionStorage.removeItem("authToken")');
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
