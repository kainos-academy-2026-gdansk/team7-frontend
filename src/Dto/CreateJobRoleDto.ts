import { z } from "zod";
import {
  optionalClosingDate,
  optionalOpenPositions,
  optionalText,
  optionalUrl,
  requiredText,
  selectedId,
} from "./formFields";

export const createJobRoleSchema = z.object({
  roleName: requiredText("a role name", 255),
  location: requiredText("a location", 255),
  bandId: selectedId("a band"),
  capabilityId: selectedId("a capability"),
  description: optionalText("Description", 2000),
  responsibilities: optionalText("Responsibilities", 2000),
  openPositions: optionalOpenPositions,
  sharePointLink: optionalUrl,
  closingDate: optionalClosingDate,
});

export type CreateJobRoleDto = z.infer<typeof createJobRoleSchema>;
