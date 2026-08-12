import type { Request, Response } from "express";

export class AuthController {
  public showLoginPage = (_req: Request, res: Response): void => {
    res.render("pages/login.njk");
  };
}
