import { type Page, expect } from "@playwright/test";

export class MyProfilePage {
  constructor(private readonly page: Page) {}

  public async openProfile(): Promise<void> {
    await this.page.goto("/my-profile");
  }

  public async expectRedirectedToHomePage(): Promise<void> {
    await expect(this.page).toHaveURL(/\/$/);
  }

  public async expectHomeHeading(): Promise<void> {
    await expect(
      this.page.getByRole("heading", {
        name: "Find your next role at Kainos",
      }),
    ).toBeVisible();
  }
}
