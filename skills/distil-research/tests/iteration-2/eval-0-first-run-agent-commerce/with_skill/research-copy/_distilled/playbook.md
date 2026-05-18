# Agent Commerce — Playbook

## TL;DR

1. Two customers now: the human, and the human's agent. Anything not machine-readable degrades the agent to a chatbot.
2. Defensible value = structured data + permissioned execution. Chat is the commodity.
3. Wedge first. Narrow + repeat + low-risk shopping job. Protocol plays come after a working wedge.

## The 5-primitive agent-ready stack

**Rule:** Build all 5 before shipping any agent surface. Miss one → chatbot.

**Execution:**
1. **Product truth layer** — canonical product graph (PIM + search + pricing + inventory + reviews). Normalised attributes, variants, stock, prices, promos, delivery windows, returns, review summaries.
2. **Offer API** — exact landed cost, tax, fees, delivery promise, return policy, substitutions.
3. **Action API** — add-to-cart, reserve, place, modify, return, escalate. Idempotent. Deterministic.
4. **Consent + policy engine** — spending caps, allowed categories, approval thresholds, ID verification, audit logs.
5. **Agent memory** — preferences, fit, brand exclusions, replenishment cadence, service history.

**Example:** A "buy me shoes" agent without size availability, current price, return policy, and preferred-brand context is a chat interface — not a shopper.

## Minimum data stack — build checklist

**Rule:** Ship these 7 feeds before any agent surface goes live.

**Execution:**
1. Product catalog feed — machine-readable, normalised
2. Inventory feed — real-time, not "usually ships soon"
3. Pricing + promotions feed — API, not buried in marketing copy
4. Fulfilment + returns — structured, per-SKU
5. Customer preferences / session context
6. API access — search, cart, checkout
7. Logging + approval controls for risky actions

**Edge case:** If you can't ship all 7 day-one, gate the agent UX to read-only recommendations until 4–7 land.

## Build wedges — Claude Agent SDK, solo / small team

**Rule:** Pick one Tier-1. Don't ship "AI shopper for everything".

**Wedge criteria:** clear intent · repeat behaviour · low risk · measurable outcome.

**Tier 1 — start here:**
- Repeat-purchase / replenishment agent (consumables, pet food, toiletries, coffee). 4–6 weeks to prove the loop.
- Comparison / value-optimiser agent (headphones, laptops, skincare). Solves "too many tabs". Neutral first; affiliate later.
- Group-gifting / shared-cart agent. People hate organising group gifts. Low competitive density.

**Tier 2 — after a paying loop exists:**
- Private "shop-for-you" with persistent taste profile
- Sustainable / ethical filter agent
- Voice-first home-restock agent (WhatsApp / smart speaker / iOS Shortcut)

**Tier 3 — platform plays, need distribution:**
- Merchant-side Sidekick clone for long-tail Shopify / Woo
- Agent-to-agent commerce protocol + reference implementation
- White-label shopping-agent builder for merchants
- "Agent squad" pop-up experiences for drops / influencer launches

**Edge case:** Avoid complex fashion fit, expensive electronics, anything where one bad recommendation is unforgivable.

## Roadmap — sequence by trust + technical dependency

| Horizon | Ship | Why |
|---|---|---|
| 0–6 mo | Conversational discovery, guided comparison, price alerts, reorder flows, catalog cleanup | AI on top of existing funnel. No autonomy. |
| 6–12 mo | Agent-facing APIs, cart assembly, identity/permission controls, structured delivery + returns | Foundation for reliable agent transactions. |
| 12–24 mo | Autonomous replenishment, seller-agent negotiation, dynamic bundles, cross-merchant interop | Agent-agent commerce starts redistributing value. |

## Agent micropayments SaaS — adjacent monetisation lane

**Rule:** Sell a paid API/workflow that agents discover, authorise, and consume autonomously.

**Execution (10 steps):**
1. Pick a task agents already need (data lookup, doc transformation, compliance checks, lead enrichment).
2. API-first. Deterministic inputs, machine-readable outputs, predictable latency, idempotency.
3. Inline payment handshake — price → spend-cap auth → micropayment → result. Stripe ACP / agent wallets are mainstream.
4. One pricing unit at launch (per call / per doc / per 1k tokens / per outcome).
5. Agent discovery — registries, marketplaces, MCP endpoints.
6. Guardrails day one — per-session caps, rate limits, identity, audit logs.
7. Unit economics that survive micropayments — low payment fees, low inference cost, high enough value per call.
8. One integration path at launch (SDK / MCP / browser agent / enterprise assistant).
9. Instrument everything — requests, approvals, failures, retries, value-per-tx.
10. Wedge then expand. One indispensable repeated action first.

**Launch formula:** one API + one agent use case + one pricing unit + one wallet flow + one audit log.

**Example:** Agent-grade research retrieval · paid verification checks · doc conversion with guaranteed schema output.

## UX rules — human-facing surfaces

**Rule:** Build for supervision, not conversation. Show planned actions and confidence.

**Execution:**
- "Shopping missions" with editable constraints ("restock pantry under £80", "carry-on for 3 days")
- Structured tradeoffs (price / delivery / rating), not prose
- Approval modes per category: always-ask | ask-above-threshold | auto-execute
- Monitoring surfaces: price watch, back-in-stock, warranty reminders, reorder suggestions, return-deadline alerts

**Edge case:** Articulate prose ≠ trust. Trust is built by showing the plan, not by explaining it.

## Agent-readiness scorecard

**Rule:** Track separately from conversion KPIs. Conversion looks healthy while agent-readiness rots.

**Execution:**
- Catalog completeness + attribute accuracy
- % SKUs with machine-readable shipping + returns terms
- Agent-completable checkout rate (no browser fallback)
- Assisted conversion, autonomous reorder rate, exception rate, post-purchase resolution time

## Strategic frames

- **Integrated stack vs protocol play.** China's lead (Alibaba/Qwen/Alipay/Cainiao) is structural — one vertically-integrated stack. The West will be protocols bridging many players. Slower, but bigger surface for tooling startups.
- **Power shifts to back-end execution.** When the agent does the browsing, brand storytelling weighs less than price, reliability, machine-legible terms.
- **Pricing pressure rises.** Buyer agents continuously re-optimise. Opaque pricing erodes.
- **Rendezvous points concentrate value.** In the West, a few clouds, PSPs, or marketplaces become default agent-meeting venues. Pick which side you're on.

## Open questions — verify before betting

- Stripe ACP adoption outside the Shopify orbit
- Whether Amazon exposes Alexa shopping agent to 3rd-party agents
- Whether MCP becomes the discovery standard, or something else wins
- Vendor analysts (commercetools / nshift / paz.ai) skew bullish — halve aggressive timeline claims
