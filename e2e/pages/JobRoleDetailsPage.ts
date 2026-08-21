import type { Locator, Page } from "@playwright/test";

export class JobRoleDetailsPage {
  public readonly applyButton: Locator;
  public readonly heading: Locator;

  constructor(private readonly page: Page) {
    this.applyButton = page.getByRole("link", { name: "Apply for this role" });
    this.heading = page.getByRole("heading", { level: 1 });
  }

  public async clickApply(): Promise<void> {
    await this.applyButton.click();
  }

  public async openJobRole(id: string): Promise<void> {
    await this.page.goto(`/job-roles/${id}`);
  }
}
