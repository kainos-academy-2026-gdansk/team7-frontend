import type { Locator, Page } from "@playwright/test";

export class JobRoleDetailsPage {
  public readonly heading: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole("heading", { level: 1 });
  }
}
