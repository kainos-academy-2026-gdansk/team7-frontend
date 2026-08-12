# Agentic Development Lifecycle

## Lifecycle

```text
Memory -> Intake -> Planning -> Implementation -> Validation -> Dev handover
       -> Manual verification -> Retrospective -> Memory update
                                 | declined -> Planning
```

## Stages

### 1. Memory

The agent reads `memory.md`, `patterns.md`, `decisions.md`, and `testing.md`. It checks current code
before trusting memory and reports conflicts.

### 2. Intake

The developer supplies a story ID and attached CSV. The planning agent selects exactly one matching
row and restates its source text, acceptance criteria, dependencies, and missing information. Planner
MCP may replace CSV intake only after the pilot in `mcp-planner.md` is approved.

### 3. Planning

The agent traces the controlling code and nearby tests, then asks grouped clarification questions.
Requirements and technical choices that are not established in the story, code, or memory are new
items and require explicit approval. The developer reviews the complete plan before it is stored in
`.ai/plans/<STORY-ID>-plan.md`.

### 4. Implementation

The delivery agent reads the approved plan, preserves existing worktree changes, implements only the
approved scope, and adds focused tests. Discovery that changes scope sends the task back to planning.

### 5. Validation

Run the gates in `AGENTS.md` in order. Record commands and outcomes. Failures caused by the change
must be fixed. Unrelated or environmental failures are reported as blocked, never relabeled as pass.

### 6. Handover And Manual Verification

The agent summarizes behavior, files, decisions, automated evidence, risks, and precise browser
steps. The developer checks the UI and responds:

- `Approved`: continue to retrospective.
- `Declined: <observations>`: return to planning with those observations as new intake.

Only a human can approve manual verification or transition work to Ready for QA, Done, or Released.

### 7. Retrospective And Memory

After approval, the agent drafts a retrospective and exact memory/instruction changes. The developer
may approve, amend, or reject them. Accepted lessons are committed to the appropriate memory file;
task-specific details remain in the retrospective. Future tasks load those accepted lessons first.

## Handover Checklist

- Story and acceptance criteria are traceable to the intake source.
- The implementation matches the approved plan and contains no unrelated changes.
- Applicable lint, typecheck, unit, integration/page, build, and E2E gates are reported.
- Manual steps include URLs, setup, actions, and expected accessible behavior.
- API/backend prerequisites and known limitations are explicit.
- No status transition, retrospective, or memory change is presented as human-approved prematurely.
