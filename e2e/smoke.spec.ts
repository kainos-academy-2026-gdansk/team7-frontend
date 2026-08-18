import { expect, test } from "@playwright/test";
import { HomePage } from "./pages/HomePage";

test.describe("Public smoke paths", () => {
  test("reports a healthy frontend", async ({ request }) => {
    const response = await request.get("/health");

    await expect(response).toBeOK();

    const body = await response.json();
    expect(body).toHaveProperty("status", "UP");
  });

  test("renders the home page", async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    await expect(homePage.heading).toBeVisible();
    await expect(homePage.viewJobRolesLink).toBeVisible();
  });

  test("renders the login form", async ({ page }) => {
    await page.goto("/login");

    await expect(page).toHaveTitle("Log in");
    await expect(page.getByRole("heading", { name: "Log in" })).toBeVisible();
    await expect(page.getByLabel("Email address")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();
    await expect(page.getByRole("button", { name: "Log in" })).toBeVisible();
  });
});
