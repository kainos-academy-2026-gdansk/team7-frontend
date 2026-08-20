import "dotenv/config";
import { defineConfig } from "@playwright/test";
import { defineBddConfig } from "playwright-bdd";
import { e2eEnvironment } from "./e2e/config/environment";

const bddTestDir = defineBddConfig({
  features: "./features/**/*.feature",
  steps: "./e2e/steps/**/*.steps.ts",
  outputDir: "./e2e/.features-gen",
});

export default defineConfig({
  testDir: bddTestDir,
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: e2eEnvironment.baseUrl,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { browserName: "chromium" },
    },
    {
      name: "smoke",
      testDir: "./e2e",
      testMatch: "**/smoke.spec.ts",
      use: { browserName: "chromium" },
    },
  ],
  webServer: {
    command: "npm run dev",
    url: `${e2eEnvironment.localBaseUrl}/health`,
    reuseExistingServer: !process.env.CI,
    env: {
      ...process.env,
      NODE_ENV: "test",
      PORT: e2eEnvironment.port,
    },
  },
});
