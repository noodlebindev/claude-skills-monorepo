# Changelog

All notable changes to `distil-research`.

## [0.4.0] — 2026-05-17

### Changed
- **Replaced the tiered size guard with a two-job test.** Playbook size is no longer enforced. Quality is owned by the strict keep gate (Step 4) and dedup pass (Step 5). The skill proposes a split only when the playbook covers more than one distinct operational job (i.e., a user pursuing one job would skim past content for the other).
- Removed `playbook_size_justification` from the manifest schema. `playbook_size_bytes` remains as informational only.
- Split-mode manifest entries now use a `coverage` field (one sentence naming the operational job that playbook serves) instead of `tier`/`size_justification`.

## [0.3.0] — 2026-05-17

### Added
- **`_sources/` folder** for canonical kept files. Top level now holds only the four `_` folders after a run; new files dropped in at the top level get routed on next `/distil research`.
- **Strict keep gate hardening**: canonical-source rule (only one canonical per topical territory) and expertise-aware rejection (foundational content for the user's stated expertise area archived as `low_signal`).
- **Split-confirmation flow** for >1-job playbooks: skill recommends, user confirms, then writes split files. Documented manifest schema for both single and split modes.
- **Partial routing second test** (Step 8): `partial` verdict only goes to `_sources/` if what remains after extraction is itself worth re-reading; otherwise `_archive/` with sections still recorded.

## [0.2.0] — 2026-05-17

### Added
- **Large-corpus mode (Step 3.5)** with `read_coverage` manifest field for folders > 20 files. Cluster sampling with confidence calibration.
- **Hallucination handling (Step 3.6)** with `hallucination_warnings` manifest field. Operator-tactical content retained; uncross-verifiable technical claims discarded with audit trail.
- **No-tables rule + ASCII diagrams** for visual formatting. Markdown tables don't render reliably in all viewers — bullets, definition-style key/value lines, and YAML/JSON blocks instead. ASCII diagrams encouraged for architectures, hierarchies, ranking visualisations, sequences, and state machines.

## [0.1.0] — 2026-05-16

Initial public release. Core feature set:

- Two modes: topic mode (per-folder distil) and housekeeping mode (cross-topic across `~/Research/`)
- Section-level extraction (not file-level) with tier classification (1–4)
- Quarantine state for ambiguous content
- Manifest with `verdict`, `contribution_type`, `reason`, `sections_kept`, `sections_influenced_in_playbook`, `confidence` per file
- Anti-bloat playbook constraints
- Operator-first format (Rule / Execution / Example / Edge cases)
- Filename normalisation suggestions in housekeeping mode (proposal-only, never auto-rename)
- Conservative housekeeping defaults: zero auto-moves unless ≥95% confidence + clearly misfiled + not in any playbook
- Incremental vs `--rebuild` modes
- "Next best action" line in end-of-run summary
