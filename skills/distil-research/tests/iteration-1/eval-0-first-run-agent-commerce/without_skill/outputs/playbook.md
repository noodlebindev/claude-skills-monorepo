# Agent Commerce — Distilled Playbook
_Personal knowledge base for building AI shopping agents on Claude Agent SDK._
_Source: 8 deep-research files (Perplexity / ChatGPT) on agentic commerce, May 2026._

---

## TL;DR — three things to internalise

1. **Two customers, not one.** From now on, the customer is the human *and* the human's agent. Every catalog, checkout, and policy decision needs a machine-readable equivalent. "Agent-readiness" is the new SEO.
2. **Build for execution, not chat.** The defensible value sits in clean catalog + offer + action APIs + a consent/policy engine. Chat is the cheap part; structured data + permissioned actions are the moat.
3. **Wedge first, protocol later.** Start with one narrow, repeat, low-risk shopping job (consumables, gifts, comparison) — not a generic "AI shopper for everything". Protocol/SDK plays come after a working wedge.

---

## Market truths (no debate needed — appears in 5+ sources)

- China is 18–24 months ahead because Alibaba/Qwen/Alipay/Cainiao are one stack — intent → fulfilment → after-sales in one chat. Qwen + Taobao = full catalogue (4B SKUs), virtual try-on, 30-day price tracking, Alipay execution.
- Western agentic commerce will not look like that. It will look like protocols + integrations bridging OpenAI/Anthropic/Google + Amazon/Shopify/Stripe + retailers. Slower, messier, but bigger surface for tooling startups.
- Amazon is consolidating Alexa+Rufus into a unified shopping agent. Shopify is shipping Sidekick (merchant) + support agent + an agent-readable product protocol. Stripe shipped the Agentic Commerce Protocol + agent wallets.
- Consumer behaviour is already shifting: >50% of consumers in 2026 surveys are using generative AI for at least some product discovery instead of search.

## The "agent-ready commerce stack" (the only architecture diagram you need)

Five primitives, in order of dependency:

1. **Product truth layer** — one canonical product graph across PIM, search, pricing, inventory, reviews. Normalised attributes, variants, stock, price, promotions, delivery windows, returns terms, review summaries.
2. **Offer API** — exact landed cost, tax, fees, delivery promise, return policy, substitutions.
3. **Action API** — add to cart, reserve inventory, place order, modify order, return item, escalate to human. Idempotent. Deterministic.
4. **Consent and policy engine** — spending limits, allowed categories, approval thresholds, identity verification, audit logs.
5. **Agent memory** — user preferences, fit, brand exclusions, replenishment cadence, service history.

If a primitive is missing, the agent degrades to a chatbot.

## Minimum data stack for a shopping agent (use this as a build checklist)

1. Product catalog feed (machine-readable, normalised attributes).
2. Inventory feed (real-time, not "usually ships soon").
3. Pricing + promotions feed (API-exposed, not buried in marketing copy).
4. Fulfilment + returns policies (structured, per-SKU).
5. Customer preferences / session context.
6. API access to search, cart, checkout.
7. Logging + approval controls for risky actions.

A Claude shopping agent for shoes is useless without: size availability, current price, return policy, user's preferred brands. Anything less = generic chat.

---

## Build wedges — ranked by leverage for a solo/small team on Claude Agent SDK

Criteria: clear intent, repeat behaviour, low risk, measurable outcome.

### Tier 1 — start here
1. **Repeat-purchase / replenishment agent** (consumables, pet food, toiletries, coffee). Highest frequency, lowest risk, clearest ROI. Ideal for proving the loop.
2. **Comparison / value-optimiser agent** (high-consideration items: headphones, laptops, skincare). Targets "too many tabs" pain. Starts neutral, can layer affiliate later.
3. **Group-gifting / shared-cart agent.** Pure UX win — humans hate organising group gifts. Low competitive density.

### Tier 2 — once tier-1 has a paying loop
4. **Private "shop-for-you" agent with persistent taste profile.** Read receipts/style boards; refine over time. The personal-shopper-as-API.
5. **Sustainable/ethical filter agent.** Sharp differentiation; strong values-aligned willingness to pay; data work is hard but defensible.
6. **Voice-first home-restock agent** (WhatsApp / smart speaker / iOS Shortcut). High frequency, low friction.

### Tier 3 — platform plays (only if you have distribution)
7. **Merchant-side Sidekick clone for long-tail Shopify / Woo stores.** SaaS fee + transaction fee. Directly addresses Shopify's stated discovery problem.
8. **Agent-to-agent commerce protocol + reference impl.** Schemas for product queries, offers, checkout. Middleware, not app.
9. **White-label shopping-agent builder for merchants.** Recurring SaaS.
10. **"Agent squad" pop-up experiences** for fashion drops, influencer launches, etc.

Avoid as first wedge: complex fashion fit, expensive electronics, anything that punishes a single bad recommendation.

---

## Launching a SaaS monetised by agent micropayments (10-step recipe)

The other live monetisation lane: sell a paid API/workflow that agents discover, authorise, and consume autonomously.

1. **Pick a task agents already need.** Data lookup, document transformation, compliance checks, lead enrichment, summarisation-with-citations, code review, specialised retrieval.
2. **API-first, not UI-first.** Deterministic inputs, machine-readable outputs, predictable latency, idempotency, clear errors.
3. **Inline payment handshake.** Price → spend-cap auth → micropayment → result. Stripe ACP / agent wallets are now mainstream primitives.
4. **One pricing unit at launch.** Per call, per document, per 1k tokens, or per completed result.
5. **Agent discovery.** List on registries, marketplaces, MCP-compatible endpoints. If the agent can't find it, it can't pay you.
6. **Guardrails day one.** Per-session caps, rate limits, identity checks, audit logs.
7. **Unit economics that survive micropayments.** Low payment fees, low inference cost, value/call high enough that a few cents leaves margin.
8. **One integration path at launch.** One agent ecosystem (SDK, MCP tool, browser agent, or enterprise assistant). Fewer integrations = faster adoption.
9. **Instrument everything.** Requests, approvals, failures, retries, value delivered per transaction.
10. **Wedge then expand.** One indispensable repeated action first. Memory, comms, orchestration, compliance come after.

**The simple launch formula:** one API, one agent use case, one pricing unit, one wallet flow, one audit log.

Strong v1 candidates: "agent-grade research retrieval", "paid verification checks", "document conversion with guaranteed schema output".

---

## Roadmap (sequence by trust + technical dependency, not by AI novelty)

| Horizon | Ship | Why |
|---|---|---|
| 0–6 mo | Conversational discovery, guided comparison, price alerts, reorder flows, machine-readable catalog cleanup | Low-risk AI-on-top-of-existing-funnel; reduces search friction, improves conversion. No autonomy required. |
| 6–12 mo | Agent-facing APIs, cart assembly, identity/permission controls, structured delivery+returns | Foundation that lets internal or external agents transact reliably without browser scraping. |
| 12–24 mo | Autonomous replenishment, seller-agent negotiation, dynamic bundles, cross-merchant interop | Where agent-agent commerce starts redistributing value. |

---

## UX rules for human-facing surfaces

- Build **"shopping missions"** ("restock pantry under £80", "carry-on bag for 3-day trip") with editable constraints.
- Show agent reasoning as **structured tradeoffs** (price vs delivery vs rating), not long-form prose.
- **Approval modes:** always-ask | ask-above-threshold | auto-execute (per category).
- **Monitoring surfaces:** price watch, back-in-stock watch, warranty reminders, reorder suggestions, return-deadline alerts.
- Trust is built by **showing planned actions and confidence**, not by being articulate.

## Agent-readiness scorecard (track separately from conversion KPIs)

- Catalog completeness + attribute accuracy.
- % SKUs with machine-readable shipping + returns terms.
- Agent-completable checkout rate (no browser fallback).
- Assisted conversion, autonomous reorder rate, exception rate, post-purchase resolution time.

---

## Strategic implications worth keeping in mind

- **Front-end UX matters less; structured data + reliability matter more.** When a buyer-agent does the browsing, brand storytelling weighs less than price, reliability, trust signals, machine-legible terms.
- **Pricing pressure rises.** Buyer agents continuously compare and re-optimise. Opaque pricing erodes.
- **Zero-click / proactive commerce.** "Keep my pantry stocked, never exceed £X/mo" becomes the default for repeat categories.
- **Power shifts to whoever owns the rendezvous point** between buyer and seller agents (a few clouds, PSPs, or marketplaces in the West; Alibaba in China).

---

## Open questions / things to verify before betting on them

- Exact shape of Stripe's Agentic Commerce Protocol adoption among merchants outside the Shopify orbit.
- Whether Amazon will expose Alexa shopping agent to 3rd-party agents or keep it walled.
- Whether MCP becomes the discovery standard for paid APIs to agents, or something else wins.
- Timeline assumptions in sources skew bullish (typical of vendor-adjacent analysts); halve aggressive numbers before quoting.
