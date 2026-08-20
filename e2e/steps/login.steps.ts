import { expect } from "@playwright/test";
import { createBdd } from "playwright-bdd";

import { LoginPage } from "../pages/LoginPage";

const { Given, When, Then } = createBdd();

Given("the user is on the login page", async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.openLoginPage();
});

Given("the user has an authenticated session", async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.openLoginPage();
  await loginPage.enterEmail("applicant@kainos.com");
  await loginPage.enterPassword("Password1!");
  await loginPage.submitLogin();
  await expect(page).toHaveURL(/\/my-profile$/);
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
