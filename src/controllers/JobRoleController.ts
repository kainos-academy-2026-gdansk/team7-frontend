import { isAxiosError } from "axios";
import type { Request, Response } from "express";

import { z } from "zod";
import { createJobRoleSchema } from "../Dto/CreateJobRoleDto";
import { updateJobRoleSchema } from "../Dto/UpdateJobRoleDto";
import type { JobRoleDetailed } from "../models/JobRole";
import type { BandService } from "../services/BandService";
import type { CapabilityService } from "../services/CapabilityService";
import type { JobRoleService } from "../services/JobRoleService";
import { JobRoleNotFoundError } from "../services/JobRoleService";

const CREATE_FIELDS = [
  "roleName",
  "location",
  "bandId",
  "capabilityId",
  "description",
  "responsibilities",
  "openPositions",
  "sharePointLink",
  "closingDate",
] as const;

const EDIT_FIELDS = [
  "jobRoleName",
  "location",
  "status",
  "bandName",
  "capabilityName",
  "description",
  "responsibilities",
  "openPositions",
  "sharePointLink",
  "closingDate",
] as const;

type FormFields = readonly string[];
type FormValues = Record<string, string>;
type FormErrors = Record<string, string>;

const readFormValues = (fields: FormFields, body: unknown): FormValues => {
  const source = (body ?? {}) as Record<string, unknown>;

  return Object.fromEntries(
    fields.map((field) => [field, typeof source[field] === "string" ? source[field] : ""]),
  );
};

const toFormErrors = (fields: FormFields, error: z.ZodError): FormErrors => {
  const fieldErrors = z.flattenError(error).fieldErrors as Record<string, string[]>;
  const errors: FormErrors = {};

  for (const field of fields) {
    const message = fieldErrors[field]?.[0];
    if (message) {
      errors[field] = message;
    }
  }
  return errors;
};

const toErrorList = (fields: FormFields, errors: FormErrors) =>
  fields.filter((field) => errors[field]).map((field) => ({ field, message: errors[field] }));

const readApiFieldErrors = (fields: FormFields, error: unknown): FormErrors | null => {
  if (!isAxiosError(error) || error.response?.status !== 400) {
    return null;
  }

  const errors = (error.response.data as { errors?: { field?: string; message?: string }[] })
    ?.errors;

  if (!Array.isArray(errors)) {
    return null;
  }

  const mapped: FormErrors = {};
  for (const { field, message } of errors) {
    if (field && message && fields.includes(field)) {
      mapped[field] = message;
    }
  }

  return Object.keys(mapped).length > 0 ? mapped : null;
};

const readId = (value: unknown): number | null => {
  const id = Number(value);

  return Number.isInteger(id) && id > 0 ? id : null;
};

const toEditFormValues = (jobRole: JobRoleDetailed): FormValues => ({
  jobRoleName: jobRole.jobRoleName,
  location: jobRole.location,
  status: jobRole.status,
  bandName: jobRole.band,
  capabilityName: jobRole.capability,
  description: jobRole.description ?? "",
  responsibilities: jobRole.responsibilities ?? "",
  sharePointLink: jobRole.link ?? "",
  openPositions: String(jobRole.numberOfOpenPositions ?? ""),
  closingDate: jobRole.closingDate?.slice(0, 10) ?? "",
});

export class JobRoleController {
  constructor(
    private readonly jobRoleService: JobRoleService,
    private readonly bandService: BandService,
    private readonly capabilityService: CapabilityService,
  ) {
    this.jobRoleService = jobRoleService;
    this.bandService = bandService;
    this.capabilityService = capabilityService;
  }

  public getJobRolesPage = async (_req: Request, res: Response): Promise<void> => {
    try {
      const jobRoles = await this.jobRoleService.getJobRoles();

      // Pagination is parked until the team agrees on a page size; every open role is listed for now.
      // const PAGE_SIZE = 5;
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
  };

  public showCreateJobRoleForm = async (_req: Request, res: Response): Promise<void> => {
    await this.renderCreateForm(res, 200, readFormValues(CREATE_FIELDS, {}), {});
  };

  public createJobRole = async (req: Request, res: Response): Promise<void> => {
    const values = readFormValues(CREATE_FIELDS, req.body);
    const result = createJobRoleSchema.safeParse(values);

    if (!result.success) {
      await this.renderCreateForm(res, 400, values, toFormErrors(CREATE_FIELDS, result.error));
      return;
    }

    try {
      await this.jobRoleService.createJobRole(result.data);

      res.redirect("/job-roles");
    } catch (error) {
      const apiErrors = readApiFieldErrors(CREATE_FIELDS, error);
      if (apiErrors) {
        await this.renderCreateForm(res, 400, values, apiErrors);
        return;
      }

      console.error("Could not create job role", error);

      res.status(503).render("pages/error.njk", {
        heading: "The job role could not be saved",
        message:
          "We could not reach the service that stores our job roles. This is usually temporary, so please try again in a moment.",
        retryUrl: "/job-roles/new",
      });
    }
  };

  public showEditJobRoleForm = async (req: Request, res: Response): Promise<void> => {
    const id = readId(req.params.id);

    if (id === null) {
      this.renderNotFound(res);
      return;
    }

    try {
      const jobRole = await this.jobRoleService.getJobRoleById(id);

      await this.renderEditForm(res, 200, id, toEditFormValues(jobRole), {});
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 404) {
        this.renderNotFound(res);
        return;
      }

      console.error("Could not load job role", error);

      res.status(503).render("pages/error.njk", {
        heading: "The job role is unavailable",
        message:
          "We could not reach the service that holds our job roles. This is usually temporary, so please try again in a moment.",
        retryUrl: `/job-roles/${id}/edit`,
      });
    }
  };

  public editJobRole = async (req: Request, res: Response): Promise<void> => {
    const id = readId(req.params.id);

    if (id === null) {
      this.renderNotFound(res);
      return;
    }

    const values = readFormValues(EDIT_FIELDS, req.body);
    const result = updateJobRoleSchema.safeParse(values);

    if (!result.success) {
      await this.renderEditForm(res, 400, id, values, toFormErrors(EDIT_FIELDS, result.error));
      return;
    }

    try {
      await this.jobRoleService.updateJobRole(id, result.data);

      res.redirect("/job-roles");
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 404) {
        this.renderNotFound(res);
        return;
      }

      // The API validates too, so show what it rejected instead of a generic failure.
      const apiErrors = readApiFieldErrors(EDIT_FIELDS, error);
      if (apiErrors) {
        await this.renderEditForm(res, 400, id, values, apiErrors);
        return;
      }

      console.error("Could not update job role", error);

      res.status(503).render("pages/error.njk", {
        heading: "The job role could not be updated",
        message:
          "We could not reach the service that stores our job roles. This is usually temporary, so please try again in a moment.",
        retryUrl: `/job-roles/${id}/edit`,
      });
    }
  };

  private renderCreateForm = (
    res: Response,
    status: number,
    values: FormValues,
    errors: FormErrors,
  ): Promise<void> =>
    this.renderForm(res, {
      page: "pages/addJobRole.njk",
      status,
      fields: CREATE_FIELDS,
      values,
      errors,
      formAction: "/job-roles/new",
      submitLabel: "Add job role",
    });

  private renderEditForm = (
    res: Response,
    status: number,
    id: number,
    values: FormValues,
    errors: FormErrors,
  ): Promise<void> =>
    this.renderForm(res, {
      page: "pages/editJobRole.njk",
      status,
      fields: EDIT_FIELDS,
      values,
      errors,
      formAction: `/job-roles/${id}/edit`,
      submitLabel: "Save changes",
    });

  private renderForm = async (
    res: Response,
    options: {
      page: string;
      status: number;
      fields: FormFields;
      values: FormValues;
      errors: FormErrors;
      formAction: string;
      submitLabel: string;
    },
  ): Promise<void> => {
    const { page, status, fields, values, errors, formAction, submitLabel } = options;

    try {
      const [bands, capabilities] = await Promise.all([
        this.bandService.getBands(),
        this.capabilityService.getCapabilities(),
      ]);

      res.status(status).render(page, {
        values,
        errors,
        errorList: toErrorList(fields, errors),
        bands,
        capabilities,
        formAction,
        submitLabel,
      });
    } catch (error) {
      console.error("Could not load bands and capabilities", error);

      res.status(503).render("pages/error.njk", {
        heading: "The job role form is unavailable",
        message:
          "We could not load the bands and capabilities needed by this form. This is usually temporary, so please try again in a moment.",
        retryUrl: formAction,
      });
    }
  };

  private renderNotFound = (res: Response): void => {
    res.status(404).render("pages/error.njk", {
      heading: "Job role not found",
      message: "We could not find that job role. It may have been removed.",
      retryUrl: "/job-roles",
    });
  };

  getJobRoleInformationPage = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = Number(req.params.id);
      const jobRole = await this.jobRoleService.getJobRoleById(id);

      res.render("pages/jobRoleInformation.njk", {
        jobRole,
      });
    } catch (error) {
      if (error instanceof JobRoleNotFoundError) {
        console.error("Job role not found", error);

        res.status(404).render("pages/error.njk", {
          heading: "Job role not found",
          message:
            "The job role you are looking for does not exist. Please check the ID and try again.",
          retryUrl: "/job-roles/",
        });
        return;
      }

      console.error("Could not load job role", error);

      res.status(503).render("pages/error.njk", {
        heading: "Job role is unavailable",
        message:
          "We could not reach the service that holds our job role. This is usually temporary, so please try again in a moment.",
        retryUrl: "/job-roles/",
      });
    }
  };
}
