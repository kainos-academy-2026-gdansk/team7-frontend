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

### Test framework structure

- `e2e/config/` holds environment-derived Playwright configuration. Set `BASE_URL` to test an
	existing deployment or `E2E_PORT` to change the local server port.
- `e2e/fixtures/` exports the shared Playwright `test` and `expect`. Add reusable page objects and
	API clients there as fixtures.
- `e2e/api/` contains endpoint-specific API clients built on Playwright's request context.
- `e2e/setup/` contains suite lifecycle registration, such as browser state setup and teardown.
- `e2e/utils/` contains framework-agnostic test helpers.
- `e2e/pages/` contains page objects with user-facing locators and navigation methods.
