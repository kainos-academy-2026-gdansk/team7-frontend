import { Router } from "express";

import { AuthController } from "../controllers/AuthController";

const authController = new AuthController();

const router = Router();

router.get("/login", authController.showLoginPage);
router.post("/login", authController.logIn);
router.post("/logout", authController.logOut);

export default router;
