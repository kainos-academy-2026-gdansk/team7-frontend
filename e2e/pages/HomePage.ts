import type { Locator, Page } from "@playwright/test";

export class HomePage {
  public readonly heading: Locator;
  public readonly viewJobRolesLink: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole("heading", { name: "Find your next role at Kainos" });
    this.viewJobRolesLink = page.getByRole("link", { name: "View job roles" });
  }

  public async goto(): Promise<void> {
    await this.page.goto("/");
  }
}
