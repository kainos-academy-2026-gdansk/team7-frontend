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
