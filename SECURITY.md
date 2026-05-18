# Security Policy

## Reporting a vulnerability

If you discover a security issue in this repo or in any skill within it, **do not open a public GitHub issue.**

Instead, report it privately:

- Use [GitHub's private vulnerability reporting](https://docs.github.com/en/code-security/security-advisories/guidance-on-reporting-and-writing-information-about-vulnerabilities/privately-reporting-a-security-vulnerability) on this repository, **or**
- Email the maintainer listed in the repo's GitHub profile.

We'll acknowledge within 72 hours and aim to issue a fix or mitigation within 30 days for confirmed vulnerabilities.

## What counts as a security issue?

**In scope:**

- A skill exfiltrating data through its instructions (e.g., a SKILL.md that tells an agent to send conversation context to an external URL)
- A skill that bypasses its declared `allowed-tools` or `forbidden-behaviours`
- Hardcoded secrets, API keys, or tokens in any file
- A script in `scripts/` or `templates/` that executes untrusted input
- Prompt-injection patterns embedded in SKILL.md that target a user's other skills or system

**Out of scope:**

- General LLM hallucination behaviour
- A skill working as documented but producing incorrect output
- Disagreements about a skill's design

## Hardening the repo

Maintainers should periodically run:

```bash
pnpm contamination        # cross-skill references
pnpm health               # aggregate health check (includes secret-pattern scan)
pnpm dlx gitleaks detect  # secret scan
```

## Supply chain

- All third-party dependencies are pinned via `pnpm-lock.yaml`.
- We do not auto-update dependencies. Renovate/Dependabot configs are intentionally absent until a maintainer is willing to triage them.
- Pre-publish: `pnpm dlx publint` and manual review of any package being published.

## Skills and prompt injection

A skill is, in effect, a piece of prompt content that an LLM treats as instructions. Treat every SKILL.md from an untrusted source as you would treat any other piece of executable code. Review before installing into your agent.
