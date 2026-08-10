import type { Request, Response } from "express";
import { getJobRoles } from "../services/JobRoleService";

const PAGE_SIZE = 5;

export async function getJobRolesPage(req: Request, res: Response): Promise<void> {
  const jobRoles = await getJobRoles();
  const totalPages = Math.max(1, Math.ceil(jobRoles.length / PAGE_SIZE));

  // The page number comes straight from the URL, so clamp it rather than trust it.
  const requested = Number.parseInt(String(req.query.page ?? "1"), 10);
  const page = Number.isNaN(requested) ? 1 : Math.min(Math.max(requested, 1), totalPages);
  const start = (page - 1) * PAGE_SIZE;

  res.render("pages/jobRoles.njk", {
    jobRoles: jobRoles.slice(start, start + PAGE_SIZE),
    totalCount: jobRoles.length,
    page,
    totalPages,
  });
}
