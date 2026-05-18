# Adding a new skill — checklist

This is the canonical checklist. If `pnpm check` passes and every box below is ticked, the skill is ready for a PR.

## 0. Decide whether this should be a skill at all

A skill earns its place if:

- It encodes a repeatable workflow or playbook
- It has a clear, namable trigger ("when the user asks to X")
- It would otherwise live as a copy-pasted prompt or scattered notes

If it's a one-off prompt, don't create a skill. Just write the prompt.

## 1. Scaffold

```bash
pnpm new <kebab-case-skill-name>
```

This:

1. Copies `templates/skill/` into `skills/<name>/`
2. Replaces `{{SKILL_NAME}}` placeholders in `SKILL.md`, `README.md`, `CLAUDE.md`, `package.json`
3. Initializes `examples/`, `tests/`, `scripts/` as empty folders with `.gitkeep`

## 2. Edit SKILL.md

**Frontmatter:**

- [ ] `name` matches the folder name exactly
- [ ] `description` is a routing-quality trigger sentence (see [`skill-standards.md`](skill-standards.md#writing-a-routing-quality-description))
- [ ] `description` is under 1024 characters (aim for 100–400)
- [ ] `license` is set (defaults to `MIT`)
- [ ] `allowed-tools` lists what tools this skill will use (or omit if unrestricted)
- [ ] `forbidden-behaviours` lists explicit "do nots"

**Body:**

- [ ] Under 500 lines (move long material to `references/`)
- [ ] States the trigger conditions in the first paragraph
- [ ] Provides step-by-step instructions for the agent
- [ ] Includes at least one worked example inline (longer examples go in `examples/`)
- [ ] Ends with a "When NOT to use this skill" section

## 3. Edit README.md

- [ ] One-line tagline at the top
- [ ] "What it does" — for humans, not agents
- [ ] "Usage" — how to install and invoke
- [ ] "Examples" — link into `examples/`
- [ ] "Limitations / when not to use"
- [ ] "License" line

## 4. Edit CLAUDE.md (per-skill)

- [ ] Notes specific to working on this skill (testing approach, expected outputs, gotchas)
- [ ] Any deviation from root `CONVENTIONS.md` (rare)

## 5. Edit package.json

- [ ] `name` is `@claude-skills/<skill-name>` (matching folder)
- [ ] `version` is `0.1.0` for new skills
- [ ] `description` matches the SKILL.md description
- [ ] `license` is `MIT` (or whatever you declared in SKILL.md)
- [ ] `keywords` includes `claude-skill` and 2–5 topic tags

## 6. Add examples

- [ ] At least one example file in `examples/`
- [ ] Each example shows: input the user gives, output the skill produces
- [ ] Include one "edge case" example if the skill has non-obvious behaviour

## 7. Add tests (encouraged, not required)

- [ ] At minimum a snapshot of the SKILL.md frontmatter for regression detection
- [ ] If the skill has a script, test the script
- [ ] Wire up `test` in `package.json` so `pnpm test` finds it

## 8. Verify isolation

- [ ] No file in your skill references another skill's path
- [ ] No `import` or `require` reaching outside `skills/<your-skill>/`
- [ ] Skill works if copied out: imagine `cp -r skills/<your-skill> /elsewhere/` — does it stand alone?
- [ ] If you legitimately depend on another skill, declare it in `metadata.linked-skills`

## 9. Run checks

```bash
pnpm check
```

This runs:

- `pnpm lint` — frontmatter validation
- `pnpm health` — aggregate health check (secrets, paths, junk files, size limits)
- `pnpm contamination` — cross-skill references

Every check must pass.

## 10. Update the index

```bash
pnpm index
```

This regenerates the root `SKILLS.md` file with the new skill's `name` and `description`. Commit the updated index.

## 11. Update root CHANGELOG.md (only if repo-wide change)

The root `CHANGELOG.md` tracks **repo-level** changes — tooling, conventions, scripts. Adding a new skill is **not** a root changelog entry. Mention it in the PR description instead.

## 12. Open PR

- [ ] One skill per PR (do not bundle multiple new skills)
- [ ] PR description includes: what the skill does, its trigger, why it's needed
- [ ] PR description includes the output of `pnpm check`
- [ ] Reviewer assigned

## Common failure modes

| Symptom | Fix |
|---|---|
| `pnpm lint` says "name must match folder" | Rename folder or fix `name` in SKILL.md |
| `pnpm health` flags hardcoded path | Replace `/Users/me/...` with placeholder like `<your-project>` |
| `pnpm contamination` flags a reference | Either remove the cross-skill reference or add it to `metadata.linked-skills` |
| Description is over 1024 chars | Trim it to a routing trigger; move detail into the body |
| Body is over 500 lines | Move detail into `references/<topic>.md` |
