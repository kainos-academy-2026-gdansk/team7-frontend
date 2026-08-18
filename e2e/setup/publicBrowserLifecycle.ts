import { test } from "../fixtures/test";

export function registerPublicBrowserLifecycle(): void {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
  });

  test.afterEach(async ({ context }) => {
    await context.clearCookies();
  });
}
