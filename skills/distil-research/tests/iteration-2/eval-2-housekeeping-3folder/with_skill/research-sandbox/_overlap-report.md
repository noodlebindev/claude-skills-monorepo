# Research housekeeping — 2026-05-17

## 1. Topics inventoried

| Topic | File count | Notes |
|---|---|---|
| agent commerce | 8 | Deep-research style. Domain: shopping agents + agent micropayments. |
| Google Gemini | 5 | Covers two distinct products (Gemini CLI Subagents, Deep Research API). |
| CLAUDE CO WORK | 5 | Single product focus (Claude Cowork desktop tool). Heavy internal duplication. |

## 2. Grades

| Topic | Grade | Confidence | Justification |
|---|---|---|---|
| agent commerce | **B** | high | 4 of 8 files are tier-1/2 signal; rest restate consensus. Topic coherent with two sub-lanes (shopping agents, micropayments SaaS). |
| Google Gemini | **B** | high | 2 of 5 files dense playbook-quality; 3 of 5 low-value. Covers two distinct products — natural fork point at next major addition. |
| CLAUDE CO WORK | **C+** | medium | High-signal content concentrated in the 17-tips files but substantial internal duplication across the 5 files. Grade depends on whether duplication is treated as bloat (C+) or as research-process artefact (B). |

## 3. Cross-topic overlap detected

**Apparent (not real) — high confidence:**

Two files share the filename "I came accross this post . Please can you extract.md":
- `CLAUDE CO WORK/I came accross this post . Please can you extract.md` (about Claude Cowork — Jesse Pujji write-up)
- `Google Gemini/I came accross this post . Please can you extract.md` (about Gemini CLI subagents)

Verified by reading both: distinct content, correctly placed. Filename collision is a Perplexity-prompt-naming artefact, not a content overlap. Filename normalisation (section 6) addresses the root cause.

**Real overlaps across topics: none — high confidence.** Each topic is internally coherent and correctly located.

**Conceptual adjacencies (not overlaps) — high confidence.** Both Google Gemini and CLAUDE CO WORK cover agentic CLI/desktop tools with subagents, skills, and context-file patterns. Vocabulary transfers; products don't. Not a misfile.

## 4. Auto-actioned moves

**0 moves.** No file meets the threshold (≥95% confidence + clearly misfiled + not in any playbook). Every file is in its correct topic folder.

## 5. Proposed moves — awaiting confirmation

**0 moves.** Every file is correctly placed.

## 6. Filename normalisation suggestions

**Rule:** Propose only. Never auto-rename. Convention: `<topic-slug>-<source-or-author-or-key-term>-<YYYY-MM>.md`.

These suggestions address the root cause of the false-positive cross-topic collisions and make filenames scannable in directory listings.

### CLAUDE CO WORK/ — high-value rename targets

| Current | Proposed | Confidence |
|---|---|---|
| `I came accross this post . Please can you extract.md` | `cowork-jesse-pujji-setup-2026-03.md` | high |
| `came accross this post . Please can you extract th.md` | `cowork-power-user-tips-extracted-2026-03.md` | medium (need to read further to verify exact subject) |
| `please research these tips and update the top tips.md` | `cowork-17-best-practices-nav-toor-2026-03.md` | high |
| `someone just posted the top tips for using claude.md` | `cowork-top-tips-research-pass-2026-03.md` | medium |
| `[https___x.com_witcheer_status_2027759832523051263.md` | `cowork-x-witcheer-thread-2026-03.md` | high (URL pattern is the source) |

### Google Gemini/ — selective renames

| Current | Proposed | Confidence |
|---|---|---|
| `I came accross this post . Please can you extract.md` | `gemini-cli-subagents-extracted-2026-03.md` | high |
| `please explain teh usecases with embed?.md` | `gemini-embedding-2-use-cases-2026-03.md` | high |
| `Here is Gemini CLI's March 18th weekly update for.md` | `gemini-cli-v0-34-0-release-notes-2026-03.md` | high (already in archive — low priority) |

### agent commerce/ — minor cleanup

| Current | Proposed | Confidence |
|---|---|---|
| `I'm a product leader and want to know what to buil.md` | `agent-commerce-primitives-roadmap-scorecard-2026-04.md` | medium |
| `"We're still going to be influenced by the people.md` | `agent-commerce-10-claude-sdk-wedge-ideas-2026-04.md` | high |
| `What are top use cases for AI agents in retail 202.md` | `retail-agent-use-cases-overview-2026-04.md` | medium (already in archive — low priority) |
| `What does this mean for agent-agent commerce in 20.md` | `agent-agent-commerce-2026-2030-outlook.md` | medium (already in archive — low priority) |

Other files in agent commerce/ (Alibaba article, "Examples of AI personal shoppers", "What data and systems do retail AI agents need to", "Steps to launch a SaaS tool monetized by agent mic") have filenames that already convey their content reasonably — lower priority to rename.

## 7. Recommendations (non-move next steps)

| Recommendation | Confidence | Why |
|---|---|---|
| Run topic-mode distil on CLAUDE CO WORK | high | Highest internal duplication of any topic — biggest compression win |
| Consider splitting Google Gemini on next major addition | high | Two distinct products in one folder; the playbook already separates them as Part 1 / Part 2 |
| Apply filename normalisation suggestions in section 6 | high | Eliminates the recurring "I came accross this post" false-positive collision; makes directory listings scannable |
| Update Perplexity/ChatGPT export workflow to use structured filenames at save-time | medium | Prevents the messy-filename problem at the source rather than cleaning up after the fact |

## 8. Low-confidence calls

1. **CLAUDE CO WORK grade C+ vs B.** Depends on whether internal duplication counts as bloat. C+ if treated as knowledge-base hygiene; B if treated as research process. Picked C+ to surface the issue. Confidence: medium.
2. **Some proposed filenames depend on reading the full file content.** A few suggestions are flagged with medium confidence because they were based on partial reads. The user should sanity-check the proposed names against the file content before applying. Confidence: medium.
3. **Filename normalisation for files already in `_archive/`.** Lower priority because archived files won't be referenced often. Suggestions still surfaced for consistency, marked as low-priority renames. Confidence: high (about the priority); confidence on the rename suggestion itself follows the per-row label.

## Self-assessment

Sharper than iter 1. Iter-2 additions that improved the report:
- Confidence labels on every grade and recommendation give the user a clear "where can I trust this vs where should I double-check".
- Filename normalisation section turns the recurring filename-collision finding from iter 1 into an actionable list with specific proposed names.
- Same conservative zero-auto-move outcome as iter 1 — but now with explicit confidence labels that document *why* the conservatism is justified rather than just hiding behind defaults.
- Recommendations table includes a fourth, higher-leverage item: fix the messy-filename problem at the Perplexity/ChatGPT export step, not just at the housekeeping step.

A weaker housekeeping pass would: invent overlaps to look productive, give grades without confidence labels, or auto-rename "for clarity". This run does none of those.
