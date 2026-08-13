import { Router } from "express";

import { AuthController } from "../controllers/AuthController";

const authController = new AuthController();

const router = Router();

router.get("/login", authController.showLoginPage);
router.get("/register", authController.showRegisterPage);
router.post("/login", authController.logIn);
router.post("/logout", authController.logOut);

export default router;
