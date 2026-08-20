import type { Locator, Page } from "@playwright/test";

export class JobRolesPage {
  public readonly heading: Locator;
  public readonly firstJobRoleButton: Locator;
  public readonly addJobRoleButton: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole("heading", { name: "Job roles" });
    this.firstJobRoleButton = page.getByRole("button", { name: /^View offer for / }).first();
    this.addJobRoleButton = page.getByRole("link", { name: "Add a role" });
  }

  public async openJobRolesPage(): Promise<void> {
    await this.page.goto("/job-roles");
  }

  public async openFirstJobRole(): Promise<void> {
    await this.firstJobRoleButton.click();
  }
  public async openAddJobRolePage(): Promise<void> {
    await this.addJobRoleButton.click();
  }
}
