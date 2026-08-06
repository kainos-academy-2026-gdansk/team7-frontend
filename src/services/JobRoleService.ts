import { jobRoles } from "../data/mockJobRoles";
import type { JobRole } from "../models/JobRole";


export async function getJobRoles(): Promise<JobRole[]> {

    //TODO -- we have to move filtering to API (GET /job-roles?status=OPEN)

    return jobRoles.filter((role) => role.status === "OPEN");
}
