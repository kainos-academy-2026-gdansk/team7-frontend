import { type Locator, type Page, expect } from "@playwright/test";

export class JobRoleDetailsPage {
  public readonly heading: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole("heading", { level: 1 });
  }

  public async expectPageDisplayed(): Promise<void> {
    await expect(this.page).toHaveURL(/\/job-roles\/\d+$/);
    await expect(this.heading).toBeVisible();
  }
}
