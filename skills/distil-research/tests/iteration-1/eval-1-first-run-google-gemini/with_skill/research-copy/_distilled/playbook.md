# Gemini CLI Subagents + Deep Research API — Playbook

## TL;DR

Two distinct Gemini tools, both worth the time to master:

1. **Gemini CLI Subagents** turn the terminal from a single-threaded AI into a distributed intelligence system. The main agent delegates to specialists; intermediate noise stays isolated. The real unlock is **protecting the main context window from degradation** — not raw speed.
2. **Gemini Deep Research API** has underused parameters (`background=True`, `visualization="auto"`, `previous_interaction_id`, MCP hybrid search) that 3–5× throughput and quality if implemented this week.

---

## Part 1 — Gemini CLI Subagents

### How it works

Subagents are named tools. The main agent calls one, gets back only the final distilled result. Tool calls, raw output, and context churn stay inside the subagent's loop.

Each subagent has its own system prompt, whitelisted tool set, independent conversation history, and configurable model / temperature / max_turns / timeout_mins. **Subagents cannot call other subagents** — recursion prevented by design.

The `@` syntax forces a specific subagent: `@codebase_investigator <prompt>` bypasses routing.

### Built-in agents available now

- `@codebase_investigator` — reverse-engineering auth flows, dependency mapping, legacy code
- `@generalist` — multi-file refactors, high-volume test runs, anything flooding terminal output
- `@cli_help` — looking up Gemini CLI commands / config without leaving context
- `@browser_agent` (experimental) — form fills, scraping pricing tables, navigating UIs via accessibility tree

### The 5 highest-leverage moves today

**1. Treat main-thread context as expensive compute.** Any task producing >20 lines of output → prefix with `@generalist`. The subagent absorbs the noise; you get a clean summary. This silently fixes long-session degradation.

**2. Enable subagents + define your first custom agent.** In `settings.json`:
```json
{ "experimental": { "enableSubagents": true } }
```
Custom agent at `.gemini/agents/<name>.md`:
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
The `description` is the routing signal — the main agent uses it to decide when to hand off. Write it precisely.

**3. Use `.gemini/agents/` as a team knowledge repo.** Project-level agents commit to version control. A `pr-reviewer.md` with your lint rules, naming conventions, architectural constraints becomes a living standard. Encode once; apply automatically forever.

**4. Right-size model + tool whitelist per agent.**
- `flash-lite` for trivial formatting / transforms
- `flash` for well-defined low-ambiguity tasks (file read, grep, summarise)
- `pro` / `gemini-3-preview` for the orchestrator and complex-reasoning subagents

Whitelist only the tools the agent actually needs. A docs agent reading files: `tools: [read_file]`, not `tools: [*]`. Reduces side-effect surface, improves reliability.

**5. The three-layer architecture.**
- `GEMINI.md` → always-on project context (repo structure, conventions)
- `.gemini/agents/*.md` → specialists for recurring tasks
- `.gemini/skills/*.md` → procedural workflows, loaded only when triggered

Skills load on demand — the right place for complex but infrequent workflows (security audits, deployment runbooks, migrations). Don't pack everything into `GEMINI.md`; it bloats every session.

### Frontier moves — what almost nobody is doing yet

**Maestro-style fleet.** `maestro-gemini` (OSS) runs a 12-agent fleet (architect, coder, tester, debugger, security engineer, …) through a 4-phase workflow (Design → Plan → Execute → Complete) with parallel batch execution and a built-in code-review gate. Parallel batches = contiguous agent tool calls in a single turn; `MAESTRO_MAX_CONCURRENT` controls simultaneity. State persists to disk so workflows survive interruptions.

**Subagents in CI/CD.** Use `google-github-actions/run-gemini-cli`. The unlock isn't running Gemini in CI — it's running a **subagent-orchestrated pipeline**: PR-reviewer on every PR, security auditor on main merges, docs subagent for changelogs.

**Filesystem-as-state coordination.** Agents write structured state files to `.gemini/` subdirectories. PID tracking + sentinel-file completion detection coordinate without external DBs or process managers. Enables non-blocking orchestration in monorepos with parallel independent modules.

**Remote subagents via A2A protocol.** Configuration overhead: a URL in YAML frontmatter. Connect local Gemini to specialised cloud agents — code-analysis with prod log access, compliance with legal KB access, performance with observability stack.

**`git worktree` + container isolation** for parallel agents. Each agent gets its own worktree (separate branch + filesystem path) and a Docker / Dagger container. Agents make competing changes; you diff and merge deliberately. Turns a sequential workflow into a genuinely parallel one.

---

## Part 2 — Gemini Deep Research API

Different product. These parameters are documented but underused.

### Today (next 2 hours)

- **Background processing.** Replace synchronous calls with `background=True` + polling. Queue 5 tasks simultaneously. 30-min refactor; 3–5× faster batch workflows.
- **Auto-visualisation.** `visualization="auto"` + ask for specific charts in the prompt ("bar chart of market share by vendor"). Extract base64 PNGs from the response. No separate viz pipeline.
- **Tool customisation.** Stop using all-tools default. Financial research → `file_search` only. Market trends → `google_search` + `url_context`. Surgical selection reduces hallucinations + token waste.

### Next week (competitive edge)

- **Collaborative planning.** Set `collaborative_planning=True` to get a plan first → refine via `previous_interaction_id` → execute with `collaborative_planning=False`. Enables human-in-loop quality + stakeholder buy-in.
- **Multimodal grounding.** Attach internal PDFs/images/docs as context. Query goes from generic ("research AI chips") to proprietary ("research AI chip impact [attached: our_strategy.pdf]"). Anchors results to your actual situation.

### Frontier (almost nobody does these)

- **Real-time streaming + thought visibility.** `thinking_summaries="auto"` + SSE handling lets users see intermediate reasoning live. Requires reconnection logic.
- **Chained recursive research.** Use `previous_interaction_id` to build hierarchical research trees: Topic A → refine → Topic B1 → synthesise → Topic C. Build a state machine for research dependencies. Enables deep synthesis impossible with single-pass queries.
- **Hybrid public + private search.** Connect a custom MCP server to your internal DB. Route requests to `google_search` (external) + your MCP (internal) + `file_search` (docs) simultaneously. The agent synthesises all three. MCP setup is rare — that's the moat.
- **Batch research + meta-synthesis.** Fire 20 parallel research tasks on different aspects of a topic. Poll all. Run a final synthesis query over aggregated results. Macro insights impossible with single queries.
- **Dynamic tool gating.** Classifier maps research type → optimal tools. "Quantitative" → enable `code_execution`. "Proprietary" → MCP + file_search only. Upfront classification cost, big quality + cost win.

---

## The shift to internalise

Both tools reward early investment. Multi-agent setups build institutional knowledge late adopters can't easily replicate. Deep Research API setups (hybrid MCP, recursive chains, dynamic gating) compound similarly.

Move from **reactive** (asking the agent questions) to **declarative** (building agent infrastructure that runs your standards automatically). Every hour on a high-quality subagent definition today pays forward into every future session it fires correctly without being asked.
