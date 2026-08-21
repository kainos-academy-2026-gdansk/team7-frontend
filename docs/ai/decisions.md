# Decision Log

## D-001: Committed Repository Memory And Two-Stage Agent Workflow

- Date: 2026-08-12
- Status: Accepted
- Context: The team wants consistent AI support from task intake through learning while retaining
  human control over requirements, verification, and work-item status.
- Decision: Commit durable memory under `docs/ai/`; use separate planning and delivery agents; keep
  approved working plans in ignored `.ai/plans/`; require developer approval for invented technical
  choices, manual verification, retrospective lessons, memory promotion, and status transitions.
- Consequences: Future work begins with shared context and produces traceable handovers. Developers
  remain accountable for decisions and task state. Memory requires normal code review maintenance.
- Alternatives: One unrestricted agent was rejected because it weakens stage boundaries. Chat-only
  memory was rejected because it is not shared, reviewable, or durable.

## D-003: Disposable Compose Environment For Browser E2E

- Date: 2026-08-21
- Status: Accepted
- Context: Backend-dependent Playwright scenarios require a seeded API and database, while unit and
  Supertest tests must remain isolated from a live backend.
- Decision: The frontend repository owns `docker-compose.e2e.yml`, which starts PostgreSQL, a
  one-shot backend seed service, and the backend E2E image from GHCR. The CI E2E job pulls the image,
  runs the full browser suite, and removes the stack and volume afterward.
- Consequences: Every CI E2E run starts with a clean database. The frontend workflow needs read
  access to the backend GHCR package and runtime E2E secrets/variables. Application scenarios use
  separate configured role IDs so state is not shared accidentally.
- Alternatives: A manually started backend/database was rejected because it cannot make CI E2E
  repeatable. Resetting a shared database between individual scenarios was rejected because it is
  slow and conflicts with serial administrator scenarios.

## D-002: CSV Intake Before Microsoft Planner MCP Pilot

- Date: 2026-08-12
- Status: Accepted
- Context: No team-approved Microsoft Planner MCP server or credentials are configured in this repo.
- Decision: Use developer-attached CSV files for initial story intake and evaluate Planner MCP through
  the read-first pilot and guardrails in `mcp-planner.md`.
- Consequences: The workflow can start without external access. Planner updates remain unavailable
  until security, identity, permissions, audit, and approval behavior are verified.
