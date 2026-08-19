import { type Locator, type Page, expect } from "@playwright/test";

export class JobRolesPage {
  public readonly heading: Locator;
  public readonly firstJobRoleButton: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole("heading", { name: "Job roles" });
    this.firstJobRoleButton = page.getByRole("button", { name: /^View offer for / }).first();
  }

  public async openJobRolesPage(): Promise<void> {
    await this.page.goto("/job-roles");
  }

  public async expectJobRolesPage(): Promise<void> {
    await expect(this.page).toHaveURL(/\/job-roles$/);
    await expect(this.heading).toBeVisible();
  }

  public async openFirstJobRole(): Promise<void> {
    await this.firstJobRoleButton.click();
  }
}
