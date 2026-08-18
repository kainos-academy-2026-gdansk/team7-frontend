import { Router } from "express";

import apiClient from "../client/axiosClient";
import { ApplicationController } from "../controllers/ApplicationController";
import { ApplicationService } from "../services/ApplicationService";
import { JobRoleService } from "../services/JobRoleService";

const applicationService = new ApplicationService(apiClient);
const jobRoleService = new JobRoleService(apiClient);

const applicationController = new ApplicationController(applicationService, jobRoleService);

const router = Router();

router.get("/job-roles/:id/apply", applicationController.showApplicationForm);
router.post("/job-roles/:id/apply", applicationController.applyForJobRole);

export default router;
