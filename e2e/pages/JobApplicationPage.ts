import { type Page, expect } from "@playwright/test";

export class JobApplicationPage {
  constructor(private readonly page: Page) {}

  public async openApplicationForm(): Promise<void> {
    await this.page.goto("/job-roles/1/apply");
  }

  public async expectRedirectedToLogin(): Promise<void> {
    await expect(this.page).toHaveURL(/\/login$/);
  }

  public async expectLoginHeading(): Promise<void> {
    await expect(this.page.getByRole("heading", { name: "Log in" })).toBeVisible();
  }
}
