import { expect } from "@playwright/test";
import { createBdd } from "playwright-bdd";

import { e2eEnvironment } from "../config/environment";
import { AdminApplicationsPage } from "../pages/AdminApplicationsPage";
import { LoginPage } from "../pages/LoginPage";

const { Given, When, Then } = createBdd();

Given("the administrator is logged in", async ({ page }) => {
  const { adminEmail, adminPassword } = e2eEnvironment;

  if (!adminEmail || !adminPassword) {
    throw new Error("Set E2E_ADMIN_EMAIL and E2E_ADMIN_PASSWORD before running this test.");
  }

  const loginPage = new LoginPage(page);

  await loginPage.openLoginPage();
  await loginPage.enterEmail(adminEmail);
  await loginPage.enterPassword(adminPassword);
  await loginPage.submitLogin();

  await expect(page).toHaveURL(/\/$/);
});

Given("the administrator is viewing applications for a job role", async ({ page }) => {
  const { jobRoleId } = e2eEnvironment;

  if (!jobRoleId) {
    throw new Error("Set E2E_JOB_ROLE_ID before running this test.");
  }

  const adminApplicationsPage = new AdminApplicationsPage(page);

  await adminApplicationsPage.openApplications(jobRoleId);
});

Given('an applicant has the status "IN_PROGRESS"', async ({ page }) => {
  const adminApplicationsPage = new AdminApplicationsPage(page);

  await expect(adminApplicationsPage.inProgressStatus).toBeVisible();
});

When("the administrator chooses to hire the applicant", async ({ page }) => {
  const adminApplicationsPage = new AdminApplicationsPage(page);

  await adminApplicationsPage.chooseHire();
});

Then("they should see the hire confirmation page", async ({ page }) => {
  const adminApplicationsPage = new AdminApplicationsPage(page);

  await expect(adminApplicationsPage.confirmationHeading).toBeVisible();
  await expect(adminApplicationsPage.warningText).toBeVisible();
  await expect(adminApplicationsPage.hireApplicantButton).toBeVisible();
});

When("the administrator cancels the hire action", async ({ page }) => {
  const adminApplicationsPage = new AdminApplicationsPage(page);

  await adminApplicationsPage.cancelHire();
});

Then("they should return to the job role applications page", async ({ page }) => {
  const adminApplicationsPage = new AdminApplicationsPage(page);

  await expect(adminApplicationsPage.applicationsHeading).toBeVisible();
});

Then('the applicant status should remain "IN_PROGRESS"', async ({ page }) => {
  const adminApplicationsPage = new AdminApplicationsPage(page);

  await expect(adminApplicationsPage.inProgressStatus).toBeVisible();
});

When("the administrator chooses to reject the applicant", async ({ page }) => {
  const adminApplicationsPage = new AdminApplicationsPage(page);

  await adminApplicationsPage.chooseReject();
});

Then("they should see the reject confirmation page", async ({ page }) => {
  const adminApplicationsPage = new AdminApplicationsPage(page);

  await expect(adminApplicationsPage.rejectConfirmationHeading).toBeVisible();
  await expect(adminApplicationsPage.warningText).toBeVisible();
  await expect(adminApplicationsPage.rejectApplicantButton).toBeVisible();
});

When("the administrator cancels the reject action", async ({ page }) => {
  const adminApplicationsPage = new AdminApplicationsPage(page);

  await adminApplicationsPage.cancelHire();
});

When("the administrator confirms the hire action", async ({ page }) => {
  const adminApplicationsPage = new AdminApplicationsPage(page);

  await adminApplicationsPage.confirmHire();
});

Then('the applicant status should be "HIRED"', async ({ page }) => {
  const adminApplicationsPage = new AdminApplicationsPage(page);

  await expect(adminApplicationsPage.hiredStatus).toBeVisible();
});

When("the administrator confirms the reject action", async ({ page }) => {
  const adminApplicationsPage = new AdminApplicationsPage(page);

  await adminApplicationsPage.confirmReject();
});

Then('the applicant status should be "REJECTED"', async ({ page }) => {
  const adminApplicationsPage = new AdminApplicationsPage(page);

  await expect(adminApplicationsPage.rejectedStatus).toBeVisible();
});
