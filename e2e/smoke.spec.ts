import { expect, test } from "./fixtures/test";
import { registerPublicBrowserLifecycle } from "./setup/publicBrowserLifecycle";
import { readJson } from "./utils/readJson";

type HealthResponse = {
  status: string;
};

test.describe("Public API smoke paths", () => {
  test("reports a healthy frontend", async ({ healthApi }) => {
    const response = await healthApi.getHealth();

    await expect(response).toBeOK();

    const body = await readJson<HealthResponse>(response);
    expect(body.status).toBe("UP");
  });
});

test.describe("Public browser smoke paths", () => {
  registerPublicBrowserLifecycle();

  test("renders the home page", async ({ homePage }) => {
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
