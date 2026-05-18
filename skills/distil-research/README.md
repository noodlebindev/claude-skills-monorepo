# distil-research

> A Claude Code skill that turns messy AI research folders into a clean, compounding knowledge base.

You run deep research on Perplexity, ChatGPT, or xAI. The files pile up in `~/Research/<topic>/`. After three months, the folder is a graveyard you never reopen.

**`distil-research` turns the graveyard into a re-readable asset that compounds with every new file you add.**

---

## What it does, visually

```
   BEFORE                                AFTER
   ────────                              ────────

   ~/Research/<topic>/                   ~/Research/<topic>/
   ├─ I came accross this post...md      ├─ _sources/      ← canonical kept files
   ├─ How to do X for Y...md             ├─ _distilled/
   ├─ Common errors when doing...md      │  ├─ playbook.md      ← operator reference
   ├─ Examples of the best Z...md        │  └─ manifest.json    ← audit trail
   ├─ Patterns for building W...md       ├─ _archive/      ← low-signal / superseded
   ├─ ... 34 more files                  └─ _quarantine/   ← ambiguous (needs review)

   (you never re-open this)              (you re-open the playbook weekly)
```

The top level after a run holds **only the four `_` folders**. New research drops into the top level and gets routed on the next run.

---

## Who this is for

Anyone whose AI-research output ends up as a folder of files they never re-open.

You run deep research on Perplexity, ChatGPT, xAI, or any other deep-research tool. The exports pile up. Naming is whatever prompt you typed. Information overlaps across files. You can't tell what you've already covered, so you re-research things you already researched.

If that's you: this skill turns the pile into a single playbook you actually re-read — operator-first, dense, scannable.

---

## What it's useful for

- **Tactical content research** — hook formulas, formatting patterns, growth wedges
- **Industry / domain research** — what's true now in a fast-moving space (algorithms, regulations, tooling)
- **Tooling evaluation** — which library/platform to pick, with the trade-offs surfaced
- **Build research** — collecting the patterns you'll use to build a system
- **Topic exploration that has matured** — you've done the reading; now you want the playbook

What it's **not** for:

- One-off research where you have 2-3 files and just want a summary
- Pure narrative topics (history, ethnography) — operator-first format is built for tactical content
- Internal company knowledge bases (a wiki tool will serve you better)

---

## The compounding part, made explicit

Every run is **incremental**. New files dropped into the topic folder get processed; existing classifications are preserved. The playbook grows tighter over time:

- New file adds a unique tactic → playbook gains a section
- New file restates something already in the playbook → file archived, playbook unchanged
- New file contradicts the playbook → flagged, you decide which version wins

After 6 months and 80 source files, the playbook might still be 5 KB — because most files repeat ideas, and the strict keep gate prevents bloat.

---

## How it works

Two modes, auto-detected from the path you point it at:

### Topic mode

Target a single topic folder. The skill:

1. Reads existing state (`_distilled/manifest.json` if present → incremental run)
2. Hashes every file; processes only new / changed ones
3. Parses files into sections; applies a four-tier filter
4. Runs a strict keep gate (unique tactic / non-overlapping framework / materially better version)
5. Deduplicates across kept sections
6. Writes the playbook in operator-first format
7. Tests whether the playbook spans more than one operational job (proposes a split if yes)
8. Moves each source file to `_sources/`, `_archive/`, or `_quarantine/`
9. Updates the manifest

### Housekeeping mode

Target the parent `~/Research/` folder. The skill:

1. Inventories every topic subfolder
2. Detects cross-topic overlaps (same idea covered in two playbooks)
3. Grades each topic A–F with a confidence label
4. Proposes filename normalisations (never auto-renames)
5. Writes `~/Research/_overlap-report.md`

Full mechanics in [`SKILL.md`](SKILL.md). Manifest shape in [`references/manifest-schema.md`](references/manifest-schema.md).

---

## Two distinguishing principles

**Sections are the unit, not files.** A 30-page Perplexity export might have one excellent tactical paragraph buried in generic framing. The skill extracts the paragraph, archives the file. "This file has *something* useful" is not a reason to keep the whole file in your active set.

**Strict keep gate.** A section is kept only if it (a) provides a unique tactic, (b) introduces a non-overlapping mental model, or (c) is a materially better version of something already kept. Everything else gets discarded — even if it's "good content". This prevents the playbook from drifting back into a literature review.

---

## Install

This skill lives in the [`claude-skills`](../../) monorepo. To use it as a Claude Code skill:

```bash
# Copy this folder into your agent's skills directory
cp -r skills/distil-research ~/.claude/skills/
```

Then in any Claude Code session:

```
distil my research on ~/Research/<topic>
```

…or any of:

- `/distil research`
- `clean up my research folder`
- `organise my research`
- `build a playbook from my research`

---

## What the playbook looks like

Every section follows a scannable shape. A reader should know what to do in 15 seconds:

```
## <Section name>

**Rule:** <one-line action principle — verb-led, no hedging>
**Execution:** <concrete how-to — bullets or numbered steps>
**Example:** <a real example with values, names, or numbers>
**Edge cases:** <when this breaks or doesn't apply> (optional)
```

ASCII diagrams replace markdown tables (which don't render reliably across viewers). Example showing how relative impact is communicated in a playbook section:

```
Signal A (high-leverage interaction)    ████████████████████████  ~24× baseline
Signal B                                ██████████████████        ~15×
Signal C (gatekeeper)                   ███████████               high
Signal D                                ████████                  significant
Signal E                                ██                        marginal
Signal F                                █                         baseline
```

Strategic / reflective sections don't force the Rule / Execution / Example shape — they use bulleted observations to avoid feeling mechanical.

---

## Good at / not yet good at

**Good at:**

- Markdown exports from Perplexity, ChatGPT deep research, xAI
- Mixed-format folders (markdown + RTF + small PDFs)
- Topics with operator framing — workflows, tactics, build wedges, content strategies
- Any folder size — cluster sampling kicks in for >20-file folders

**Not yet good at:**

- Large PDF-only folders (text extraction is best-effort)
- Audio / video transcripts (treated as one section)
- Non-English content (untested)
- Pure narrative topics (history, ethnography) — operator-first format is built for tactical content

---

## Known limitations

- **Two-job test is judgement-based.** Small chance of false positives ("this should be one playbook") or false negatives ("split me!"). User confirmation required before any split.
- **Cluster sampling trades coverage for speed.** Recorded in `read_coverage`; outliers promoted to direct-read but the heuristic is imperfect.
- **Filename normalisation is propose-only.** Never auto-renames — protects against breaking links, scripts, manifests.
- **Tested primarily on solo-creator workflows** (one topic per folder, 5–50 files per topic). Team / shared folder behaviour untested.

---

## Contributing

This skill is part of the `claude-skills` monorepo. Read [`../../CONTRIBUTING.md`](../../CONTRIBUTING.md) and [`../../CONVENTIONS.md`](../../CONVENTIONS.md) before opening a PR.

To propose a behaviour change to this skill specifically, open a PR that modifies [`SKILL.md`](SKILL.md) and explains the rationale.

---

## License

MIT — see [`../../LICENSE`](../../LICENSE).
