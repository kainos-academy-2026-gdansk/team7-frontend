import { isAxiosError } from "axios";
import type { Request, Response } from "express";
import { z } from "zod";
import { CreateApplicationSchema } from "../Dto/CreateApplicationDto";
import type { StatusEnum } from "../models/Application";
import type { ApplicationService } from "../services/ApplicationService";
import { JobRoleNotFoundError, type JobRoleService } from "../services/JobRoleService";

const APPLICATION_FIELDS = ["experience", "salaryExpectation", "skills"] as const;

type FormValues = Record<string, string>;

const readFormValues = (body: unknown): FormValues => {
  const source = (body ?? {}) as Record<string, unknown>;

  return Object.fromEntries(
    APPLICATION_FIELDS.map((field) => [
      field,
      typeof source[field] === "string" ? source[field] : "",
    ]),
  );
};

type FormErrors = Record<string, string>;

const toFormErrors = (error: z.ZodError): FormErrors => {
  const fieldErrors = z.flattenError(error).fieldErrors as Record<string, string[]>;
  const errors: FormErrors = {};

  for (const field of APPLICATION_FIELDS) {
    const message = fieldErrors[field]?.[0];

    if (message) {
      errors[field] = message;
    }
  }

  return errors;
};

const toErrorList = (errors: FormErrors) =>
  APPLICATION_FIELDS.filter((field) => errors[field]).map((field) => ({
    field,
    message: errors[field],
  }));

export class ApplicationController {
  constructor(
    private readonly applicationService: ApplicationService,
    private readonly jobRoleService: JobRoleService,
  ) {}
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
  public applyForJobRole = async (req: Request, res: Response): Promise<void> => {
    const authToken = req.session.authToken;

    if (!authToken) {
      res.redirect("/login");
      return;
    }

    if (req.session.authRole !== "USER") {
      res.redirect("/");
      return;
    }

    const jobRoleId = Number(req.params.id);
    if (!Number.isInteger(jobRoleId) || jobRoleId <= 0) {
      res.status(404).render("pages/error.njk", {
        heading: "Job role not found",
        message: "We could not find that job role.",
        retryUrl: "/job-roles",
      });
      return;
    }

    const values = readFormValues(req.body);
    const result = CreateApplicationSchema.safeParse(values);

    if (!result.success) {
      const errors = toFormErrors(result.error);
      const errorList = toErrorList(errors);
      await this.renderInvalidApplicationForm(res, jobRoleId, values, errors, errorList);
      return;
    }

    try {
      await this.applicationService.createApplication(jobRoleId, result.data, authToken);

      res.redirect(`/job-roles/${jobRoleId}`);
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 404) {
        res.status(404).render("pages/error.njk", {
          heading: "Job role not found",
          message: "We could not find that job role. It may have been removed.",
          retryUrl: "/job-roles",
        });
        return;
      }

      if (isAxiosError(error) && error.response?.status === 409) {
        const backendMessage = (error.response.data as { message?: string })?.message;

        const message =
          backendMessage === "You have already applied for this job role"
            ? "You have already applied for this job role."
            : "This job role is not accepting applications.";

        res.status(409).render("pages/error.njk", {
          heading: "Application not submitted",
          message,
          retryUrl: `/job-roles/${jobRoleId}`,
        });
        return;
      }

      console.error("Could not submit application", error);

      res.status(503).render("pages/error.njk", {
        heading: "The application could not be submitted",
        message: "We could not submit your application. Please try again in a moment.",
        retryUrl: `/job-roles/${jobRoleId}/apply`,
      });
    }
  };

  public showApplicationForm = async (req: Request, res: Response): Promise<void> => {
    if (!req.session.authToken) {
      res.redirect("/login");
      return;
    }

    if (req.session.authRole !== "USER") {
      res.redirect("/");
      return;
    }

    const jobRoleId = Number(req.params.id);

    if (!Number.isInteger(jobRoleId) || jobRoleId <= 0) {
      res.status(404).render("pages/error.njk", {
        heading: "Job role not found",
        message: "We could not find that job role.",
        retryUrl: "/job-roles",
      });
      return;
    }

    try {
      const jobRole = await this.jobRoleService.getJobRoleInformation(jobRoleId);

      res.render("pages/applyForJobRole.njk", {
        jobRole,
        formAction: `/job-roles/${jobRoleId}/apply`,
        values: {
          experience: "",
          salaryExpectation: "",
          skills: "",
        },
        errors: {},
        errorList: [],
      });
    } catch (error) {
      if (error instanceof JobRoleNotFoundError) {
        res.status(404).render("pages/error.njk", {
          heading: "Job role not found",
          message: "We could not find that job role.",
          retryUrl: "/job-roles",
        });
        return;
      }

      console.error("Could not load application form", error);

      res.status(503).render("pages/error.njk", {
        heading: "The application form is unavailable",
        message: "We could not load this application form. Please try again in a moment.",
        retryUrl: `/job-roles/${jobRoleId}/apply`,
      });
    }
  };

  private renderInvalidApplicationForm = async (
    res: Response,
    jobRoleId: number,
    values: FormValues,
    errors: FormErrors,
    errorList: { field: string; message: string }[],
  ): Promise<void> => {
    try {
      const jobRole = await this.jobRoleService.getJobRoleInformation(jobRoleId);

      res.status(400).render("pages/applyForJobRole.njk", {
        jobRole,
        formAction: `/job-roles/${jobRoleId}/apply`,
        values,
        errors,
        errorList,
      });
    } catch (error) {
      if (error instanceof JobRoleNotFoundError) {
        res.status(404).render("pages/error.njk", {
          heading: "Job role not found",
          message: "We could not find that job role.",
          retryUrl: "/job-roles",
        });
        return;
      }

      console.error("Could not reload application form", error);

      res.status(503).render("pages/error.njk", {
        heading: "The application form is unavailable",
        message: "We could not reload the application form. Please try again.",
        retryUrl: `/job-roles/${jobRoleId}/apply`,
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
