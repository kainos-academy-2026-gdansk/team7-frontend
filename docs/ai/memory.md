# Project Memory

Durable facts approved for use in future tasks.

- 2026-08-12: This repository is a Node.js 22 strict-TypeScript server-rendered frontend for the team
  7 internal job-offers website.
- 2026-08-12: Express routes call injected controllers; controllers render Nunjucks pages and call
  services; services use the shared Axios client to communicate with the separate backend API.
- 2026-08-12: GOV.UK Frontend is the established UI system. Accessibility and GOV.UK form/error
  behavior are part of functional correctness.
- 2026-08-12: The backend base URL is environment configuration used by
  `src/client/axiosClient.ts`; secrets and environment values do not belong in repository memory.
- 2026-08-12: Automated browser E2E tooling is not configured. Supertest page tests plus developer
  browser verification are the current end-to-end confidence boundary.
- 2026-08-12: User stories are currently taken from developer-attached CSV files. Microsoft Planner
  MCP remains a guarded pilot described in `mcp-planner.md`.
- 2026-08-12: The backend replaced the `JobRoleStatus` enum with a `Status` lookup table
  (`db-refactor`). Job-role responses now carry `status` as a plain name string, `PUT
  /api/job-roles/:id` takes `statusId`, and `GET /api/statuses` supplies the dropdown options.
- 2026-08-12: Backend field renames applied across this repository: `link` -> `sharepointUrl`,
  `sharePointLink` -> `sharepointUrl`, `openPositions` -> `numberOfOpenPositions`.
