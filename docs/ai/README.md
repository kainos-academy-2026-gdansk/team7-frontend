# AI Workflow

This directory is committed, team-owned context for AI-supported delivery.

| File | Purpose |
| --- | --- |
| [workflow.md](workflow.md) | Lifecycle, approval points, validation, and handover |
| [memory.md](memory.md) | Stable project facts and operational context |
| [patterns.md](patterns.md) | Reusable implementation patterns and anti-patterns |
| [decisions.md](decisions.md) | Approved technical and workflow decisions |
| [testing.md](testing.md) | Test strategy, commands, and known constraints |
| [mcp-planner.md](mcp-planner.md) | Microsoft Planner MCP evaluation and guardrails |
| [retrospectives/TEMPLATE.md](retrospectives/TEMPLATE.md) | Developer-reviewed learning template |

## Task Intake

Until a Planner MCP pilot is approved and configured, attach a CSV and provide the user story ID to
the `Plan User Story` workspace agent. The CSV must provide an identifiable story ID plus enough
columns to determine title/description and acceptance criteria. Header names may differ, so the agent
must inspect them and ask rather than guess mappings. Duplicate or missing IDs stop intake.

Working plans are stored in `.ai/plans/` and ignored by Git. Durable learning belongs here only after
developer review and approval.
