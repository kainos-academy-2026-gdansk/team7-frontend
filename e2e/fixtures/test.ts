import { test as base } from "@playwright/test";
import { HealthApiClient } from "../api/HealthApiClient";
import { HomePage } from "../pages/HomePage";

type TestFixtures = {
  healthApi: HealthApiClient;
  homePage: HomePage;
};

export const test = base.extend<TestFixtures>({
  healthApi: async ({ request }, use) => {
    await use(new HealthApiClient(request));
  },
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
});

export { expect } from "@playwright/test";
