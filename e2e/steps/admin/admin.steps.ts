import { expect } from "@playwright/test";
import { createBdd } from "playwright-bdd";

import { HomePage } from "../../pages/HomePage";
import { JobRolesPage } from "../../pages/JobRolesPage";
import { LoginPage } from "../../pages/LoginPage";

const { Given, When, Then } = createBdd();

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

When("the administrator selects Add a role", async ({ page }) => {
  const jobRolesPage = new JobRolesPage(page);

  await jobRolesPage.openAddJobRolePage();
});

Then("the administrator is taken to the add job role form", async ({ page }) => {
  await expect(page).toHaveURL(/\/job-roles\/new$/);
  await expect(page.getByRole("heading", { name: "Add a job role" })).toBeVisible();
});
