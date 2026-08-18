# Retrospective: Playwright E2E Foundation

- Date: 2026-08-18
- Developer verification: Pending
- Learning review: Proposed
- Plan: Session plan for the Playwright E2E foundation

## Outcome

Added the first browser-level test layer without changing the Express application or replacing the
existing Vitest/Supertest suite.

- Added `@playwright/test` as a development dependency.
- Added `playwright.config.ts` with an isolated `e2e/` test directory, a local SSR web server,
  Chromium project, HTML reporting, and failure-only artifacts.
- Added `test:e2e` and `test:ui` scripts.
- Added public smoke coverage for the health endpoint, home page, and login form.
- Added a small `HomePage` object only for the repeated home-page navigation and semantic locators.

## Evidence

- `npm run test:e2e`: 3 Playwright smoke tests passed in Chromium.
- `npm run ci:check`: passed after the initial E2E setup.
- Manual browser/Playwright UI verification: Pending developer verification.

## What Helped

- Starting with public non-mutating routes avoided backend fixture, authentication, and shared-state
  requirements.
- Semantic Playwright locators (`getByRole`, `getByLabel`) match the project's accessibility goals
  and are less coupled to markup than CSS selectors.
- The Playwright practices guide prevented premature fixtures, page-object hierarchies, mocks, and
  authentication-state setup.

## Friction Or Surprises

- Playwright API responses do not provide a `toHaveJSON` matcher. The health test must await
  `response.json()` and assert the resulting in-memory object.
- Browser-level route mocks cannot intercept Axios requests made by the server-side Express process.
  Data-dependent SSR E2E scenarios need a controlled real backend or a separate mock API server.
- Playwright requires its browser binaries to be installed separately from the npm dependency.

## Lessons Proposed

- Establish a new Playwright suite with one direct, high-value smoke spec before introducing page
  objects, custom fixtures, auth state, or test-data helpers.
- For SSR applications, distinguish browser requests from server-side API calls when deciding whether
  a Playwright route mock can control a dependency.
- Use web-first assertions for page state and normal Vitest-style assertions only for API response
  bodies already read into memory.

## Approved Promotions

None. Developer review is required before updating `docs/ai/testing.md` or other repository memory.

## Follow-Up

- Developer runs `npm run test:ui` and verifies the test report/diagnostic workflow manually.
- Update `README.md` and propose a change to `docs/ai/testing.md` after manual verification.
- Add data-dependent E2E scenarios only after a separate decision on controlled backend data,
  isolated accounts, or a dedicated mock API server.
- Add CI execution and failure-artifact upload only after local Playwright runs are stable.
