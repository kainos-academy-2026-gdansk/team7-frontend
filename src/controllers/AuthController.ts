import type { Request, Response } from "express";
import { z } from "zod";

import { loginSchema } from "../Dto/LoginDto";

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

export class AuthController {
  public showLoginPage = (_req: Request, res: Response): void => {
    this.renderLoginForm(res, 200, { email: "", password: "" }, {});
  };

  public logIn = (req: Request, res: Response): void => {
    const values = readFormValues(req.body);
    const result = loginSchema.safeParse(values);

    if (!result.success) {
      this.renderLoginForm(res, 400, values, toFormErrors(result.error));
      return;
    }

    // Poprawne dane nie mają jeszcze dokąd trafić - czeka na endpoint logowania w API.
    res.status(503).render("pages/error.njk", {
      heading: "Logging in is unavailable",
      message:
        "We could not reach the service that signs you in. This is usually temporary, so please try again in a moment.",
      retryUrl: "/login",
    });
  };

  private renderLoginForm = (
    res: Response,
    status: number,
    values: FormValues,
    errors: FormErrors,
  ): void => {
    res.status(status).render("pages/login.njk", {
      // Hasło nigdy nie wraca na stronę, nawet po błędzie walidacji.
      values: { ...values, password: "" },
      errors,
      errorList: toErrorList(errors),
    });
  };
}
