import type { Request, Response } from "express";
import type { ApplicationService } from "../services/ApplicationService";

export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}
  private requireAdmin = (req: Request, res: Response): string | null => {
    if (!req.session.authToken || req.session.authRole !== "ADMIN") {
      res.redirect("/");
      return null;
    }

    return req.session.authToken;
  };
  public showJobRoleApplicationsPage = async (req: Request, res: Response): Promise<void> => {
    const token = this.requireAdmin(req, res);
    if (!token) return;

    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      res.status(404).render("pages/error.njk", {
        heading: "Job role not found",
        message: "We could not find that job role. It may have been removed.",
        retryUrl: "/job-roles",
      });
      return;
    }

    try {
      const applications = await this.applicationService.getApplicationsForJobRole(id, token);
      res.render("pages/applications.njk", {
        applications,
        totalCount: applications.length,
      });
    } catch (error) {
      console.error(error);
      res.status(503).render("pages/error.njk", {
        heading: "applications are unavailable",
        message:
          "We could not reach the service that holds our job roles. This is usually temporary, so please try again in a moment.",
        retryUrl: "/job-roles",
      });
    }
  };
}
