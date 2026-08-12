# Retrospective: WORKFLOW-001 Bootstrap Agentic Delivery

- Date: 2026-08-12
- Developer verification: Approved through the requested repository bootstrap scope
- Learning review: Accepted through the requested repository bootstrap scope
- Plan: User-provided task definition in the initiating conversation

## Outcome

The repository gained a documented lifecycle, global agent guidance, separate planning and delivery
agents, validation and handover gates, committed memory, a retrospective process, and a guarded
Microsoft Planner MCP evaluation.

## Evidence

The guidance was checked against the current package scripts, CI workflow, Express/Nunjucks/Axios
architecture, and Vitest/Supertest test layout. Custom-agent frontmatter and repository links were
validated after creation. Product behavior was unchanged.

## What Helped

The backend `AGENTS-template.md` supplied a proven lifecycle and approval model. Reading frontend
code and tests prevented backend-only Prisma, migration, and Testcontainers rules from entering this
repository's workflow.

## Friction Or Surprises

The existing review guidance combines frontend and backend rules. Frontend agents must apply its
teaching and review style while ignoring Prisma-specific checks that cannot apply here.

## Lessons Proposed

Repository guidance must be derived from executable scripts and representative code, not copied
unchanged from a related repository. External task integration should begin read-only and preserve a
CSV fallback until identity, permission, audit, and approval controls are verified.

## Approved Promotions

- `docs/ai/memory.md`: record the frontend architecture, test boundary, and current CSV intake.
- `docs/ai/patterns.md`: record form, Axios, Nunjucks, and testing patterns.
- `docs/ai/decisions.md`: record the two-stage workflow and read-first Planner MCP pilot.
- `docs/ai/testing.md`: record current validation gates and the absence of browser E2E automation.
- `AGENTS.md` and `.github/copilot-instructions.md`: require conversational planning and human gates.

## Follow-Up

The team must select and security-review a Planner-capable MCP server before configuring the pilot.
Automated browser E2E coverage may be proposed as a separate approved task.
