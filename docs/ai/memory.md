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
- 2026-08-21: Browser E2E uses Playwright plus `docker-compose.e2e.yml`: a disposable PostgreSQL
  service, a backend `seed` service that runs migrations and the backend seed, and the GHCR E2E
  backend image. Playwright starts the frontend locally and reaches the backend at `127.0.0.1:3000`.
- 2026-08-12: User stories are currently taken from developer-attached CSV files. Microsoft Planner
  MCP remains a guarded pilot described in `mcp-planner.md`.
- 2026-08-12: The backend replaced the `JobRoleStatus` enum with a `Status` lookup table
  (`db-refactor`). Job-role responses now carry `status` as a plain name string, `PUT
  /api/job-roles/:id` takes `statusId`, and `GET /api/statuses` supplies the dropdown options.
- 2026-08-12: Backend field renames applied across this repository: `link` -> `sharepointUrl`,
  `sharePointLink` -> `sharepointUrl`, `openPositions` -> `numberOfOpenPositions`.
- 2026-08-13: User stories in this repository are frontend-only for this developer. Do not implement
  backend logic, database changes, password hashing, JWT handling, or API authentication unless the
  developer explicitly asks for them.
- 2026-08-13: Implement exactly the requirements written in the ticket. Do not add optional
  features, propose alternative team decisions, or expand the scope without explicit approval.
- 2026-08-13: Communication with this developer is in Polish. Code, test names, UI copy, and code
  comments remain in English unless the ticket says otherwise.
- 2026-08-13: Work one step at a time. The developer types suggested code herself; the agent checks
  the current file after each step and fixes misplaced or malformed code when needed.
- 2026-08-13: Do not change branches or perform branch cleanup unless the developer explicitly asks.
- 2026-08-13: Login and registration pages use matching auth-form styling and a narrower centered
  white form on large screens.
- 2026-08-13: Preserve the existing flow: route -> controller -> service -> shared Axios client,
  with Nunjucks views rendered by controllers. Routes contain wiring only; views contain presentation
  only; services never import Express types.
- 2026-08-13: Reuse the single configured Axios client from `src/client/axiosClient.ts`. Do not create
  another Axios instance or hardcode the backend URL.
- 2026-08-13: Keep `src/app.ts` free of `listen()`; only `src/index.ts` starts the server.
- 2026-08-13: Keep Nunjucks `autoescape: true` and never use the `safe` filter for user or API data.
- 2026-08-13: Use Zod schemas and `safeParse` at form boundaries. Derive DTO types with `z.infer`
  instead of duplicating request interfaces.
- 2026-08-13: New form controls must use GOV.UK classes together with Kainos classes and preserve
  accessible labels, hints, error messages, error summaries, and keyboard navigation.
- 2026-08-13: Tests use Vitest and Supertest without a live backend. New routes, controllers, forms,
  and views need focused tests.
- 2026-08-13: Do not add dependencies, architectural layers, client-side frameworks, or new API
  contracts without explicit approval.
- 2026-08-13: Before handover, run `npm run ci:check`, `npx tsc --noEmit -p tsconfig.json`,
  `npm test`, and `npm run build` when applicable.
- 2026-08-13: After each completed task, update this memory with important technical decisions,
  project rules, and workflow lessons learned during the task.
- 2026-08-13: Auth integration uses `POST /api/auth/register` and `POST /api/auth/login`
  through `AuthController` -> `AuthService` -> the shared Axios client. A successful login establishes
  a server-side Express session; protected routes must use session state rather than browser storage.
- 2026-08-21: CI runs the complete E2E suite, including `@requires-backend` scenarios. The E2E job
  has `packages: read`, logs in to GHCR with `GITHUB_TOKEN`, tears down the Compose stack with
  `down -v`, and receives secrets/variables only at runtime.
- 2026-08-21: E2E uses independent role IDs for administrator, successful-application, and
  empty-application scenarios. This prevents state created by a successful application from hiding
  the Apply link required by the empty-form scenario.
