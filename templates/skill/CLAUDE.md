# Agent context for {{SKILL_NAME}}

You are working inside the `{{SKILL_NAME}}` skill folder. This file is per-skill context that supplements (and where relevant, overrides) the repo-root `CLAUDE.md`.

## Scope

Your work is limited to `skills/{{SKILL_NAME}}/`. Do not modify:

- Other skills' folders
- Repo-root files (`package.json`, `pnpm-workspace.yaml`, root `scripts/`, root `docs/`)
- Other workspaces' dependencies

If your task requires touching those, stop and tell the user — that's a separate PR.

## Verification

Before claiming a task complete:

```bash
cd ../..  # from the skill folder back to repo root
pnpm lint
pnpm health
pnpm contamination
```

All three must pass. If any fail, fix or explain.

## Skill-specific notes

<Add anything an agent should know when working on THIS skill specifically. Examples:

- "This skill's SKILL.md body is intentionally long — see references/ for the split rationale"
- "The tests/ folder uses Vitest, run via `pnpm --filter @claude-skills/{{SKILL_NAME}} test`"
- "Examples in examples/ are pinned — do not regenerate without manual review"

If there's nothing skill-specific to say, leave this section empty.>

## Common tasks for this skill

<Optional. List the common edits a maintainer makes here. For example:

- Updating the trigger description
- Adding a new failure-mode example
- Refreshing the `references/<topic>.md` files

If there's nothing routine, delete this section.>
