# team7-frontend
Team7 Frontend

## Browser E2E tests

The full browser suite runs against a disposable PostgreSQL database and an E2E backend image. The
test stack is defined in `docker-compose.e2e.yml`:

```text
postgres -> seed (migrations + seed) -> backend -> Playwright frontend
```

Playwright starts the frontend on `E2E_PORT`; the backend is exposed on port `3000`. The seed service
exits after `prisma migrate deploy` and `prisma db seed`; the backend starts only after it succeeds.

### Run locally

1. Copy `.env.example` to `.env` and set the required E2E values. Do not commit `.env`.
2. Set `BACKEND_E2E_IMAGE` to the backend E2E image, normally `e2e-latest`, and set a local-only
	`E2E_JWT_SECRET`.
3. Authenticate Docker to GHCR if the backend package is private:

	```bash
	docker login ghcr.io -u YOUR_GITHUB_LOGIN
	```

4. Start the dependencies and run the tests:

	```bash
	docker compose -f docker-compose.e2e.yml up -d --wait
	npm run test:e2e
	```

5. Remove containers and the database volume afterward:

	```bash
	docker compose -f docker-compose.e2e.yml down -v
	```

For an Apple Silicon machine, the backend image must include `linux/arm64`; otherwise Docker must
emulate the published `linux/amd64` image.

### E2E configuration

The following values are required locally in `.env` and are supplied by GitHub Actions in CI:

```env
API_BASE_URL=http://127.0.0.1:3000
SESSION_SECRET=
BASE_URL=http://127.0.0.1:4001
E2E_PORT=4001
BACKEND_E2E_IMAGE=ghcr.io/kainos-academy-2026-gdansk/team7-backend:e2e-latest
E2E_JWT_SECRET=
E2E_ADMIN_EMAIL=
E2E_ADMIN_PASSWORD=
E2E_USER_EMAIL=
E2E_USER_PASSWORD=
E2E_ADMIN_JOB_ROLE_ID=
E2E_APPLICATION_JOB_ROLE_ID=
E2E_EMPTY_APPLICATION_JOB_ROLE_ID=
```

The three job-role IDs are intentionally separate. Administrator scenarios require seeded
`IN_PROGRESS` applications. Successful-application and empty-form scenarios use different roles so
one scenario cannot hide the Apply link required by the other.

`playwright-bdd` generates ignored files under `e2e/.features-gen/`. Use `npm run test:ui`,
`npx playwright test --debug`, or `npx playwright show-report` to diagnose a failure.

### CI E2E configuration

The E2E job pulls the backend image from GHCR, starts the Compose stack, runs the complete suite,
prints Compose logs when a test fails, and removes the stack with `down -v`.

Configure these repository-level GitHub Actions secrets:

- `E2E_JWT_SECRET`
- `E2E_FRONTEND_SESSION_SECRET`
- `E2E_ADMIN_PASSWORD`
- `E2E_USER_PASSWORD`

Configure these repository-level GitHub Actions variables:

- `BACKEND_E2E_IMAGE`
- `E2E_ADMIN_EMAIL`
- `E2E_USER_EMAIL`
- `E2E_ADMIN_JOB_ROLE_ID`
- `E2E_APPLICATION_JOB_ROLE_ID`
- `E2E_EMPTY_APPLICATION_JOB_ROLE_ID`

The GHCR backend package must grant this frontend repository read access. The E2E job requests
`packages: read` and logs in with its `GITHUB_TOKEN`.

### Test framework structure

- `e2e/config/` holds environment-derived Playwright configuration. Set `BASE_URL` to test an
	existing deployment or `E2E_PORT` to change the local server port.
- `e2e/fixtures/` exports the shared Playwright `test` and `expect`. Add reusable page objects and
	API clients there as fixtures.
- `e2e/api/` contains endpoint-specific API clients built on Playwright's request context.
- `e2e/setup/` contains suite lifecycle registration, such as browser state setup and teardown.
- `e2e/utils/` contains framework-agnostic test helpers.
- `e2e/pages/` contains page objects with user-facing locators and navigation methods.
