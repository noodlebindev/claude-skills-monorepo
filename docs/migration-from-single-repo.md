# Migrating skills from single-skill repos

If you have a skill that currently lives in its own GitHub repo (or as a folder in another project) and want to bring it into this monorepo, follow this guide.

## When to migrate vs. keep separate

**Migrate when:**

- You maintain 3+ skills and version drift between them is becoming annoying
- You want shared linting / audit / index tooling
- Contributors get confused by which repo to file an issue against
- You want a single discoverability surface (the root `SKILLS.md`)

**Keep separate when:**

- The skill has a significant code surface beyond markdown (e.g., a CLI, a server)
- The skill has its own paying users who pin to versions
- The skill has a different license than this repo
- The skill has unrelated maintainers

## Migration steps

### 1. Audit the source repo first

Before copying anything in, check the source skill for things that don't belong:

- [ ] Hardcoded user paths (`/Users/yourname/...`) → replace with placeholders
- [ ] Hardcoded URLs to your personal infrastructure → replace or remove
- [ ] Secret-looking strings in examples → scrub
- [ ] CI workflows that referenced the source repo's name → drop, we'll regenerate
- [ ] `.git/` history (sensitive?) → decide whether to import history or start clean

### 2. Decide on history preservation

**Option A — clean copy (recommended for most cases):**

```bash
cd ~/Dev/claude-skills
pnpm new <skill-name>          # scaffolds skills/<skill-name>/
# Then copy the source skill's contents over the scaffold
cp -r /path/to/old-repo/* skills/<skill-name>/
# Then reconcile differences with the scaffolded template
```

You lose git history but get a clean integration. PR description should link the original repo for archaeology.

**Option B — preserve history (for skills with meaningful past PR discussion):**

```bash
cd ~/Dev/claude-skills
git remote add temp-source /path/to/old-repo
git fetch temp-source
git merge --allow-unrelated-histories temp-source/main
# Then move files into skills/<skill-name>/ in a follow-up commit
git remote remove temp-source
```

Heavier, but the `git log --follow skills/<skill-name>/SKILL.md` history is intact.

### 3. Reconcile the skill structure

Take the scaffold and merge in the migrated skill:

- [ ] `SKILL.md` — keep the frontmatter from the scaffold, body from the source. Verify `name` matches the new folder.
- [ ] `README.md` — adapt for the monorepo context. Remove install instructions that referenced the old standalone repo.
- [ ] `CLAUDE.md` — add per-skill context if any
- [ ] `package.json` — set `name` to `@claude-skills/<skill-name>`. Bring over any real dependencies, drop devDependencies that the root now provides (TypeScript, tsx, etc.).
- [ ] `examples/`, `tests/`, `scripts/` — move from source as-is

### 4. Remove cross-skill assumptions

Check the source skill for any assumption it lived alone:

- [ ] No top-level `LICENSE` — repo-level LICENSE covers all skills (unless the skill needs a different one)
- [ ] No top-level `CONTRIBUTING.md` — repo-level version applies
- [ ] No top-level CI workflow — replaced by `.github/workflows/ci.yml` at repo root
- [ ] No git submodules or workspace references to other skills (would be contamination)

### 5. Run checks

```bash
pnpm install
pnpm check
```

Fix anything that fails. Common failures during migration:

- Description over 1024 chars → trim
- Hardcoded paths → replace
- Old npm package name still in `package.json` → update
- Body over 500 lines → split into `references/`

### 6. Update the index

```bash
pnpm index
git add SKILLS.md
```

### 7. Archive the source repo

After migration is merged:

- Add a `README.md` to the source repo saying "This skill has moved to `https://github.com/<owner>/claude-skills/tree/main/skills/<skill-name>`"
- Pin that README on GitHub
- Archive the source repo (Settings → Archive this repository)
- Keep it findable but read-only

If the source had open issues, either:
- Close them with a link to the new repo, or
- Manually copy the actionable ones over as new issues here

### 8. Update consumers

If anyone has the source skill installed:

- Post in your usual channels (Discord, Twitter/X, mailing list) with the new install path
- Optionally publish a final version of the source repo with a deprecation notice in the SKILL.md body

## Reverse migration (extracting a skill back out)

If a skill outgrows the monorepo, extract it cleanly:

```bash
# 1. Copy the skill out
cp -r skills/<name> /path/to/new-standalone-repo/

# 2. Re-add the standalone repo's own LICENSE, README, CONTRIBUTING

# 3. Update package.json: remove @claude-skills/ scope or change it

# 4. Remove the skill from this repo
git rm -r skills/<name>
pnpm index
git commit -m "Extract <name> to its own repo"

# 5. Update root SKILLS.md to link to the new location instead
```

The skill remains in this repo's history; only the working tree changes.

## What you should never do

- **Do not** symlink between this repo and the source repo. It breaks portability and confuses everyone.
- **Do not** keep both copies live for "a transition period". Cut clean and update the source's README to point here.
- **Do not** migrate multiple skills in one PR — one skill per PR keeps review tractable.
