import type { Locator, Page } from "@playwright/test";

export class AddJobRolePage {
  public readonly heading: Locator;
  public readonly roleNameInput: Locator;
  public readonly locationInput: Locator;
  public readonly bandSelect: Locator;
  public readonly capabilitySelect: Locator;
  public readonly descriptionInput: Locator;
  public readonly responsibilitiesInput: Locator;
  public readonly openPositionsInput: Locator;
  public readonly sharePointLinkInput: Locator;
  public readonly closingDateInput: Locator;
  public readonly submitButton: Locator;

  constructor(page: Page) {
    this.heading = page.getByRole("heading", { name: "Add a job role" });
    this.roleNameInput = page.getByLabel("Role name");
    this.locationInput = page.getByLabel("Location");
    this.bandSelect = page.getByLabel("Band");
    this.capabilitySelect = page.getByLabel("Capability");
    this.descriptionInput = page.getByLabel("Description");
    this.responsibilitiesInput = page.getByLabel("Responsibilities");
    this.openPositionsInput = page.getByLabel("Open positions");
    this.sharePointLinkInput = page.getByLabel("SharePoint link");
    this.closingDateInput = page.getByLabel("Closing date");
    this.submitButton = page.getByRole("button", { name: "Add job role" });
  }
}
