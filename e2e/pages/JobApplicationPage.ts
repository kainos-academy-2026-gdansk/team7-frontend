import type { Locator, Page } from "@playwright/test";

export class JobApplicationPage {
  private readonly experience: Locator;
  private readonly salaryExpectation: Locator;
  private readonly skills: Locator;
  private readonly submitButton: Locator;

  constructor(private readonly page: Page) {
    this.experience = this.page.getByRole("textbox", { name: "Experience" });
    this.salaryExpectation = this.page.getByRole("textbox", { name: "Salary expectation" });
    this.skills = this.page.getByRole("textbox", { name: "Skills" });
    this.submitButton = this.page.getByRole("button", { name: "Apply for this role" });
  }

  public async openApplicationForm(jobRoleId: number): Promise<void> {
    await this.page.goto(`/job-roles/${jobRoleId}/apply`);
  }

  public async fillExperience(value: string): Promise<void> {
    await this.experience.fill(value);
  }

  public async fillSalaryExpectation(value: string): Promise<void> {
    await this.salaryExpectation.fill(value);
  }

  public async fillSkills(value: string): Promise<void> {
    await this.skills.fill(value);
  }

  public async submitApplication(): Promise<void> {
    await this.submitButton.click();
  }
}
