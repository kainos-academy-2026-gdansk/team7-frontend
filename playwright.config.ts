import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  reporter: "html",
  use: {
    baseURL: process.env.BASE_URL ?? "http://127.0.0.1:4000",
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
    url: "http://127.0.0.1:4000/health",
    reuseExistingServer: !process.env.CI,
    env: {
      ...process.env,
      NODE_ENV: "test",
      PORT: "4000",
    },
  },
});
