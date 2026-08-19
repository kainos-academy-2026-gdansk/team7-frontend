import { createBdd } from "playwright-bdd";

import { LoginPage } from "../pages/LoginPage";

const { Given, When, Then } = createBdd();

Given("the user is on the login page", async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.openLoginPage();
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
  const loginPage = new LoginPage(page);

  await loginPage.expectLoggedIn();
});

Then("the user is not logged in", async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.expectNotLoggedIn();
});
