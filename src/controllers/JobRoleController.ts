import type { Request, Response } from "express";
import { getJobRoles } from "../services/JobRoleService";

// Pagination is parked until the team agrees on a page size; every open role is listed for now.
// const PAGE_SIZE = 5;

export async function getJobRolesPage(_req: Request, res: Response): Promise<void> {
  try {
    const jobRoles = await getJobRoles();

    // const totalPages = Math.max(1, Math.ceil(jobRoles.length / PAGE_SIZE));
    // The page number comes straight from the URL, so clamp it rather than trust it.
    // const requested = Number.parseInt(String(_req.query.page ?? "1"), 10);
    // const page = Number.isNaN(requested) ? 1 : Math.min(Math.max(requested, 1), totalPages);
    // const start = (page - 1) * PAGE_SIZE;

    res.render("pages/jobRoles.njk", {
      jobRoles,
      totalCount: jobRoles.length,
    });
  } catch (error) {
    // The API is a separate service, so it can be down while this site is healthy.
    console.error("Could not load job roles", error);

    res.status(503).render("pages/error.njk", {
      heading: "Job roles are unavailable",
      message:
        "We could not reach the service that holds our job roles. This is usually temporary, so please try again in a moment.",
      retryUrl: "/job-roles",
    });
  }
}
