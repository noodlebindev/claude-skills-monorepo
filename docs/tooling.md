# Tooling decisions

This repo deliberately ships with the minimum monorepo machinery needed today. This document explains why, and when each next layer should be added.

## What we have today

- **pnpm workspaces.** Each skill is its own package. Per-skill `package.json`, per-skill scripts, per-skill local dependencies. `pnpm install` once at the root.
- **TypeScript via tsx.** No build step for the root tooling scripts in `scripts/`. They run directly with `tsx`.
- **A small set of shell-friendly scripts** in `scripts/`: audit, lint, generate-index, contamination check, scaffold-new-skill.

## What we deliberately do NOT have

- **Turborepo / Nx.** Skipped until we feel the pain.
- **Changesets / semantic-release.** Skipped until we publish skills somewhere that benefits from per-skill versioning.
- **Per-skill release pipelines.** Skipped — this repo's primary distribution model is "clone or `cp -r`", not npm publishing.
- **Renovate / Dependabot automation.** Skipped — no maintainer is currently willing to triage automated bump PRs.

## Why

Three reasons:

1. **Most of these tools optimize problems we don't have yet.** Turborepo accelerates large CI graphs. We don't have a large CI graph. Changesets coordinates publishing many independently versioned packages. We don't publish.
2. **Each tool is a new contributor onboarding cost.** A first-time contributor opening this repo today needs to know `pnpm install` and Markdown. That's it. Adding Turborepo means they also need to know Turbo's pipeline syntax.
3. **Premature release machinery becomes an excuse to release.** We'd rather skills mature in-place and get tagged when actually stable, not every Friday.

## When to add Turborepo

**Trigger:** CI on `main` regularly takes over 5 minutes, or contributors complain about waiting.

**Symptoms:**
- We have more than ~15 skills, **and**
- Each skill has its own `test` script that runs in CI, **and**
- We want to run only the affected skills' tests, not all of them

**Migration sketch:**

1. `pnpm add -D -w turbo`
2. Add `turbo.json` at the root with a `pipeline` for `test`, `lint`, `audit`
3. Replace root `package.json` scripts with `turbo run test`, `turbo run lint`, etc.
4. Add `--filter='...[HEAD^1]'` in CI for affected-only runs
5. Configure remote caching (Vercel-hosted free tier or self-hosted) — this is the biggest lift
6. Update `docs/tooling.md` to remove the "we don't use Turbo" section

Estimated effort: 0.5–1 day.

## When to add Changesets

**Trigger:** We start publishing skills to npm, skills.sh, or any other registry, AND skills evolve at independent paces.

**Symptoms:**
- A skill ships breaking changes — we need a SemVer signal
- Users install specific versions of specific skills, not the whole repo
- Manually maintaining per-skill CHANGELOG files is tedious

**Migration sketch:**

1. `pnpm add -D -w @changesets/cli`
2. `pnpm changeset init`
3. Each PR that changes a skill adds a `.changeset/*.md` file describing the bump (patch/minor/major)
4. Add the Changesets GitHub Action to auto-open a "Version Packages" PR
5. When that PR merges, packages publish (if configured)

Estimated effort: 1 day, plus team-onboarding lift (everyone learns to write changesets).

## When to add module boundary enforcement

**Trigger:** Cross-skill imports start appearing despite `check-contamination.ts`.

**Today's enforcement:** `scripts/check-contamination.ts` greps for `skills/other-name/` style references and bails on the build if any unwhitelisted reference is found.

**Future enforcement:** If skills ever ship real TypeScript code that imports from each other, add `eslint-plugin-boundaries` or `@nx/enforce-module-boundaries` (if migrating to Nx). Tag each skill `type:skill` and disallow `type:skill` → `type:skill` imports.

## When to add a release pipeline

**Trigger:** We commit to a public registry as the distribution channel.

This is the largest upgrade. It implies:

- Versioning strategy (Changesets — see above)
- A way to publish (npm, skills.sh, GitHub Releases, custom registry)
- A CI workflow that publishes on merge
- A `prepublish` validation step (frontmatter, README presence, license, no secrets)
- Provenance attestation (npm with `--provenance` flag) if we want sigstore verification

Don't do this until at least 3 of our skills have external users who care about pinning versions.

## When to add per-skill `tsconfig` project references

**Trigger:** A meaningful number of skills include TypeScript code (not just `scripts/` for the maintainer), AND `tsc --build` time becomes annoying.

Today: no skill ships TypeScript. The root `tsconfig.json` only covers `scripts/`.

Future: each skill adds `tsconfig.json` with `"composite": true` and references its siblings. Root `tsconfig.references.json` lists every skill. `tsc --build` then caches per-skill.

## The principle

Add tooling **when you feel the pain**, not before. Document the pain trigger in this file when you add it, so the next maintainer understands why the complexity is there.
