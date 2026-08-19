# Skills Inventory

This inventory records reusable, project-specific skills. Before significant work, review this
file and the workspace skills under `.github/skills/`. Keep each entry factual and update its
status as it moves from proposed to active or deprecated.

| Name | Purpose | Triggers | Inputs | Outputs | Status |
| --- | --- | --- | --- | --- | --- |
| `grad-academy-tutor` | Explains Kainos Academy course topics to junior engineers using the course material first. | Questions about Academy subjects such as testing, frontend, Git, authentication, or APIs. | Developer question and relevant course topic. | Plain-language explanation grounded in course material. | Active |

## Creating Or Updating A Skill

A skill is appropriate only for a stable, repeatable, project-specific process. Each skill must be
concrete and executable, and contain:

- purpose and trigger conditions
- prerequisites and required inputs
- a step-by-step procedure
- a validation checklist and expected outputs
- repository examples where available
- anti-patterns
- applicable repository coding and testing standards

Create workspace skills under `.github/skills/<skill-name>/SKILL.md`. Add a proposed inventory row
when reuse value is identified; change it to active only after the skill is created and reviewed.
Do not use skills to record one-off fixes or task-specific notes.