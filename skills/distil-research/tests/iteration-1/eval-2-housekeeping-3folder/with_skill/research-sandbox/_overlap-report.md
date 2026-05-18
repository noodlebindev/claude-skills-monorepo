# Research housekeeping — 2026-05-16

## Topics inventoried (3)

| Topic | File count | Notes |
|---|---|---|
| agent commerce | 8 | All markdown, deep-research style. Domain: building shopping agents + agent micropayments. |
| Google Gemini | 5 | All markdown. Covers two distinct products (Gemini CLI Subagents, Deep Research API). |
| CLAUDE CO WORK | 5 | All markdown. Single product focus (Claude Cowork desktop tool). |

## Grades

| Topic | Grade | Justification |
|---|---|---|
| agent commerce | **B** | 4 of 8 files are tier-1/2 signal; the other 4 are restatement of consensus. Topic is coherent. Two sub-lanes exist (shopping agents, micropayments SaaS) but both are commerce-adjacent — single folder defensible. |
| Google Gemini | **B** | 2 of 5 files are dense playbook-quality; 3 of 5 are low-value (release notes go stale, one duplicate of another, one is generic embedding 101). Risk: covers two distinct products (CLI Subagents + Deep Research API). Splitting into separate folders is the natural next step if either grows. |
| CLAUDE CO WORK | **C+** | High-signal content concentrated in the 17-tips files but with substantial internal duplication. Multiple files appear to research-and-rewrite the same source post. A topic-mode distil pass here would yield significant compression and likely move 2–3 files to `_archive/` as duplicates. |

## Cross-topic overlap detected

**Apparent filename overlap that is NOT real content overlap:**

- `CLAUDE CO WORK/I came accross this post . Please can you extract.md` (about Claude Cowork — Jesse Pujji write-up on the desktop agentic tool)
- `Google Gemini/I came accross this post . Please can you extract.md` (about Gemini CLI subagents — terminal multi-agent system)

These share the same Perplexity-prompt filename (a phrase the user types when seeding research) but reference different posts about different products. **No action required.** This pattern is likely to recur — the user's "extract from a post" prompt produces collision-prone filenames. Note for a future workflow improvement: ChatGPT/Perplexity exports could be renamed at save-time by topic+date.

**Genuine cross-topic overlap:** None detected. Each folder is topically coherent and correctly located.

**Conceptual adjacency (not overlap):** The Google Gemini and CLAUDE CO WORK folders both cover agentic CLI/desktop tools with subagents, skills, and context-file patterns. Concepts transfer (e.g., the MANIFEST.md three-tier context pattern from Cowork applies conceptually to Gemini's GEMINI.md). This is intentional shared vocabulary across two competing products — not a misfile.

## Auto-actioned moves (confidence ≥ 95%, target topic exists, file not in any playbook)

**None.** No file meets the threshold. Every file is in its correct topic folder. The skill defaults to proposing rather than actioning; in this run there is nothing to propose either.

## Proposed moves — awaiting confirmation

**None for this run.** All files are correctly placed.

## Recommendations (not file moves — these are next-action suggestions for you)

1. **Run topic-mode distillation on CLAUDE CO WORK.** It is the highest-internal-duplication folder. A topic-mode pass should archive 2–3 redundant files and produce a tight playbook combining the strongest tips from the 17-tips and "top tips" files.
2. **Consider splitting Google Gemini into two topic folders** at the next major addition: `Google Gemini/Gemini CLI Subagents/` and `Google Gemini/Deep Research API/`. The playbook produced from topic-mode already separates them as Part 1 / Part 2 — that's a natural fork point.
3. **Consider a filename-normalisation pre-pass.** Several files in your Research folder use the literal Perplexity-prompt phrase ("I came accross this post...") as the filename. A future skill iteration could auto-rename at distillation time using a topic+date convention (e.g., `claude-cowork-jesse-pujji-2026-03.md`). This would also eliminate the false-positive overlap signal flagged above.

## Low-confidence judgement calls

1. **CLAUDE CO WORK grade (C+ vs B).** Content is high-signal where it isn't duplicated. Grade reflects the duplication, not the topic value. If duplication is acceptable as a writing-process artefact rather than a knowledge-base issue, the grade would be B. Confidence: medium.
2. **Treating Google Gemini's two-product mix as "B, consider splitting later" rather than proposing an immediate move.** The skill's housekeeping rules say propose-but-don't-act for non-obvious moves. Splitting an existing folder is structural — recommended, but not auto-actioned. Confidence: high.
3. **Not flagging the "I came accross this post" filename collision as overlap.** The two files have the same filename pattern but different content. Reported as a cross-topic *finding* rather than a cross-topic *overlap*. Confidence: high (verified by reading both files).
4. **agent commerce grade (B).** Could justify B+ given that the kept playbook is genuinely strong; pulled to B because file-level signal density is exactly 50%. Confidence: medium.

## Self-assessment

Sharp and actionable. The conservative defaults paid off — zero auto-moves on a corpus where every file is correctly placed is the right answer, not a deficiency. The valuable output is the grades + the topic-mode recommendation for CLAUDE CO WORK + the proposed split signal for Google Gemini + the filename-normalisation observation. Each of those is a concrete next step the user can act on this week.
