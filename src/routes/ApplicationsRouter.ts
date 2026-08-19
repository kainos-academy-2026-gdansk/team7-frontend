import { Router } from "express";
import apiClient from "../client/axiosClient";
import { ApplicationController } from "../controllers/ApplicationController";
import { ApplicationService } from "../services/ApplicationService";
import { JobRoleService } from "../services/JobRoleService";
const applicationService = new ApplicationService(apiClient);
const jobRoleService = new JobRoleService(apiClient);
const applicationController = new ApplicationController(applicationService, jobRoleService);
const router = Router();

router.get(
  "/admin/job-roles/:jobRoleId/applications/:applicationId/hire",
  applicationController.showHireConfirmation,
);
router.post(
  "/admin/job-roles/:jobRoleId/applications/:applicationId/hire",
  applicationController.hireApplication,
);

router.get(
  "/admin/job-roles/:jobRoleId/applications/:applicationId/reject",
  applicationController.showRejectConfirmation,
);
router.post(
  "/admin/job-roles/:jobRoleId/applications/:applicationId/reject",
  applicationController.rejectApplication,
);

router.get("/admin/job-roles/:id/applications", applicationController.showJobRoleApplicationsPage);

export default router;
