import { type Page, expect } from "@playwright/test";
import { createBdd } from "playwright-bdd";

import { AddJobRolePage } from "../../pages/AddJobRolePage";
import { HomePage } from "../../pages/HomePage";
import { JobRolesPage } from "../../pages/JobRolesPage";
import { LoginPage } from "../../pages/LoginPage";

const { Given, When, Then } = createBdd();

const createdRoleNames = new WeakMap<Page, string>();

const roleNameFor = (page: Page): string => {
  const roleName = createdRoleNames.get(page);

  if (!roleName) {
    throw new Error("No job role has been created for this scenario");
  }

  return roleName;
};

Given("the administrator has an authenticated session", async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.openLoginPage();
  await loginPage.enterEmail("admin@kainos.local");
  await loginPage.enterPassword("Admin!123");
  await loginPage.submitLogin();

  await expect(page).toHaveURL(/\/$/);
});

When("the administrator opens the job roles page", async ({ page }) => {
  const homePage = new HomePage(page);

  await homePage.openJobRolesPage();
});

Given("the administrator is on the job roles page", async ({ page }) => {
  const jobRolesPage = new JobRolesPage(page);

  await jobRolesPage.openJobRolesPage();
  await expect(jobRolesPage.heading).toBeVisible();
});

When("the administrator creates a new job role", async ({ page }) => {
  const jobRolesPage = new JobRolesPage(page);
  const addJobRolePage = new AddJobRolePage(page);
  const roleName = `E2E Administrator Role ${Date.now()}-${Math.random().toString(36).slice(2)}`;

  await jobRolesPage.openAddJobRolePage();
  await expect(addJobRolePage.heading).toBeVisible();
  await addJobRolePage.createJobRole(roleName);
  createdRoleNames.set(page, roleName);
});

Then("the new job role is shown on the job roles page", async ({ page }) => {
  await expect(page).toHaveURL(/\/job-roles$/);
  await expect(page.getByRole("heading", { name: roleNameFor(page) })).toBeVisible();
});

When("the administrator selects Add a role", async ({ page }) => {
  const jobRolesPage = new JobRolesPage(page);

  await jobRolesPage.openAddJobRolePage();
});

Then("the administrator is taken to the add job role form", async ({ page }) => {
  await expect(page).toHaveURL(/\/job-roles\/new$/);
  await expect(page.getByRole("heading", { name: "Add a job role" })).toBeVisible();
});
