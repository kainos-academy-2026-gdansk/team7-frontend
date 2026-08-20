import type { Locator, Page } from "@playwright/test";

export class AdminApplicationsPage {
  public readonly hireLink: Locator;
  public readonly rejectLink: Locator;
  public readonly cancelLink: Locator;
  public readonly confirmationHeading: Locator;
  public readonly warningText: Locator;
  public readonly hireApplicantButton: Locator;
  public readonly rejectConfirmationHeading: Locator;
  public readonly rejectApplicantButton: Locator;
  public readonly applicationsHeading: Locator;
  public readonly inProgressStatus: Locator;
  public readonly hiredStatus: Locator;
  public readonly rejectedStatus: Locator;

  constructor(private readonly page: Page) {
    this.hireLink = page.getByRole("link", { name: "Hire" }).first();
    this.rejectLink = page.getByRole("link", { name: "Reject" }).first();
    this.cancelLink = page.getByRole("link", { name: "Cancel" });
    this.confirmationHeading = page.getByRole("heading", { name: /^Hire .+\?$/ });
    this.warningText = page.getByText("This action cannot be undone.");
    this.hireApplicantButton = page.getByRole("button", { name: "Hire applicant" });
    this.rejectConfirmationHeading = page.getByRole("heading", { name: /^Reject .+\?$/ });
    this.rejectApplicantButton = page.getByRole("button", { name: "Reject applicant" });
    this.applicationsHeading = page.getByRole("heading", { name: "Job role applications" });
    this.inProgressStatus = page.getByText("Status: IN_PROGRESS").first();
    this.hiredStatus = page.getByText("Status: HIRED").first();
    this.rejectedStatus = page.getByText("Status: REJECTED").first();
  }

  public async openApplications(jobRoleId: string): Promise<void> {
    await this.page.goto(`/admin/job-roles/${jobRoleId}/applications`);
  }

  public async chooseHire(): Promise<void> {
    await this.hireLink.click();
  }

  public async chooseReject(): Promise<void> {
    await this.rejectLink.click();
  }

  public async cancelHire(): Promise<void> {
    await this.cancelLink.click();
  }

  public async confirmHire(): Promise<void> {
    await this.hireApplicantButton.click();
  }

  public async confirmReject(): Promise<void> {
    await this.rejectApplicantButton.click();
  }
}
