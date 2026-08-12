# Project Patterns

Concrete patterns to copy, with the file that demonstrates each one. When a new page, form, or
service is needed, match these first instead of inventing a new shape.

## Routing and wiring (MVC)

- One router per resource. [src/routes/JobRoleRouter.ts](../../src/routes/JobRoleRouter.ts)
  constructs the shared Axios client, the services, then the controller, and injects them by
  constructor — no DI container, no factories:

  ```ts
  const jobRoleService = new JobRoleService(apiClient);
  const bandService = new BandService(apiClient);
  const capabilityService = new CapabilityService(apiClient);
  const statusService = new StatusService(apiClient);
  const jobRoleController = new JobRoleController(
    jobRoleService,
    bandService,
    capabilityService,
    statusService,
  );
  ```

- Routes are one line each and only wire a path to a controller method; no logic in the router.
- Register static paths before parameterised ones: `/job-roles/new` is declared before
  `/job-roles/:id` in the same file.
- `src/app.ts` builds the Express app, Nunjucks environment, static file/asset routes, and mounts
  the router; it never calls `listen()`. `src/index.ts` is the only place that starts the server.

## Controllers

- `export class XController` takes its services as constructor parameters
  ([src/controllers/JobRoleController.ts](../../src/controllers/JobRoleController.ts)). Handlers are
  arrow-function properties (`public getJobRolesPage = async (_req, res): Promise<void> => { ... }`)
  so `this` binds correctly when passed straight to Express.
- Read-only pages: fetch data, `res.render("pages/<name>.njk", { ... })`. Never fetch data or call
  Axios in the view.
- Form pages follow one shape: read raw fields with a helper (`readFormValues`), `safeParse` them
  against the DTO schema, and on failure re-render the same page with `400`, field errors, and the
  values the user typed (`toFormErrors`, `renderCreateForm`/`renderEditForm`). On success, call the
  service and `res.redirect(...)` (Post/Redirect/Get) — never `res.render()` after a mutation.
- Distinguish failure kinds: a `400` from the API is mapped back onto form fields with
  `readApiFieldErrors` (using `isAxiosError`); anything else is an unreachable-backend failure and
  renders `pages/error.njk` with a `503` and a generic, user-safe message plus a `retryUrl`. Never
  surface the raw Axios error, stack trace, or backend message to the page.
- Route params arrive as strings; convert and guard with a small helper (`readId`) and render a
  not-found page rather than letting `NaN`/negative ids reach the service.

## Services

- `export class XService` takes the shared `AxiosInstance` via constructor injection
  ([src/services/JobRoleService.ts](../../src/services/JobRoleService.ts),
  [src/services/BandService.ts](../../src/services/BandService.ts)) — never import or construct
  Axios directly, and never import Express types.
- One method per backend call, named after the action (`getJobRoles`, `createJobRole`,
  `getJobRoleById`, `updateJobRole`). Return `response.data` typed against a model interface.
- A backend lookup table gets its own read-only one-method service copied from `BandService`
  (`BandService`, `CapabilityService`, `StatusService`) rather than extra methods on `JobRoleService`.
- Frontend-only business rules that don't belong in a controller live here (for example
  `getJobRoles` filtering to the `OPEN` status name, or `isValidSharePointUrl` dropping an untrusted
  link before it reaches the view).
- Translate a backend `404` into a small typed error (`JobRoleNotFoundError extends Error`) instead
  of leaking a raw Axios error up to the controller.
- The shared client itself is configured once in
  [src/client/axiosClient.ts](../../src/client/axiosClient.ts) (`baseURL` from `API_BASE_URL`, JSON
  header, a timeout) and imported by routers — reuse it, don't hardcode a base URL elsewhere.

## DTOs and validation

- Zod schemas live in `src/Dto/<Action><Entity>Dto.ts` and export both the schema
  (`createJobRoleSchema`) and its inferred type (`export type CreateJobRoleDto = z.infer<typeof
  createJobRoleSchema>`) — never a hand-written duplicate interface.
- Shared field rules are factored into reusable builders in
  [src/Dto/formFields.ts](../../src/Dto/formFields.ts): `requiredText(label, max)`,
  `optionalText(label, max)`, `selectedId(label)`, `selectedName(label)`,
  `optionalOpenPositions`, `optionalUrl`, `optionalClosingDate`. Reuse these builders for new form
  fields instead of writing a fresh `z.string()...` chain.
- Blank optional inputs are normalised to `null` with a `blankToNull` preprocessor before validation,
  so "not provided" and "explicitly cleared" both resolve to `null`, never `""` or `undefined`.
- Every user-facing Zod error message is a short imperative sentence naming the field
  (`"Enter a role name"`, `"Select a band"`) so it can be shown directly in the GOV.UK error summary
  and inline error without rewriting.
- Model interfaces (`src/models/JobRole.ts`) describe backend response shapes only — no methods, no
  validation, no classes.

## Views: GOV.UK + Kainos styling

- Every Nunjucks template composes GOV.UK Frontend classes with a Kainos brand class on the same
  element (see [src/views/partials/formMacros.njk](../../src/views/partials/formMacros.njk),
  [src/views/partials/header.njk](../../src/views/partials/header.njk),
  [src/views/partials/footer.njk](../../src/views/partials/footer.njk)):

  ```html
  <label class="govuk-label kainos-form__label" for="{{ name }}">{{ label }}</label>
  <input class="govuk-input kainos-form__input {% if error %}govuk-input--error{% endif %}" ... />
  ```

  The `govuk-*` class keeps GOV.UK behaviour, layout, and accessibility; the `kainos-*` class carries
  brand styling only. Add both when introducing a new component; never replace a `govuk-*` class.
- Kainos classes follow BEM: `kainos-block`, `kainos-block__element`, `kainos-block__element--modifier`
  (for example `kainos-job-detail`, `kainos-job-detail__header`, `kainos-pagination__page--current`
  in [public/styles/app.css](../../public/styles/app.css)).
- Brand tokens are CSS custom properties defined once on `:root` (`--kainos-blue`, `--kainos-green`,
  `--kainos-grey`, `--kainos-border`, `--kainos-tint`, `--kainos-text`, `--kainos-font`). New brand
  colours or fonts extend this list; don't hardcode a hex value or font stack inline.
- Reusable form building blocks live in `formMacros.njk` (`errorSummary`, `textInput`, `select`,
  `textarea`), and page-specific forms compose them in
  [src/views/partials/jobRoleForm.njk](../../src/views/partials/jobRoleForm.njk). Build a new form
  field with these macros rather than hand-writing GOV.UK markup again.
- `errorSummary(errorList)` renders the GOV.UK error summary; each field macro accepts an `error`
  string and renders the matching `govuk-input--error`/inline message and `aria-describedby` link.
  Keep the summary's `<a href="#{{ error.field }}">` targeting the field's `id` so keyboard/assistive
  tech navigation keeps working.
- `base.njk` keeps `autoescape: true` (set once in `src/app.ts`) and includes `partials/header.njk`
  and `partials/footer.njk`; page templates only fill `{% block content %}` (and `banner`/`title`
  where used). Never call a Nunjucks `safe` filter on user- or API-supplied content.

## Testing

- Service tests mock `AxiosInstance` per method (`{ get: vi.fn(), post: vi.fn(), put: vi.fn() }`)
  and assert both the exact call arguments and the returned shape
  ([test/services/services.test.ts](../../test/services/services.test.ts)).
- Page/route tests mock the `axios` module itself with `vi.hoisted` so the router's
  `axios.create()` returns the mock, then use Supertest against the real exported `app`
  ([test/pages/addJobRole.test.ts](../../test/pages/addJobRole.test.ts)). This exercises the real
  router → controller → service → Nunjucks path without a live backend.
- Cover, per form page: the happy path payload sent to the API, optional fields blanked to `null`,
  each validation rule rejecting with `400` and the right message, entered values being kept after a
  validation failure, API-reported field errors being shown on the right field, and an unreachable
  API producing a `503` with a generic message (never the raw error text).

## Avoid

- API calls, data transformation, or branching business rules in Nunjucks templates.
- Axios instances or backend URLs created inside controllers, services, or templates — always go
  through `src/client/axiosClient.ts`.
- Trusting `req.body` or route parameters without parsing and validation.
- Returning backend internals, stack traces, or raw exception messages to users.
- Client-only validation, unescaped HTML, or visual-only error indication (color without text/icon).
- Adding a `kainos-*` class without its paired `govuk-*` class, or replacing a `govuk-*` class outright.
- A hardcoded color, font, or spacing value where a `--kainos-*` custom property already exists.
- New abstractions for a single use case when an existing local pattern is sufficient.
