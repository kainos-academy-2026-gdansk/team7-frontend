import { Router } from "express";

import apiClient from "../client/axiosClient";
import { AuthController } from "../controllers/AuthController";
import { AuthService } from "../services/AuthService";

const authService = new AuthService(apiClient);
const authController = new AuthController(authService);
const router = Router();

router.get("/login", authController.showLoginPage);
router.get("/register", authController.showRegisterPage);
router.get("/my-profile", authController.showMyProfilePage);
router.post("/register", authController.register);
router.post("/login", authController.logIn);
router.post("/logout", authController.logOut);

export default router;
