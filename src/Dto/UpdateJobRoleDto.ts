import { z } from "zod";
import { JobRoleStatus } from "../models/JobRole";
import {
  optionalClosingDate,
  optionalOpenPositions,
  optionalText,
  optionalUrl,
  requiredText,
  selectedName,
} from "./formFields";

export const updateJobRoleSchema = z.object({
  jobRoleName: requiredText("a role name", 100),
  location: requiredText("a location", 100),
  status: z.nativeEnum(JobRoleStatus, { error: "Select a status" }),
  bandName: selectedName("a band"),
  capabilityName: selectedName("a capability"),
  description: optionalText("Description", 2000),
  responsibilities: optionalText("Responsibilities", 2000),
  sharePointLink: optionalUrl,
  openPositions: optionalOpenPositions,
  closingDate: optionalClosingDate,
});

export type UpdateJobRoleDto = z.infer<typeof updateJobRoleSchema>;
