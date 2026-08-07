import type { Request, Response } from "express";
import { getJobRoles } from "../services/JobRoleService";

export async function getJobRolesPage(_req: Request, res: Response): Promise<void> {
  const jobRoles = await getJobRoles();

  res.render("pages/jobRoles.njk", { jobRoles });
}
