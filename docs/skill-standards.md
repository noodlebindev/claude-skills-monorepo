# Skill standards

This repo follows the [Agent Skills open standard](https://agentskills.io). Every skill in `skills/` conforms to this spec.

## SKILL.md anatomy

```markdown
---
name: my-skill
description: Use when the user asks to do X or mentions Y. Provides Z.
license: MIT
metadata:
  category: content
  linked-skills: []
allowed-tools:
  - Read
  - Edit
forbidden-behaviours:
  - Do not modify files outside the user's working directory
  - Do not call external APIs without explicit permission
---

# my-skill

(Body — instructions to the agent. Under 500 lines. Move deep references to `references/`.)
```

## Required frontmatter fields

| Field | Rules |
|---|---|
| `name` | Matches `^[a-z0-9][a-z0-9-]{0,63}$`, matches folder name exactly |
| `description` | <= 1024 chars, written as a routing trigger sentence |

## Optional frontmatter fields

| Field | Purpose |
|---|---|
| `license` | SPDX identifier (e.g., `MIT`) |
| `compatibility` | Agent/runtime hints |
| `allowed-tools` | Explicit pre-approval list (experimental, see Agent Skills spec) |
| `forbidden-behaviours` | Hard "do not" list — surfaced to the agent at activation |
| `metadata` | Free-form key/value map |
| `metadata.linked-skills` | Explicit cross-skill references (whitelisted by `check-contamination.ts`) |

## Progressive disclosure

The Agent Skills spec defines a three-stage loading model:

1. **Discovery** (~100 tokens per skill): only `name` and `description` loaded at startup.
2. **Activation**: full `SKILL.md` body loaded when a task matches.
3. **Execution**: files in `scripts/`, `references/`, `assets/` loaded only on demand.

Implications:

- A long description does **not** help discovery — it just costs more tokens. Make it short and route-quality.
- A long SKILL.md body costs tokens at every activation. Keep it under 500 lines.
- Anything that's only relevant to specific sub-tasks belongs in `references/<topic>.md`, loaded lazily.

## Writing a routing-quality description

Your `description` is a routing rule. It tells the agent's selection layer when to load your skill.

**Three components of a good description:**

1. **The trigger.** When does this skill apply? Start with "Use when..."
2. **Key phrases.** What words/phrases in user input should fire this? Quote them.
3. **Anti-triggers.** When should this skill *not* fire? Add "Do not use for..." if the topic borders another skill.

**Examples:**

| Bad | Why bad | Better |
|---|---|---|
| `A date utility` | Title, not a routing rule | `Use when the user asks to parse, format, or compare dates — especially across timezones or with relative phrases like "next Tuesday"` |
| `Helps with code` | Too broad — fires on everything | `Use when the user asks to refactor TypeScript/JavaScript code for readability. Phrases: "clean up this code", "simplify this", "refactor"` |
| `For writing tweets` | Doesn't list platforms or trigger phrases | `Use when the user wants to draft, schedule, or publish posts to Twitter/X, LinkedIn, Threads, Bluesky, or Mastodon. Phrases: "tweet this", "post to LinkedIn", "schedule a thread"` |

## Description size

`description` is hard-capped at 1024 characters by the standard. We enforce this in `lint-skills.ts`.

Aim for 100–400 characters. Beyond that, you're paying tokens at every discovery without adding routing precision.

## Body size

SKILL.md body (excluding frontmatter) should stay under **500 lines**. If it grows beyond that:

- Move detailed procedure steps into `references/procedures.md`
- Move long examples into `examples/`
- Reference the supplementary files from the body: *"For the full XYZ procedure, see `references/xyz.md`."*

The body is loaded **every time** the skill activates. The reference files are loaded only when the agent decides it needs them.

## Tools and behaviours

`allowed-tools` and `forbidden-behaviours` are advisory under the current spec — they signal intent to the agent and to the user reviewing the skill. They are not enforced by the runtime today.

Still, declare them. They:

- Make the skill's contract explicit to humans reviewing it
- Let CI tools (including `audit-skills.ts`) flag obvious mismatches
- Future-proof against runtime enforcement when it lands

## File layout per skill

```
skills/<name>/
├── SKILL.md          # required
├── README.md         # required — human intro
├── CLAUDE.md         # required — agent context for this skill
├── package.json      # required — workspace metadata
├── examples/         # optional — usage examples
├── tests/            # optional — automated tests
├── scripts/          # optional — skill-local helpers
├── references/       # optional — deep reference docs (lazy-loaded)
└── assets/           # optional — templates, schemas, configs
```

## Naming conventions

- Skill names are lowercase, hyphenated, max 64 chars
- Folder name == `name` in frontmatter
- File names inside the skill: kebab-case for markdown, your language's convention for code

## Cross-skill references

Default: **forbidden**.

If you have an intentional reason for one skill to know about another (e.g., a parent/child workflow), declare it:

```yaml
metadata:
  linked-skills:
    - other-skill-name
```

`check-contamination.ts` reads this list when deciding whether to flag a reference.

## Independent portability

Every skill must pass this thought experiment: *if I copy `skills/<name>/` into a fresh repo and run nothing else, does it still describe a complete, usable skill?*

If no, the skill is leaning on something repo-global that should either move into the skill or be documented as an external dependency.
