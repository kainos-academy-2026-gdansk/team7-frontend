import { expect } from "@playwright/test";
import { createBdd } from "playwright-bdd";
import { e2eEnvironment } from "../config/environment";
import { JobApplicationPage } from "../pages/JobApplicationPage";
import { JobRoleDetailsPage } from "../pages/JobRoleDetailsPage";
import { JobRolesPage } from "../pages/JobRolesPage";

const { Given, When, Then } = createBdd();

Given("the user is unauthenticated", async ({ context }) => {
  await context.clearCookies();
});

When(
  "the user tries to open a job application form for job role {int}",
  async ({ page }, jobRoleId: number) => {
    const jobApplicationPage = new JobApplicationPage(page);

    await jobApplicationPage.openApplicationForm(jobRoleId);
  },
);

Then("the user should be redirected to the login page", async ({ page }) => {
  await expect(page).toHaveURL(/\/login$/);
});

Then('the user should see the "Log in" heading', async ({ page }) => {
  await expect(page.getByRole("heading", { name: "Log in" })).toBeVisible();
});

When("the user opens job roles", async ({ page }) => {
  const jobRolesPage = new JobRolesPage(page);
  await jobRolesPage.openJobRolesPage();
});

When("the user opens the role for an application", async ({ page }) => {
  const { applicationJobRoleId } = e2eEnvironment;

  if (!applicationJobRoleId) {
    throw new Error("Set E2E_APPLICATION_JOB_ROLE_ID before running this test.");
  }

  const jobRoleDetailsPage = new JobRoleDetailsPage(page);
  await jobRoleDetailsPage.openJobRole(applicationJobRoleId);
});

When("the user opens the role for an empty application", async ({ page }) => {
  const { emptyApplicationJobRoleId } = e2eEnvironment;

  if (!emptyApplicationJobRoleId) {
    throw new Error("Set E2E_EMPTY_APPLICATION_JOB_ROLE_ID before running this test.");
  }

  const jobRoleDetailsPage = new JobRoleDetailsPage(page);
  await jobRoleDetailsPage.openJobRole(emptyApplicationJobRoleId);
});

When("the user clicks Apply", async ({ page }) => {
  const jobRoleDetailsPage = new JobRoleDetailsPage(page);

  await jobRoleDetailsPage.clickApply();
});

When("the user fills the application form", async ({ page }) => {
  const jobApplicationPage = new JobApplicationPage(page);

  await jobApplicationPage.fillExperience("Five years of software development experience.");
  await jobApplicationPage.fillSalaryExpectation("45000");
  await jobApplicationPage.fillSkills("TypeScript, Playwright, and API testing.");
});

When("the user submits the application", async ({ page }) => {
  const jobApplicationPage = new JobApplicationPage(page);

  await jobApplicationPage.submitApplication();
});

When("the user submits the empty application form", async ({ page }) => {
  const jobApplicationPage = new JobApplicationPage(page);

  await jobApplicationPage.submitApplication();
});

Then("the application form is displayed", async ({ page }) => {
  await expect(page).toHaveURL(/\/job-roles\/\d+\/apply$/);
  await expect(page.getByRole("button", { name: "Apply for this role" })).toBeVisible();
});

Then("the experience validation error is visible", async ({ page }) => {
  await expect(
    page.getByRole("alert").getByRole("link", { name: "Enter your experience", exact: true }),
  ).toBeVisible();
});

Then("the salary expectation validation error is visible", async ({ page }) => {
  await expect(
    page
      .getByRole("alert")
      .getByRole("link", { name: "Enter your salary expectations", exact: true }),
  ).toBeVisible();
});

Then("the skills validation error is visible", async ({ page }) => {
  await expect(
    page.getByRole("alert").getByRole("link", { name: "Enter your skills", exact: true }),
  ).toBeVisible();
});

Then("the application confirmation is visible", async ({ page }) => {
  await expect(page.getByRole("heading", { name: "Your application" })).toBeVisible();
});

Then("the application status is visible", async ({ page }) => {
  await expect(page.locator(".kainos-job-detail__application-status")).toBeVisible();
});
