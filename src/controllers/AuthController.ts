import { isAxiosError } from "axios";
import type { Request, Response } from "express";
import { z } from "zod";

import { loginSchema } from "../Dto/LoginDto";
import { registerSchema } from "../Dto/RegisterDto";
import type { AuthService } from "../services/AuthService";

const LOGIN_FIELDS = ["email", "password"] as const;

type FormValues = Record<string, string>;
type FormErrors = Record<string, string>;

const readFormValues = (body: unknown): FormValues => {
  const source = (body ?? {}) as Record<string, unknown>;

  return Object.fromEntries(
    LOGIN_FIELDS.map((field) => [field, typeof source[field] === "string" ? source[field] : ""]),
  );
};

const toFormErrors = (error: z.ZodError): FormErrors => {
  const fieldErrors = z.flattenError(error).fieldErrors as Record<string, string[]>;
  const errors: FormErrors = {};

  for (const field of LOGIN_FIELDS) {
    const message = fieldErrors[field]?.[0];
    if (message) {
      errors[field] = message;
    }
  }
  return errors;
};

const toErrorList = (errors: FormErrors) =>
  LOGIN_FIELDS.filter((field) => errors[field]).map((field) => ({
    field,
    message: errors[field],
  }));

const readApiFieldErrors = (error: unknown): FormErrors | null => {
  if (!isAxiosError(error) || error.response?.status !== 400) {
    return null;
  }

  const errors = (
    error.response.data as {
      errors?: { field?: string; message?: string }[];
    }
  )?.errors;

  if (!Array.isArray(errors)) {
    return null;
  }

  const mapped: FormErrors = {};

  for (const { field, message } of errors) {
    if (field && message && LOGIN_FIELDS.some((formField) => formField === field)) {
      mapped[field] = message;
    }
  }

  return Object.keys(mapped).length > 0 ? mapped : null;
};

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  public showLoginPage = (_req: Request, res: Response): void => {
    this.renderLoginForm(res, 200, { email: "", password: "" }, {});
  };

  public showRegisterPage = (_req: Request, res: Response): void => {
    this.renderRegisterForm(res, 200, { email: "", password: "" }, {});
  };
  public register = async (req: Request, res: Response): Promise<void> => {
    const values = readFormValues(req.body);
    const result = registerSchema.safeParse(values);

    if (!result.success) {
      this.renderRegisterForm(res, 400, values, toFormErrors(result.error));
      return;
    }

    try {
      await this.authService.register(result.data);
      res.redirect("/login");
    } catch (error) {
      const apiErrors = readApiFieldErrors(error);

      if (apiErrors) {
        this.renderRegisterForm(res, 400, values, apiErrors);
        return;
      }
      console.error("Failed to register", error);
      res.status(503).render("pages/error.njk", {
        heading: "Registration is unavailable",
        message:
          "We could not reach the registration service. This is usually temporary, so please try again in a moment.",
        retryUrl: "/register",
      });
    }
  };
  public logIn = async (req: Request, res: Response): Promise<void> => {
    const values = readFormValues(req.body);
    const result = loginSchema.safeParse(values);

    if (!result.success) {
      this.renderLoginForm(res, 400, values, toFormErrors(result.error));
      return;
    }

    try {
      const loginResponse = await this.authService.login(result.data);
      res.status(200).json(loginResponse);
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 401) {
        this.renderLoginForm(res, 401, values, {
          password: "Invalid email or password",
        });
        return;
      }

      console.error("Failed to log in", error);
      res.status(503).render("pages/error.njk", {
        heading: "Logging in is unavailable",
        message:
          "We could not reach the service that signs you in. This is usually temporary, so please try again in a moment.",
        retryUrl: "/login",
      });
    }
  };

  public logOut = (_req: Request, res: Response): void => {
    // There is no session to clear yet - that comes with the token handling.
    res.redirect("/");
  };

  private renderRegisterForm = (
    res: Response,
    status: number,
    values: FormValues,
    errors: FormErrors,
  ): void => {
    res.status(status).render("pages/register.njk", {
      values: { ...values, password: "" },
      errors,
      errorList: toErrorList(errors),
    });
  };

  private renderLoginForm = (
    res: Response,
    status: number,
    values: FormValues,
    errors: FormErrors,
  ): void => {
    res.status(status).render("pages/login.njk", {
      // The password never goes back to the page, not even after a validation error.
      values: { ...values, password: "" },
      errors,
      errorList: toErrorList(errors),
    });
  };
}
