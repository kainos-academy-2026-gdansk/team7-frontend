import { Router } from "express";
import apiClient from "../client/axiosClient";
import { ApplicationController } from "../controllers/ApplicationController";
import { ApplicationService } from "../services/ApplicationService";

const applicationService = new ApplicationService(apiClient);
const applicationController = new ApplicationController(applicationService);
const router = Router();

router.get("/admin/job-roles/:id/applications", applicationController.showJobRoleApplicationsPage);

export default router;
