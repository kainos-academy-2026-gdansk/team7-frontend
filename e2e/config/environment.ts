const port = process.env.E2E_PORT || "4000";
const localBaseUrl = `http://127.0.0.1:${port}`;

export const e2eEnvironment = {
  baseUrl: process.env.BASE_URL ?? localBaseUrl,
  localBaseUrl,
  port,
  adminEmail: process.env.E2E_ADMIN_EMAIL ?? "",
  adminPassword: process.env.E2E_ADMIN_PASSWORD ?? "",
  userEmail: process.env.E2E_USER_EMAIL ?? "",
  userPassword: process.env.E2E_USER_PASSWORD ?? "",
  jobRoleId: process.env.E2E_JOB_ROLE_ID ?? "",
};
