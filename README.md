# team7-frontend
Team7 Frontend

## Browser tests

Install the Playwright Chromium browser once after installing dependencies:

```bash
npx playwright install chromium
```

Run the browser smoke suite:

```bash
npm run test:e2e
```

Playwright starts the local frontend automatically. Use UI mode or the HTML report to diagnose a
failure:

```bash
npm run test:ui
npx playwright test --debug
npx playwright show-report
```

## Playwright BDD

The login example uses Gherkin with `playwright-bdd`. The feature describes the behavior in
`features/login.feature`, step definitions connect those sentences to Playwright in
`e2e/steps/login.steps.ts`, and `e2e/pages/LoginPage.ts` contains the page locators and actions.

Run the BDD scenario with the registered test account used by this example:

```bash
npm run test:bdd
```

The email and password are currently written directly in `features/login.feature` as a temporary
exercise setup. The generated Playwright files are written to `e2e/.features-gen/` and ignored by
Git. To run all browser tests, including the BDD scenarios and smoke tests, use `npm run test:e2e`.
The login scenarios are tagged `@requires-backend`, so CI excludes them because this repository's
workflow starts the frontend but does not start the separate backend service.

### Administrator Application Management

The administrator application-management scenarios require the backend, a freshly seeded local
database, and the following local-only values in `.env`. Do not commit `.env` or its values:

```env
E2E_ADMIN_EMAIL=
E2E_ADMIN_PASSWORD=
E2E_JOB_ROLE_ID=1
```

Before running the feature, reset and seed the backend database, then start the backend:

```bash
npx prisma migrate reset
npm run dev
```

Run the administrator feature from the frontend repository:

```bash
npx bddgen && npx playwright test e2e/.features-gen/features/admin-application-management.feature.spec.js --project=chromium
```

The feature uses `@mode:serial` because its scenarios share seeded applications and change their
statuses. Reset the backend database before another full run.

### Test framework structure

- `e2e/config/` holds environment-derived Playwright configuration. Set `BASE_URL` to test an
	existing deployment or `E2E_PORT` to change the local server port.
- `e2e/fixtures/` exports the shared Playwright `test` and `expect`. Add reusable page objects and
	API clients there as fixtures.
- `e2e/api/` contains endpoint-specific API clients built on Playwright's request context.
- `e2e/setup/` contains suite lifecycle registration, such as browser state setup and teardown.
- `e2e/utils/` contains framework-agnostic test helpers.
- `e2e/pages/` contains page objects with user-facing locators and navigation methods.
