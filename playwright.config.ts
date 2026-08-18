import { defineConfig } from "@playwright/test";
import { e2eEnvironment } from "./e2e/config/environment";

export default defineConfig({
  testDir: "./e2e",
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
