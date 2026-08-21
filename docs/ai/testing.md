# Testing Memory

## Current Strategy

- `npm run ci:check` runs the same Biome lint/format check as CI.
- `npx tsc --noEmit -p tsconfig.json` is the explicit strict typecheck gate.
- `npm test` runs Vitest tests. Service tests mock `AxiosInstance`; controller tests mock services;
  page and route tests use Supertest against the exported Express app and mock Axios.
- `npm run build` compiles production TypeScript. CI also builds the Docker image.
- `npm run test:e2e` runs Playwright smoke and BDD scenarios. It needs the frontend, backend, and
  database environment described in `docker-compose.e2e.yml`.
- CI starts an isolated E2E database and backend image for the full browser suite. It does not skip
  `@requires-backend` scenarios.

## Expectations

- Test changed behavior, not implementation trivia.
- Cover happy paths, empty/not-found outcomes, validation failures, and unavailable backend behavior
  where relevant.
- Assert that invalid input does not call the API and that forms retain user-entered values.
- Check rendered error summaries and field messages, redirects after successful POSTs, and escaped
  output for untrusted values.
- Do not call a live backend in unit or page tests. Integration with the backend is a documented
  E2E prerequisite; use the disposable Compose environment rather than a developer database.
- E2E scenarios that mutate applications must use configured users and distinct job role IDs where
  later scenarios need the Apply link to remain available.
