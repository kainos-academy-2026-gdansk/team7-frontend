import { Router } from "express";

import { AuthController } from "../controllers/AuthController";

const authController = new AuthController();

const router = Router();

router.get("/login", authController.showLoginPage);

export default router;
