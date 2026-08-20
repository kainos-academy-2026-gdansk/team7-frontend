import type { Locator, Page } from "@playwright/test";

const selectedApplicantEmails = new WeakMap<Page, string>();

export class AdminApplicationsPage {
  public readonly cancelLink: Locator;
  public readonly confirmationHeading: Locator;
  public readonly warningText: Locator;
  public readonly hireApplicantButton: Locator;
  public readonly rejectConfirmationHeading: Locator;
  public readonly rejectApplicantButton: Locator;
  public readonly applicationsHeading: Locator;
  public readonly inProgressApplications: Locator;

  constructor(private readonly page: Page) {
    this.cancelLink = page.getByRole("link", { name: "Cancel" });
    this.confirmationHeading = page.getByRole("heading", { name: /^Hire .+\?$/ });
    this.warningText = page.getByText("This action cannot be undone.");
    this.hireApplicantButton = page.getByRole("button", { name: "Hire applicant" });
    this.rejectConfirmationHeading = page.getByRole("heading", { name: /^Reject .+\?$/ });
    this.rejectApplicantButton = page.getByRole("button", { name: "Reject applicant" });
    this.applicationsHeading = page.getByRole("heading", { name: "Job role applications" });
    this.inProgressApplications = page.locator(".kainos-job").filter({
      hasText: "Status: IN_PROGRESS",
    });
  }

  public async navigateToApplications(jobRoleId: string): Promise<void> {
    await this.page.goto(`/admin/job-roles/${jobRoleId}/applications`);
  }

  public async clickRandomHire(): Promise<void> {
    const application = await this.selectRandomInProgressApplication();

    await application.getByRole("link", { name: "Hire" }).click();
  }

  public async clickRandomReject(): Promise<void> {
    const application = await this.selectRandomInProgressApplication();

    await application.getByRole("link", { name: "Reject" }).click();
  }

  public async clickCancel(): Promise<void> {
    await this.cancelLink.click();
  }

  public async clickConfirmHire(): Promise<void> {
    await this.hireApplicantButton.click();
  }

  public async clickConfirmReject(): Promise<void> {
    await this.rejectApplicantButton.click();
  }

  public get selectedApplicantInProgressStatus(): Locator {
    return this.getSelectedApplicant().getByText("Status: IN_PROGRESS");
  }

  public get selectedApplicantHiredStatus(): Locator {
    return this.getSelectedApplicant().getByText("Status: HIRED");
  }

  public get selectedApplicantRejectedStatus(): Locator {
    return this.getSelectedApplicant().getByText("Status: REJECTED");
  }

  private async selectRandomInProgressApplication(): Promise<Locator> {
    const applicationCount = await this.inProgressApplications.count();

    if (applicationCount === 0) {
      throw new Error("No in-progress applications are available.");
    }

    const randomIndex = Math.floor(Math.random() * applicationCount);
    const application = this.inProgressApplications.nth(randomIndex);
    const applicantEmail = await application.getByRole("heading").textContent();

    if (!applicantEmail) {
      throw new Error("The selected application has no applicant email.");
    }

    selectedApplicantEmails.set(this.page, applicantEmail);

    return application;
  }

  private getSelectedApplicant(): Locator {
    const applicantEmail = selectedApplicantEmails.get(this.page);

    if (!applicantEmail) {
      throw new Error("No application has been selected.");
    }

    return this.page.locator(".kainos-job").filter({
      has: this.page.getByRole("heading", { name: applicantEmail, exact: true }),
    });
  }
}
