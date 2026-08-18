import { isAxiosError } from "axios";
import type { Request, Response } from "express";
import type { StatusEnum } from "../models/Application";
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

  private readId = (value: unknown): number | null => {
    const id = Number(value);

    return Number.isInteger(id) && id > 0 ? id : null;
  };

  private redirectToLogin = (req: Request, res: Response): void => {
    req.session.destroy((error) => {
      if (error) {
        console.error("Failed to clear an expired session", error);
      }

      res.redirect("/login");
    });
  };

  private renderJobRoleNotFound = (res: Response): void => {
    res.status(404).render("pages/error.njk", {
      heading: "Job role not found",
      message: "We could not find that job role. It may have been removed.",
      retryUrl: "/job-roles",
    });
  };

  private renderApplicationNotFound = (res: Response): void => {
    res.status(404).render("pages/error.njk", {
      heading: "Application not found",
      message: "We could not find that application. It may have been removed.",
      retryUrl: "/job-roles",
    });
  };

  public showJobRoleApplicationsPage = async (req: Request, res: Response): Promise<void> => {
    const token = this.requireAdmin(req, res);
    if (!token) return;

    const id = this.readId(req.params.id);
    if (id === null) {
      this.renderJobRoleNotFound(res);
      return;
    }

    try {
      const applications = await this.applicationService.getApplicationsForJobRole(id, token);
      res.render("pages/applications.njk", {
        applications,
        totalCount: applications.length,
        jobRoleId: id,
      });
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 401) {
        this.redirectToLogin(req, res);
        return;
      }
      if (isAxiosError(error) && error.response?.status === 404) {
        this.renderJobRoleNotFound(res);
        return;
      }

      console.error(error);
      res.status(503).render("pages/error.njk", {
        heading: "applications are unavailable",
        message:
          "We could not reach the service that holds our job roles. This is usually temporary, so please try again in a moment.",
        retryUrl: "/job-roles",
      });
    }
  };

  public showHireConfirmation = async (req: Request, res: Response): Promise<void> => {
    await this.renderStatusConfirmation(req, res, "Hire", "hire");
  };

  public showRejectConfirmation = async (req: Request, res: Response): Promise<void> => {
    await this.renderStatusConfirmation(req, res, "Reject", "reject");
  };

  public hireApplication = async (req: Request, res: Response): Promise<void> => {
    await this.changeStatus(req, res, "HIRED");
  };

  public rejectApplication = async (req: Request, res: Response): Promise<void> => {
    await this.changeStatus(req, res, "REJECTED");
  };

  private renderStatusConfirmation = async (
    req: Request,
    res: Response,
    actionLabel: string,
    actionPath: string,
  ): Promise<void> => {
    const token = this.requireAdmin(req, res);
    if (!token) return;

    const jobRoleId = this.readId(req.params.jobRoleId);
    const applicationId = this.readId(req.params.applicationId);
    if (jobRoleId === null || applicationId === null) {
      this.renderApplicationNotFound(res);
      return;
    }

    try {
      const applications = await this.applicationService.getApplicationsForJobRole(
        jobRoleId,
        token,
      );
      const application = applications.find((candidate) => candidate.id === applicationId);
      if (!application) {
        this.renderApplicationNotFound(res);
        return;
      }

      res.render("pages/confirmApplicationStatus.njk", {
        application,
        actionLabel,
        formAction: `/admin/job-roles/${jobRoleId}/applications/${applicationId}/${actionPath}`,
        cancelUrl: `/admin/job-roles/${jobRoleId}/applications`,
      });
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 401) {
        this.redirectToLogin(req, res);
        return;
      }
      if (isAxiosError(error) && error.response?.status === 404) {
        this.renderJobRoleNotFound(res);
        return;
      }

      console.error("Could not load application confirmation", error);
      res.status(503).render("pages/error.njk", {
        heading: "Applications are unavailable",
        message:
          "We could not reach the service that holds our applications. This is usually temporary, so please try again in a moment.",
        retryUrl: `/admin/job-roles/${jobRoleId}/applications`,
      });
    }
  };

  private changeStatus = async (req: Request, res: Response, status: StatusEnum): Promise<void> => {
    const token = this.requireAdmin(req, res);
    if (!token) return;

    const jobRoleId = this.readId(req.params.jobRoleId);
    const applicationId = this.readId(req.params.applicationId);
    if (jobRoleId === null || applicationId === null) {
      this.renderApplicationNotFound(res);
      return;
    }

    try {
      await this.applicationService.changeApplicationStatus(
        applicationId,
        jobRoleId,
        token,
        status,
      );
      res.redirect(`/admin/job-roles/${jobRoleId}/applications`);
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 401) {
        this.redirectToLogin(req, res);
        return;
      }
      if (isAxiosError(error) && error.response?.status === 404) {
        this.renderApplicationNotFound(res);
        return;
      }

      console.error("Could not update application status", error);
      res.status(503).render("pages/error.njk", {
        heading: "The application could not be updated",
        message:
          "We could not reach the service that updates applications. This is usually temporary, so please try again in a moment.",
        retryUrl: `/admin/job-roles/${jobRoleId}/applications`,
      });
    }
  };
}
