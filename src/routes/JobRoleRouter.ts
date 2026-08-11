import { Router } from "express";
import { getJobRoleInformationPage, getJobRolesPage } from "../controllers/JobRoleController";

const router = Router();

router.get("/", (_req, res) => {
  res.render("pages/index.njk");
});

router.get("/job-roles", getJobRolesPage);
router.get("/job-roles/:id", getJobRoleInformationPage);

export default router;
