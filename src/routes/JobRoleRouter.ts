import { Router } from "express";
import apiClient from "../client/axiosClient";
//import { getJobRolesPage } from "../controllers/JobRoleController";
import { JobRoleController } from "../controllers/JobRoleController";
import { BandService } from "../services/BandService";
import { CapabilityService } from "../services/CapabilityService";
import { JobRoleService } from "../services/JobRoleService";

const jobRoleService = new JobRoleService(apiClient);
const bandService = new BandService(apiClient);
const capabilityService = new CapabilityService(apiClient);
const jobRoleController = new JobRoleController(jobRoleService, bandService, capabilityService);
const router = Router();

router.get("/", (_req, res) => {
  res.render("pages/index.njk");
});

router.get("/job-roles", jobRoleController.getJobRolesPage);

router.get("/job-roles/new", jobRoleController.showCreateJobRoleForm);
router.post("/job-roles/new", jobRoleController.createJobRole);

router.get("/job-roles/:id/edit", jobRoleController.showEditJobRoleForm);
router.post("/job-roles/:id/edit", jobRoleController.editJobRole);

export default router;
