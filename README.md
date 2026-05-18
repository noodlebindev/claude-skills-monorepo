# claude-skills

An open-source monorepo for Claude skills, built around three principles:

1. **Per-skill isolation.** Every skill is a self-contained folder under `skills/`. Copy it out, and it still works.
2. **Future-proof, not over-engineered.** pnpm workspaces today; Turborepo, Changesets, and release machinery are documented as upgrade paths, not pre-installed.
3. **Useful for humans and agents.** Each skill declares its own purpose, scope, allowed tools, forbidden behaviours, and examples — both for human contributors and for AI agents discovering skills at runtime.

## What is a skill?

A skill is a self-contained capability that can be loaded by Claude (or any AI agent that supports the [Agent Skills open standard](https://agentskills.io)). It lives in one folder and exposes itself through a single `SKILL.md` file with YAML frontmatter.

Read [`docs/skill-standards.md`](docs/skill-standards.md) for the full spec we follow.

## Repo layout

```
claude-skills/
├── skills/                    # All skills live here, one folder each
│   └── <skill-name>/
│       ├── SKILL.md           # Required — frontmatter + instructions
│       ├── README.md          # Human-readable intro
│       ├── CLAUDE.md          # Per-skill agent context
│       ├── package.json       # Skill metadata + scripts
│       ├── examples/          # Usage examples
│       ├── tests/             # Skill-specific tests
│       └── scripts/           # Skill-local helper scripts
├── templates/skill/           # Template for new skills
├── scripts/                   # Monorepo-wide tooling
│   ├── audit-skills.ts        # Bulk health check
│   ├── lint-skills.ts         # SKILL.md frontmatter validator
│   ├── generate-index.ts      # Generates root SKILLS.md
│   ├── check-contamination.ts # Detects cross-skill references
│   └── new-skill.ts           # Scaffolds a new skill from template
├── docs/                      # Repo documentation
├── .github/workflows/         # CI
├── package.json               # Root workspace
├── pnpm-workspace.yaml        # Workspace definition
├── CONVENTIONS.md             # Contributor rules (humans + AI)
└── CLAUDE.md                  # Root agent constitution
```

## Quick start

```bash
# Install once
pnpm install

# Scaffold a new skill
pnpm new my-new-skill

# Run health checks across all skills
pnpm check         # lint + audit + contamination
pnpm lint          # SKILL.md frontmatter only
pnpm health        # Aggregate health report (not to be confused with `pnpm audit`, which is the built-in vulnerability scanner)
pnpm contamination # Cross-skill reference detector

# Regenerate the skill index
pnpm index

# Run all skill tests
pnpm test
```

## Adding a new skill

See [`docs/adding-a-skill.md`](docs/adding-a-skill.md) for the full checklist. Short version:

1. `pnpm new <kebab-case-name>` — copies the template
2. Edit `skills/<name>/SKILL.md` — write a routing-quality `description`
3. Edit `skills/<name>/README.md` — write the human intro
4. `pnpm check` — verify
5. Open a PR

## Portability

Every skill is independently copyable. To extract one skill into its own repo:

```bash
cp -r skills/<name> /path/to/new-repo/
```

The skill's `SKILL.md`, `README.md`, `CLAUDE.md`, and `package.json` are self-contained. No imports cross folder boundaries — that's enforced by `check-contamination.ts`.

## Tooling philosophy

We deliberately ship with **pnpm workspaces only**. No Turborepo. No Changesets. No release automation. See [`docs/tooling.md`](docs/tooling.md) for why and when to add them.

## Contributing

Read [`CONTRIBUTING.md`](CONTRIBUTING.md) and [`CONVENTIONS.md`](CONVENTIONS.md) before opening a PR.

## License

MIT. See [`LICENSE`](LICENSE).
