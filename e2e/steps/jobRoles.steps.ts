import { expect } from "@playwright/test";
import { createBdd } from "playwright-bdd";

import { HomePage } from "../pages/HomePage";
import { JobRoleDetailsPage } from "../pages/JobRoleDetailsPage";
import { JobRolesPage } from "../pages/JobRolesPage";

const { Given, When, Then } = createBdd();

Given("the user is on the main page", async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.goto();
});

When("the user clicks the job roles link", async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.openJobRolesPage();
});

Then("the user can view the job role list", async ({ page }) => {
  const jobRolesPage = new JobRolesPage(page);

  await expect(page).toHaveURL(/\/job-roles$/);
  await expect(jobRolesPage.heading).toBeVisible();
});

Given("the user is on the job role list page", async ({ page }) => {
  const jobRolesPage = new JobRolesPage(page);
  await jobRolesPage.openJobRolesPage();
});

When("the user clicks the first offer", async ({ page }) => {
  const jobRolesPage = new JobRolesPage(page);
  await jobRolesPage.openFirstJobRole();
});

Then("the user can view the job role details", async ({ page }) => {
  const jobRoleDetailsPage = new JobRoleDetailsPage(page);

  await expect(page).toHaveURL(/\/job-roles\/\d+$/);
  await expect(jobRoleDetailsPage.heading).toBeVisible();
});
