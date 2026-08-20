import { expect } from "@playwright/test";
import { createBdd } from "playwright-bdd";

import { e2eEnvironment } from "../config/environment";
import { AdminApplicationsPage } from "../pages/AdminApplicationsPage";
import { LoginPage } from "../pages/LoginPage";

const { Given, When, Then } = createBdd();

Given("the administrator is viewing an in-progress application", async ({ page }) => {
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
  const { jobRoleId } = e2eEnvironment;

  if (!jobRoleId) {
    throw new Error("Set E2E_JOB_ROLE_ID before running this test.");
  }

  const adminApplicationsPage = new AdminApplicationsPage(page);

  await adminApplicationsPage.navigateToApplications(jobRoleId);
  await expect(adminApplicationsPage.inProgressApplications).not.toHaveCount(0);
});

When("the administrator cancels hiring the applicant", async ({ page }) => {
  const adminApplicationsPage = new AdminApplicationsPage(page);

  await adminApplicationsPage.clickRandomHire();
  await expect(adminApplicationsPage.confirmationHeading).toBeVisible();
  await adminApplicationsPage.clickCancel();
});

When("the administrator cancels rejecting the applicant", async ({ page }) => {
  const adminApplicationsPage = new AdminApplicationsPage(page);

  await adminApplicationsPage.clickRandomReject();
  await expect(adminApplicationsPage.rejectConfirmationHeading).toBeVisible();
  await adminApplicationsPage.clickCancel();
});

Then("the applicant remains in progress", async ({ page }) => {
  const adminApplicationsPage = new AdminApplicationsPage(page);

  await expect(adminApplicationsPage.applicationsHeading).toBeVisible();
  await expect(adminApplicationsPage.selectedApplicantInProgressStatus).toBeVisible();
});

When("the administrator hires the applicant", async ({ page }) => {
  const adminApplicationsPage = new AdminApplicationsPage(page);

  await adminApplicationsPage.clickRandomHire();
  await expect(adminApplicationsPage.confirmationHeading).toBeVisible();
  await expect(adminApplicationsPage.warningText).toBeVisible();
  await adminApplicationsPage.clickConfirmHire();
});

Then("the applicant is marked as hired", async ({ page }) => {
  const adminApplicationsPage = new AdminApplicationsPage(page);

  await expect(adminApplicationsPage.selectedApplicantHiredStatus).toBeVisible();
});

When("the administrator rejects the applicant", async ({ page }) => {
  const adminApplicationsPage = new AdminApplicationsPage(page);

  await adminApplicationsPage.clickRandomReject();
  await expect(adminApplicationsPage.rejectConfirmationHeading).toBeVisible();
  await expect(adminApplicationsPage.warningText).toBeVisible();
  await adminApplicationsPage.clickConfirmReject();
});

Then("the applicant is marked as rejected", async ({ page }) => {
  const adminApplicationsPage = new AdminApplicationsPage(page);

  await expect(adminApplicationsPage.selectedApplicantRejectedStatus).toBeVisible();
});
