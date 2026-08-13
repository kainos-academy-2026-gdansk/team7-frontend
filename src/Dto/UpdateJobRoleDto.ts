import { z } from "zod";
import {
  optionalClosingDate,
  optionalOpenPositions,
  optionalText,
  optionalUrl,
  requiredText,
  selectedId,
  selectedName,
} from "./formFields";

export const updateJobRoleSchema = z.object({
  jobRoleName: requiredText("a role name", 100),
  location: requiredText("a location", 100),
  statusId: selectedId("a status"),
  bandName: selectedName("a band"),
  capabilityName: selectedName("a capability"),
  description: optionalText("Description", 2000),
  responsibilities: optionalText("Responsibilities", 2000),
  sharepointUrl: optionalUrl,
  numberOfOpenPositions: optionalOpenPositions,
  closingDate: optionalClosingDate,
});

export type UpdateJobRoleDto = z.infer<typeof updateJobRoleSchema>;
