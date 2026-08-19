# Copilot Instructions

Read and follow [../AGENTS.md](../AGENTS.md) and the committed memory under
[../docs/ai/](../docs/ai/) before planning or changing code.

- Use the documented lifecycle: memory, intake, conversational planning, approved implementation,
  validation, developer handover, manual verification, retrospective, and approved memory update.
- Ask grouped clarification questions. Do not invent requirements, dependencies, architecture, API
  contracts, or UI patterns without explicit developer approval.
- Follow the existing Express -> controller -> service -> shared Axios client and Nunjucks rendering
  boundaries. Preserve GOV.UK accessibility and secure autoescaped rendering.
- Make focused changes with tests and run the applicable gates from `AGENTS.md` before handover.
- For code review, prioritize behavioral bugs, security, accessibility, regressions, API contract
  drift, and missing tests. Follow
  [copilot-review-instructions.md](copilot-review-instructions.md), excluding all of its legacy
  backend-only rules.
- Never claim human approval or change a work item to Ready for QA, Done, or Released.
