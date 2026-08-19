import { createBdd } from "playwright-bdd";

import { MyProfilePage } from "../pages/MyProfilePage";

const { When, Then } = createBdd();

When("they try to open their profile", async ({ page }) => {
  const myProfilePage = new MyProfilePage(page);

  await myProfilePage.openProfile();
});

Then("they should be redirected to the home page", async ({ page }) => {
  const myProfilePage = new MyProfilePage(page);

  await myProfilePage.expectRedirectedToHomePage();
});

Then('they should see the "Find your next role at Kainos" heading', async ({ page }) => {
  const myProfilePage = new MyProfilePage(page);

  await myProfilePage.expectHomeHeading();
});
