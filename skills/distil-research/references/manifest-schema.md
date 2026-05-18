# Manifest schema

Reference for `_distilled/manifest.json`. The skill writes one of these per topic folder after every run.

Loaded on demand — the SKILL.md body links here from Steps 3.5, 3.6, 7, and 9.

## Single playbook (default)

```json
{
  "topic": "<topic-slug>",
  "last_run": "2026-05-16T...",
  "run_mode": "incremental",
  "playbook_size_bytes": 5421,
  "read_coverage": null,
  "hallucination_warnings": [],
  "files": [
    {
      "path": "_sources/perplexity-2026-04-12.md",
      "hash": "sha256:...",
      "processed_at": "...",
      "verdict": "partial",
      "contribution_type": "partial_extract",
      "reason": "one tactical section on attribution windows; rest was generic",
      "sections_kept": ["attribution-windows"],
      "sections_influenced_in_playbook": ["measurement"],
      "confidence": "high"
    }
  ],
  "playbook_sections": [...]
}
```

`playbook_size_bytes` is informational. There is no size cap — quality is enforced by the strict keep gate (SKILL Step 4) and the dedup pass (SKILL Step 5), and structural decisions are made by the two-job test (SKILL Step 7).

## Split playbooks (only when the two-job test passes and the user confirms)

```json
{
  "topic": "<topic-slug>",
  "last_run": "...",
  "run_mode": "first-run",
  "playbook_size_bytes": 25372,
  "playbooks": [
    {
      "file": "_distilled/playbook-<job-a-slug>.md",
      "size_bytes": 15160,
      "coverage": "<one-sentence description of operational Job A>",
      "sections": ["1", "2", "3", "..."]
    },
    {
      "file": "_distilled/playbook-<job-b-slug>.md",
      "size_bytes": 10212,
      "coverage": "<one-sentence description of operational Job B>",
      "sections": ["1", "..."]
    }
  ],
  "read_coverage": {...},
  "hallucination_warnings": [...],
  "files": [...],
  "playbook_sections": [...]
}
```

The top-level `playbook_size_bytes` is the sum across all playbook files.

## `read_coverage` shape

`null` when every file was directly read. Object form when cluster-sampling was used on a >20-file folder (SKILL Step 3.5):

```json
"read_coverage": {
  "directly_read": 12,
  "classified_by_pattern": 27,
  "total": 39,
  "clusters": [
    {
      "pattern": "How to X / Common errors in X / Examples of X (hook variants)",
      "size": 18,
      "sampled": 6
    },
    {
      "pattern": "Best A/B / formatting / sentence-length follow-ups",
      "size": 9,
      "sampled": 3
    }
  ]
}
```

## `hallucination_warnings` shape

Empty array when no suspect technical claims were filtered. Otherwise an array of `{file, concern, mitigation}` (SKILL Step 3.6):

```json
"hallucination_warnings": [
  {
    "file": "X algorhythm updates.rtf",
    "concern": "Phoenix algorithm internals (Grok transformer, xai-org GitHub repo, May 15 release) — not cross-verified against public docs",
    "mitigation": "Playbook §1 keeps only the operator-tactical signal weights that align with the 2024 public X algo release"
  }
]
```

## Top-level optional fields

- `playbooks` — array. Only present in split mode (two-job test passed, user confirmed). Each entry includes a `coverage` sentence naming the operational job that playbook serves.
- `read_coverage` — `null` if every file was directly read. Object as defined above if cluster mode was used.
- `hallucination_warnings` — empty array if no suspect technical claims were filtered. Array of objects as defined above otherwise.

## `contribution_type`

A semantic label per file, complementing `verdict`:

- `canonical_source` — primary source for one or more playbook sections; few or no losses
- `supporting_signal` — reinforces points sourced primarily from other files; adds evidence or examples
- `partial_extract` — some sections are gold, rest is noise; file stays in active set if any section was kept, else moves
- `superseded_duplicate` — content fully duplicated by another kept file
- `low_signal` — generic / consensus restatement / no tier-1/2/3 content
- `ambiguous` — mixed; quarantined for review

`verdict` answers "what did we do with the file"; `contribution_type` answers "why, in semantic terms". The pair makes the decision auditable.

## `verdict` values

- `kept` — full canonical reference; file moves to `_sources/`
- `partial` — some sections extracted; file moves to `_sources/` or `_archive/` based on partial-routing rule (SKILL Step 8)
- `archived` — low-signal as a whole; file moves to `_archive/`
- `quarantined` — ambiguous; file moves to `_quarantine/` for human review

## `confidence` values

- `high` — file was directly read in full
- `medium` — file was classified by cluster pattern, not directly read
- `low` — heuristic classification; flagged for re-review on next run
