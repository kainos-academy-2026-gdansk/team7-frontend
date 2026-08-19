const localBaseUrl = `http://127.0.0.1:${process.env.E2E_PORT ?? "4000"}`;

export const e2eEnvironment = {
  baseUrl: process.env.BASE_URL ?? localBaseUrl,
  localBaseUrl,
  port: process.env.E2E_PORT ?? "4000",
};
