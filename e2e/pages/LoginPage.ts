import { type Locator, type Page, expect } from "@playwright/test";

export class LoginPage {
  public readonly emailInput: Locator;
  public readonly passwordInput: Locator;
  public readonly loginSubmitButton: Locator;

  constructor(private readonly page: Page) {
    this.emailInput = page.getByLabel("Email address");
    this.passwordInput = page.getByLabel("Password");
    this.loginSubmitButton = page.getByRole("button", { name: "Log in" });
  }

  public async openLoginPage(): Promise<void> {
    await this.page.goto("/login");
  }

  public async enterEmail(email: string): Promise<void> {
    await this.emailInput.fill(email);
  }

  public async enterPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  public async submitLogin(): Promise<void> {
    await this.loginSubmitButton.click();
  }

  public async expectLoggedIn(): Promise<void> {
    await expect(this.page).toHaveURL(/\/my-profile$/);
    await expect(this.page.getByRole("heading", { name: "My applications" })).toBeVisible();
  }

  public async expectNotLoggedIn(): Promise<void> {
    await expect(this.page).toHaveURL(/\/login$/);
    await expect(this.page.getByRole("heading", { name: "Log in" })).toBeVisible();
  }
}
