# Testing Memory

## Current Strategy

- `npm run ci:check` runs the same Biome lint/format check as CI.
- `npx tsc --noEmit -p tsconfig.json` is the explicit strict typecheck gate.
- `npm test` runs Vitest tests. Service tests mock `AxiosInstance`; controller tests mock services;
  page and route tests use Supertest against the exported Express app and mock Axios.
- `npm run build` compiles production TypeScript. CI also builds the Docker image.
- There is no automated browser E2E suite. Record E2E as N/A and provide manual browser verification
  for user-visible changes until a team-approved suite exists.

## Expectations

- Test changed behavior, not implementation trivia.
- Cover happy paths, empty/not-found outcomes, validation failures, and unavailable backend behavior
  where relevant.
- Assert that invalid input does not call the API and that forms retain user-entered values.
- Check rendered error summaries and field messages, redirects after successful POSTs, and escaped
  output for untrusted values.
- Do not call a live backend in unit or page tests. Integration with the backend is a documented
  manual prerequisite unless a dedicated environment is approved.
