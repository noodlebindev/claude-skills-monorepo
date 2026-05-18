# Agent Commerce — Playbook

## TL;DR
1. You have two customers now: the human, and the human's agent. Catalog, offers, checkout, returns each need a machine-readable version, or the agent degrades to a chatbot.
2. The defensible value is structured data + permissioned execution. Chat is the commodity.
3. Wedge first. One narrow, repeat, low-risk shopping job — not "AI shopper for everything". Protocol plays come after a working wedge.

## The 5-primitive agent-ready stack

In dependency order. Missing any primitive = the agent is a chatbot.

1. **Product truth layer** — one canonical product graph: PIM + search + pricing + inventory + reviews. Normalised attributes, variants, stock, price, promotions, delivery windows, returns terms, review summaries.
2. **Offer API** — exact landed cost, tax, fees, delivery promise, return policy, substitutions.
3. **Action API** — add to cart, reserve, place order, modify, return, escalate. Idempotent. Deterministic.
4. **Consent & policy engine** — spending caps, allowed categories, approval thresholds, identity verification, audit logs.
5. **Agent memory** — user preferences, fit, brand exclusions, replenishment cadence, service history.

## Minimum data stack — build checklist

1. Product catalog feed (machine-readable, normalised attributes).
2. Inventory feed (real-time — not "usually ships soon").
3. Pricing + promotions feed (API, not buried in marketing copy).
4. Fulfilment + returns terms, structured per SKU.
5. Customer preferences / session context.
6. API access to search, cart, checkout.
7. Logging + approval controls for risky actions.

A shopping agent for shoes without size availability, current price, return policy, and preferred-brand context is a generic chat interface — not a shopper.

## Build wedges (ranked, for solo / small team on Claude Agent SDK)

Wedge criteria: clear intent, repeat behaviour, low risk, measurable outcome.

**Tier 1 — start here:**
- Repeat-purchase / replenishment agent (consumables, pet food, toiletries, coffee). Highest frequency, lowest risk, ROI obvious in 4–6 weeks.
- Comparison / value-optimiser agent (headphones, laptops, skincare). Targets "too many tabs" pain. Neutral first; affiliate later.
- Group-gifting / shared-cart agent. People hate organising group gifts. Low competitive density.

**Tier 2 — after a paying loop exists:**
- Private "shop-for-you" with persistent taste profile.
- Sustainable / ethical filter agent (sharp differentiation, defensible data work).
- Voice-first home-restock agent (WhatsApp / smart speaker / iOS Shortcut).

**Tier 3 — platform plays, need distribution:**
- Merchant-side Sidekick clone for long-tail Shopify / Woo stores.
- Agent-to-agent commerce protocol + reference implementation.
- White-label shopping-agent builder for merchants.
- "Agent squad" pop-up experiences for fashion drops, influencer launches.

Avoid as first wedge: complex fashion fit, expensive electronics, anything where one bad recommendation is unforgivable.

## Roadmap (sequence by trust + technical dependency)

| Horizon | Ship | Why |
|---|---|---|
| 0–6 mo | Conversational discovery, guided comparison, price alerts, reorder flows, machine-readable catalog cleanup | Low-risk AI on top of existing funnel. Reduces search friction. No autonomy needed. |
| 6–12 mo | Agent-facing APIs, cart assembly, identity/permission controls, structured delivery + returns | Foundation lets internal or external agents transact reliably without browser scraping. |
| 12–24 mo | Autonomous replenishment, seller-agent negotiation, dynamic bundles, cross-merchant interop | Where agent-agent commerce starts redistributing value. |

## Agent micropayments SaaS — adjacent monetisation lane

Sell a paid API/workflow that agents discover, authorise, and consume autonomously.

1. Pick a task agents already need (data lookup, doc transformation, compliance checks, lead enrichment).
2. API-first. Deterministic inputs, machine-readable outputs, predictable latency, idempotency.
3. Inline payment handshake — price → spend-cap auth → micropayment → result. Stripe ACP / agent wallets are mainstream primitives now.
4. One pricing unit at launch (per call / per doc / per 1k tokens / per outcome).
5. Agent discovery — registries, marketplaces, MCP endpoints. If they can't find you, they can't pay you.
6. Guardrails day one — per-session caps, rate limits, identity, audit logs.
7. Unit economics that survive micropayments — low payment fees, low inference cost, high enough value per call.
8. One integration path at launch (SDK / MCP / browser agent / enterprise assistant).
9. Instrument everything — requests, approvals, failures, retries, value-per-tx.
10. Wedge then expand. One indispensable repeated action first.

**Launch formula:** one API, one agent use case, one pricing unit, one wallet flow, one audit log.

Strong v1 candidates: agent-grade research retrieval, paid verification checks, doc conversion with guaranteed schema output.

## UX rules (human-facing surfaces)
- "Shopping missions" with editable constraints ("restock pantry under £80", "carry-on bag for 3 days").
- Structured tradeoffs (price / delivery / rating), not long-form prose.
- Approval modes per category: always-ask | ask-above-threshold | auto-execute.
- Monitoring surfaces: price watch, back-in-stock watch, warranty reminders, reorder suggestions, return-deadline alerts.
- Trust is built by **showing planned actions and confidence**, not by being articulate.

## Agent-readiness scorecard (track separately from conversion KPIs)
- Catalog completeness + attribute accuracy.
- % SKUs with machine-readable shipping + returns.
- Agent-completable checkout rate (no browser fallback).
- Assisted conversion, autonomous reorder rate, exception rate, post-purchase resolution time.

## Strategic frames worth carrying
- **Integrated stack vs protocol play.** China's lead (Alibaba/Qwen/Alipay/Cainiao) is structural — one vertically-integrated stack. The West will be protocols + integrations bridging many players. Slower, but bigger surface for tooling startups.
- **Power shifts to back-end execution.** When the agent does the browsing, brand storytelling weighs less than price, reliability, machine-legible terms.
- **Pricing pressure rises.** Buyer agents continuously re-optimise. Opaque pricing erodes.
- **Rendezvous points concentrate value.** In the West, a few clouds, PSPs, or marketplaces will become default agent-meeting venues. Pick which side you want to be on.

## Open questions — verify before betting
- Adoption of Stripe's Agentic Commerce Protocol outside the Shopify orbit.
- Whether Amazon exposes Alexa shopping agent to 3rd-party agents.
- Whether MCP becomes the discovery standard, or something else wins.
- Vendor-analyst sources (commercetools / nshift / paz.ai) skew bullish. Halve aggressive timeline claims.
