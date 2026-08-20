import { expect } from "@playwright/test";
import { createBdd } from "playwright-bdd";

import { e2eEnvironment } from "../config/environment";
import { LoginPage } from "../pages/LoginPage";

const { Given, When, Then } = createBdd();

Given("the user is on the login page", async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.openLoginPage();
});

Given("the user has an authenticated session", async ({ page }) => {
  const { userEmail, userPassword } = e2eEnvironment;

  if (!userEmail || !userPassword) {
    throw new Error("Set E2E_USER_EMAIL and E2E_USER_PASSWORD before running this test.");
  }

  const loginPage = new LoginPage(page);

  await loginPage.openLoginPage();
  await loginPage.enterEmail(userEmail);
  await loginPage.enterPassword(userPassword);
  await loginPage.submitLogin();
  await expect(page).toHaveURL(/\/my-profile$/);
});

When("the registered applicant submits valid credentials", async ({ page }) => {
  const { userEmail, userPassword } = e2eEnvironment;

  if (!userEmail || !userPassword) {
    throw new Error("Set E2E_USER_EMAIL and E2E_USER_PASSWORD before running this test.");
  }

  const loginPage = new LoginPage(page);

  await loginPage.enterEmail(userEmail);
  await loginPage.enterPassword(userPassword);
  await loginPage.submitLogin();
});

When("the user enters the email {string}", async ({ page }, email: string) => {
  const loginPage = new LoginPage(page);
  await loginPage.enterEmail(email);
});

When("the user enters the password {string}", async ({ page }, password: string) => {
  const loginPage = new LoginPage(page);
  await loginPage.enterPassword(password);
});

When("submits the login form", async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.submitLogin();
});

Then("the user is logged in", async ({ page }) => {
  await expect(page).toHaveURL(/\/my-profile$/);
  await expect(page.getByRole("heading", { name: "My applications" })).toBeVisible();
});

Then("the user is not logged in", async ({ page }) => {
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole("heading", { name: "Log in" })).toBeVisible();
});
