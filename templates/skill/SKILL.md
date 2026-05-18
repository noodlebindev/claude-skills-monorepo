---
name: {{SKILL_NAME}}
description: Use when the user asks to <REPLACE WITH TRIGGER>. Phrases like "<REPLACE>", "<REPLACE>". Do not use for <REPLACE WITH ANTI-TRIGGER>.
license: MIT
metadata:
  category: <REPLACE>
  linked-skills: []
allowed-tools:
  - Read
  - Edit
forbidden-behaviours:
  - Do not modify files outside the user's working directory
  - Do not call external APIs without explicit user permission
---

# {{SKILL_NAME}}

<One-sentence statement of what this skill does. Loaded at activation time, so keep the whole body tight.>

## When to use this skill

<Specific trigger conditions. The agent reads this to decide whether the activation was correct.>

- When the user says "<example phrase>"
- When the user is working in <context> and asks for <thing>
- When <specific condition>

## When NOT to use this skill

<Anti-triggers — situations where this skill should hand off to another, or do nothing.>

- When the user wants <adjacent-but-different thing> — use <other skill> instead
- When <condition that looks similar but isn't>

## What this skill does

<Step-by-step procedure. Numbered. Imperative voice ("Read the file", not "The agent reads the file").>

1. <Step one>
2. <Step two>
3. <Step three>

## Inputs

<What the agent needs to gather from the user or environment before running the procedure.>

- <Input 1> — <where it comes from>
- <Input 2> — <validation rules>

## Outputs

<What the agent produces. Be precise — formats, file locations, follow-up actions.>

- <Output 1>
- <Output 2>

## Example

**User says:**

> <Realistic user prompt>

**Agent does:**

1. <Action>
2. <Action>
3. <Action>

**Result:**

> <Expected output>

## References

For deeper material, see:

- `references/<topic>.md` — <what's in it>

## Constraints

- <Hard limit, e.g., max file size, max API calls>
- <Behavioural limit, e.g., never overwrites without confirmation>

## Failure modes

If <condition>, the skill should: <what to do>.

If <condition>, the skill should refuse and say: "<exact message>".
