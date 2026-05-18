# Gemini CLI Subagents + Deep Research API — Playbook

## TL;DR

1. Subagents in Gemini CLI protect your main-thread context from degradation. Delegating high-output tasks isn't about speed — it's about cognitive clarity.
2. Deep Research API has 8+ underused parameters (`background=True`, `visualization="auto"`, `previous_interaction_id`, MCP hybrid search) that 3–5× throughput and quality this week.

---

## Part 1 — Gemini CLI Subagents

### How it works

**Rule:** Subagents are named tools the main agent calls. Only the final result returns to the main thread; intermediate tool calls and noise stay isolated.

**Execution:** Each subagent has its own system prompt, whitelisted tool set, independent conversation history, configurable model / temperature / max_turns / timeout_mins. Subagents cannot call other subagents (recursion prevented).

**Example:** Type `@codebase_investigator <prompt>` to bypass routing and go straight to the specialist.

### Built-in agents

- `@codebase_investigator` — auth flow reverse-engineering, dependency mapping, legacy code
- `@generalist` — multi-file refactors, high-volume test runs, anything flooding terminal output
- `@cli_help` — looking up Gemini CLI commands without leaving context
- `@browser_agent` (experimental) — form fills, scraping pricing tables via accessibility tree

### Move 1 — Protect main-thread context

**Rule:** Any task producing >20 lines of output → prefix with `@generalist`.

**Execution:** Subagent absorbs the noise; you get a clean summary. Silently fixes long-session degradation.

**Example:** `@generalist run the full test suite and report failures` instead of `npm test`.

### Move 2 — Enable subagents + define your first custom agent

**Rule:** `settings.json` gets the toggle; `.gemini/agents/<name>.md` gets the agent definition.

**Execution:**
```json
{ "experimental": { "enableSubagents": true } }
```
```yaml
---
name: sql-expert
description: For all DB tasks — schema, query optimisation, migrations.
model: gemini-2.0-flash-thinking-exp
tools: [run_shell_command, read_file]
---
You are an expert SQL DBA. Always explain query performance.
Prefer CTEs over subqueries. Enforce index usage analysis.
```

**Edge case:** The `description` field is the routing signal — the main agent uses it to decide when to hand off. Vague descriptions = wrong agent fires.

### Move 3 — Treat `.gemini/agents/` as a team knowledge repo

**Rule:** Commit project-level agents to version control. Standards apply automatically forever.

**Example:** `pr-reviewer.md` with your lint rules + naming conventions + architectural constraints fires on every PR-related session for the whole team.

### Move 4 — Right-size model + tool whitelist per agent

**Rule:** Don't use `pro` for everything. Don't grant `tools: [*]` to anything.

**Execution:**
- `flash-lite` → trivial formatting / transforms
- `flash` → well-defined low-ambiguity tasks (file read, grep, summarise)
- `pro` / `gemini-3-preview` → orchestrator + complex reasoning subagents

Whitelist only the tools the agent actually needs. Docs agent reading files → `tools: [read_file]`.

### Move 5 — Three-layer architecture

**Rule:** Distinct uses, distinct files.

**Execution:**
- `GEMINI.md` → always-on project context (repo structure, conventions)
- `.gemini/agents/*.md` → specialists for recurring tasks
- `.gemini/skills/*.md` → procedural workflows, loaded only when triggered

**Edge case:** Don't pack everything into `GEMINI.md` — it bloats every session.

### Frontier — what almost nobody is doing yet

- **Maestro-style fleet.** `maestro-gemini` (OSS): 12-agent fleet (architect, coder, tester, debugger, security…) running Design → Plan → Execute → Complete with parallel batches and a built-in code-review gate. `MAESTRO_MAX_CONCURRENT` controls simultaneity. State persists to disk.
- **Subagents in CI/CD.** `google-github-actions/run-gemini-cli`. PR-reviewer on every PR, security auditor on main merges, docs subagent for changelogs.
- **Filesystem-as-state coordination.** Agents write structured state files to `.gemini/` subdirectories; PID tracking + sentinel files coordinate without external DBs. Non-blocking orchestration in monorepos.
- **Remote subagents via A2A protocol.** URL in YAML frontmatter. Connect local Gemini to specialised cloud agents — prod log access, compliance KB, observability stack.
- **`git worktree` + container isolation** for parallel agents. Each gets its own branch + filesystem + Docker/Dagger container. Agents make competing changes; you diff and merge deliberately.

---

## Part 2 — Gemini Deep Research API

### Today (next 2 hours)

**Rule:** Three parameter changes that compound across every research call.

**Execution:**
- **`background=True` + polling** → queue 5 tasks simultaneously instead of waiting on one. 30-min refactor; 3–5× faster batch workflows.
- **`visualization="auto"`** + ask for specific charts ("bar chart of market share by vendor") → extract base64 PNGs from response. No separate viz pipeline.
- **Tool customisation** → stop using all-tools default. Financial research → `file_search` only. Market trends → `google_search` + `url_context`. Surgical selection cuts hallucinations + token waste.

### Next week — competitive edge

- **`collaborative_planning=True`** → get a plan first, refine via `previous_interaction_id`, then execute with `collaborative_planning=False`. Enables human-in-loop quality + stakeholder buy-in.
- **Multimodal grounding** → attach internal PDFs/images/docs as context. Query goes from "research AI chips" to "research AI chip impact [attached: our_strategy.pdf]". Anchors results to your situation.

### Frontier — almost nobody does these

- **Real-time streaming + thought visibility.** `thinking_summaries="auto"` + SSE → users see intermediate reasoning live. Requires reconnection logic.
- **Chained recursive research.** `previous_interaction_id` builds hierarchical research trees: Topic A → refine → Topic B1 → synthesise → Topic C. Needs a state machine for dependencies. Enables deep synthesis impossible with single-pass.
- **Hybrid public + private search.** Custom MCP server to internal DB. Route to `google_search` + your MCP + `file_search` simultaneously. Agent synthesises all three. MCP setup is rare — that's the moat.
- **Batch + meta-synthesis.** Fire 20 parallel research tasks on different aspects → final synthesis query over aggregated results. Macro insights impossible with single queries.
- **Dynamic tool gating.** Classifier maps research type → optimal tools. "Quantitative" → enable `code_execution`. "Proprietary" → MCP + file_search only.

---

## The shift to internalise

**Rule:** Both tools reward early investment. Move from reactive (asking the agent questions) to declarative (building agent infrastructure that runs your standards automatically).

**Why:** Multi-agent setups build institutional knowledge late adopters can't easily replicate. Deep Research API setups (hybrid MCP, recursive chains, dynamic gating) compound the same way.

**Action:** Every hour on a high-quality subagent definition today pays forward into every future session it fires correctly without being asked.
