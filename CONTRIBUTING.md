# Contributing

Thanks for the interest. This repo hosts many independent skills, so contribution rules emphasize **isolation** and **predictability** over speed.

## Before you start

1. Read [`CONVENTIONS.md`](CONVENTIONS.md). It's enforced.
2. Read [`docs/skill-standards.md`](docs/skill-standards.md) for the SKILL.md spec.
3. If you're adding a new skill, read [`docs/adding-a-skill.md`](docs/adding-a-skill.md).

## Setup

```bash
pnpm install
pnpm check   # should pass on a clean checkout
```

Node 22+ and pnpm 9+ required (see `.nvmrc` and `packageManager`).

## Adding a new skill

```bash
pnpm new my-skill-name
```

Follow the prompts. The script copies `templates/skill/` to `skills/my-skill-name/` and rewrites placeholders.

Mandatory edits before opening a PR:

- [ ] `SKILL.md` `description` is a routing-quality trigger sentence (not a title)
- [ ] `SKILL.md` body is under 500 lines (move long reference material to `references/`)
- [ ] `README.md` has at least one usage example
- [ ] `pnpm check` passes
- [ ] No file in your skill references another skill's path

## Modifying an existing skill

1. Open a focused PR. One skill per PR is strongly preferred.
2. Update the skill's own `CHANGELOG.md` if you have one — the root `CHANGELOG.md` tracks repo-level changes only.
3. Run `pnpm check`.

## Bulk edits across many skills

**Do not run blind find-and-replace.** If you need to change something across all skills (a frontmatter field, a header convention, a header), do it through a script:

1. Add or extend a script in `scripts/`.
2. Run it locally.
3. Review the diff per-skill before committing.

This rule exists because a single typo in a find-and-replace can quietly corrupt 30 SKILL.md files.

## PR checklist

- [ ] `pnpm check` passes
- [ ] Each touched skill still works standalone (could be copied out and used)
- [ ] No cross-skill imports or references introduced
- [ ] `README.md` updated if behaviour changed
- [ ] Root `CHANGELOG.md` updated only if a repo-wide convention changed

## Code review

Maintainers will reject PRs that:

- Add cross-skill dependencies without explicit `metadata.linked-skills` declaration in SKILL.md
- Modify shared scripts in a way that breaks any existing skill
- Add release machinery (Changesets, semantic-release, etc.) without a separate discussion issue
- Bypass `pnpm check` in CI

## Security

See [`SECURITY.md`](SECURITY.md). Do not file public issues for vulnerabilities.
