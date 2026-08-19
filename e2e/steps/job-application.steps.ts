import { createBdd } from "playwright-bdd";

import { JobApplicationPage } from "../pages/JobApplicationPage";

const { Given, When, Then } = createBdd();

Given("the visitor is not logged in", async ({ context }) => {
  await context.clearCookies();
});

When("they try to open a job application form", async ({ page }) => {
  const jobApplicationPage = new JobApplicationPage(page);

  await jobApplicationPage.openApplicationForm();
});

Then("they should be redirected to the login page", async ({ page }) => {
  const jobApplicationPage = new JobApplicationPage(page);

  await jobApplicationPage.expectRedirectedToLogin();
});

Then('they should see the "Log in" heading', async ({ page }) => {
  const jobApplicationPage = new JobApplicationPage(page);

  await jobApplicationPage.expectLoginHeading();
});
