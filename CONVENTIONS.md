# Conventions

Rules for **anyone** — human or AI — contributing to this repo. Enforced by `pnpm check` where possible.

## Skill folder layout

Every skill **must** have:

```
skills/<skill-name>/
├── SKILL.md          # required
├── README.md         # required
├── CLAUDE.md         # required — per-skill agent context
└── package.json      # required — workspace metadata
```

Optional but encouraged:

```
├── examples/         # usage examples
├── tests/            # automated tests
├── scripts/          # skill-local helpers
├── references/       # supplementary docs loaded on demand
└── assets/           # templates, schemas, configs
```

## SKILL.md rules

1. **Frontmatter is YAML.** Only these top-level fields are permitted:
   - `name` (required) — must match folder name, regex `^[a-z0-9][a-z0-9-]{0,63}$`
   - `description` (required) — max 1024 chars, written as a routing trigger sentence
   - `license` (optional) — SPDX identifier
   - `compatibility` (optional) — agent/runtime hints
   - `allowed-tools` (optional) — list of tool names this skill may use
   - `forbidden-behaviours` (optional) — list of things this skill must not do
   - `metadata` (optional) — free-form key/value map. Use `metadata.linked-skills` to declare intentional cross-skill references.

2. **Body must be under 500 lines.** Move deep reference material to `references/<topic>.md`.

3. **The description is a routing rule, not a title.** It is what the agent sees at discovery time. Write it as: *"Use when the user asks to X, mentions Y, or wants Z."*

4. **No tool-specific extensions.** Stay within the Agent Skills open standard so the skill works across Claude, Codex, Gemini CLI, Cursor, etc.

## Folder name rules

- Lowercase only
- Hyphens, not underscores or spaces
- Must match the `name` in SKILL.md frontmatter exactly
- No nesting under `skills/` — flat layout

## Isolation rules

1. **No skill may reference another skill's files.** No relative paths like `../other-skill/`. No imports from sibling skill folders.

2. **Intentional links** must be declared in frontmatter:
   ```yaml
   metadata:
     linked-skills: [other-skill-name]
   ```
   The contamination check tolerates declared links and rejects undeclared ones.

3. **Shared code lives in `scripts/` at the root**, not inside any skill. If two skills need the same helper, copy it. Duplication beats hidden coupling.

4. **Every skill must be copy-portable.** `cp -r skills/<name> /elsewhere/` must produce something that still works (modulo `pnpm install` for its own deps).

## Bulk edit rules

1. **No blind find-and-replace.** A single typo across 30 skills is silent corruption.
2. Bulk changes happen through a script in `scripts/` that reads each skill, applies a transform, and writes back.
3. Run `pnpm check` after any bulk change.

## Description quality bar

A good `description` does three things:

- **Names the trigger** ("when the user asks to refactor TypeScript", not "TypeScript helper")
- **Lists key phrases** ("'simplify this', 'clean up this code'") — agents semantic-match against these
- **Excludes false positives** when ambiguous ("Do not use for unrelated linting")

Bad: `A skill for handling dates`
Good: `Use when the user asks to parse, format, or compare dates, especially across timezones or with relative phrasing like "next Tuesday"`

## AI agent contribution rules

Agents (Claude Code, Codex, Cursor, etc.) opening PRs on this repo **must** follow these rules. PRs that violate them will be closed without review.

- Do not invent new top-level frontmatter fields
- Do not add cross-skill imports
- Do not modify shared `scripts/` to special-case a single skill
- Do not introduce release tooling (Changesets, semantic-release) without prior discussion
- Always run `pnpm check` and include the output in the PR description

## Why these rules exist

Per-skill isolation is the **only** thing that makes a multi-skill repo sustainable. The moment skills can reach into each other, you have a distributed monolith that's worse than a single big skill.
