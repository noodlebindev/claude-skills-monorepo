# Agent constitution

You are an AI agent working inside `claude-skills`. Read this before doing anything.

## What this repo is

A monorepo of independent Claude skills. Each lives in `skills/<name>/`. Each is a self-contained artifact that another agent or human can copy into their own setup and use immediately.

## Hierarchical context

When you operate inside a specific skill folder, **also read** `skills/<that-skill>/CLAUDE.md`. The skill-level file overrides this one for that skill's scope.

Read order:
1. This file (`CLAUDE.md` at repo root)
2. `CONVENTIONS.md` (enforced rules)
3. `skills/<active-skill>/CLAUDE.md` (skill-specific context, if working inside a skill)

## What you must NOT do

- **Do not** modify another skill while working on the skill you're assigned to.
- **Do not** introduce cross-skill imports. If you find yourself wanting to, the work belongs in `scripts/` at the root.
- **Do not** change root tooling (`scripts/`, `package.json`, `pnpm-workspace.yaml`) as a side effect of skill work — open a separate PR.
- **Do not** add release machinery (Changesets, semantic-release, version-bumping bots) without explicit user request. The current decision is documented in `docs/tooling.md`.
- **Do not** rewrite `SKILL.md` files to invent new frontmatter fields. The allowed schema is fixed in `CONVENTIONS.md`.
- **Do not** auto-update dependencies across all skills in one PR.
- **Do not** run blind find-and-replace across `skills/`. Use a script.

## What you should do

- When asked to add a skill: use `pnpm new <name>` then edit the scaffolded files.
- When asked to fix a skill: stay inside that skill's folder.
- When asked to do a bulk change: write or extend a script in `scripts/`, run it, review the diff.
- Before claiming a task is done: run `pnpm check`.

## How to recognise scope creep

If the task description says "add X to skill Y" and you find yourself editing:
- `scripts/` — stop, this is a separate PR
- another skill — stop, this is contamination
- root `package.json` — stop, this is repo-wide
- `CONVENTIONS.md` — stop, this is a governance change

Ask the user before continuing.

## Verification

The single source of truth is `pnpm check`. It runs:
- `pnpm lint` — SKILL.md frontmatter validator
- `pnpm health` — aggregate health report
- `pnpm contamination` — cross-skill reference detector

Never report a task complete without `pnpm check` passing.
