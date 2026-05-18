# Agent context for distil-research

You are working inside the `distil-research` skill folder. This file is per-skill context that supplements (and where relevant, overrides) the repo-root `CLAUDE.md`.

## Scope

Your work is limited to `skills/distil-research/`. Do not modify:

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

- **SKILL.md body is close to the 500-line cap.** Manifest schema content lives in `references/manifest-schema.md` — keep it there. If you add new procedural sections to SKILL.md, look for sections to move to `references/` instead of growing the body.
- **The skill operates on user data** (`~/Research/<topic>/` folders). Safety rules at the bottom of SKILL.md are load-bearing: never delete, never overwrite in `_archive/` or `_quarantine/`, never auto-rename. Don't soften them.
- **Two-job test requires user confirmation.** Don't silently split a playbook — the SKILL.md procedure says "wait for user approval" for a reason (split decisions are hard to reverse cleanly).
- **`tests/` contains iteration snapshots**, not Vitest tests. They're frozen examples of past runs used to verify behaviour against real data. Don't reformat or "modernise" them.

## Common tasks for this skill

- Tightening the description's routing trigger (in SKILL.md frontmatter)
- Adjusting the strict keep gate criteria (Step 4)
- Refining cluster-mode heuristics (Step 3.5)
- Adding a new failure mode to "Safety rules"
- Documenting a new manifest field in `references/manifest-schema.md`

If a change feels structural (touches multiple sections, changes the manifest shape, alters the file-routing logic), bump `version` in `package.json` minor and add a `CHANGELOG.md` entry. Patch bumps are for wording fixes only.
