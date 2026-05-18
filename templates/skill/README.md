# {{SKILL_NAME}}

> <One-line tagline. What does this skill do, in plain English, for a human deciding whether to install it.>

## What it does

<Two or three sentences. Audience: a developer scanning GitHub. Not the agent.>

## Install

This skill is part of the [`claude-skills`](../../) monorepo. To install it standalone:

```bash
# Copy this folder into your agent's skills directory
cp -r skills/{{SKILL_NAME}} ~/.claude/skills/
```

Or pull just this skill via sparse checkout — see [`docs/publishing.md`](../../docs/publishing.md).

## Usage

<How a user invokes this skill. Realistic prompts they'd type.>

```
> <example user prompt>
```

The agent will then <what happens>.

## Examples

See [`examples/`](examples/) for worked scenarios:

- `examples/<scenario>.md` — <what it demonstrates>

## When not to use this

<Limitations. Adjacent problems this skill is NOT for.>

- <Limitation 1>
- <Limitation 2>

## Configuration

<If the skill accepts any configuration — frontmatter fields, env vars, files. Otherwise: "No configuration required.">

## License

MIT — see [`../../LICENSE`](../../LICENSE).

## Contributing

See [`../../CONTRIBUTING.md`](../../CONTRIBUTING.md) and [`../../CONVENTIONS.md`](../../CONVENTIONS.md).
