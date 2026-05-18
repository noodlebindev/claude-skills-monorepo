/**
 * Validates SKILL.md frontmatter for every skill in skills/.
 * Exits 1 if any error-level issue is found.
 *
 * Run: pnpm lint
 */

import {
  ALLOWED_FRONTMATTER_KEYS,
  MAX_DESCRIPTION_LENGTH,
  MAX_SKILL_BODY_LINES,
  SKILL_NAME_REGEX,
  type LintIssue,
  listSkillDirs,
  loadSkill,
  reportIssues,
} from "./_lib.ts";

async function main() {
  const skillNames = await listSkillDirs();
  if (skillNames.length === 0) {
    console.log("No skills found in skills/. Add one with: pnpm new <name>");
    return 0;
  }

  console.log(`Linting ${skillNames.length} skill(s)...`);
  const issues: LintIssue[] = [];

  for (const name of skillNames) {
    try {
      const skill = await loadSkill(name);
      issues.push(...lintSkill(skill));
    } catch (err) {
      issues.push({
        skill: name,
        level: "error",
        message: `Failed to load: ${(err as Error).message}`,
      });
    }
  }

  const errors = reportIssues(issues);
  return errors > 0 ? 1 : 0;
}

function lintSkill(skill: Awaited<ReturnType<typeof loadSkill>>): LintIssue[] {
  const issues: LintIssue[] = [];
  const { name, frontmatter, rawFrontmatter, bodyLineCount } = skill;

  // Required fields
  if (typeof frontmatter.name !== "string") {
    issues.push({ skill: name, level: "error", message: "Missing required 'name' field" });
  }
  if (typeof frontmatter.description !== "string") {
    issues.push({ skill: name, level: "error", message: "Missing required 'description' field" });
  }

  // name matches folder
  if (frontmatter.name && frontmatter.name !== name) {
    issues.push({
      skill: name,
      level: "error",
      message: `Frontmatter name '${frontmatter.name}' does not match folder name '${name}'`,
    });
  }

  // name format
  if (frontmatter.name && !SKILL_NAME_REGEX.test(frontmatter.name)) {
    issues.push({
      skill: name,
      level: "error",
      message: `Name '${frontmatter.name}' must match ${SKILL_NAME_REGEX} (lowercase, hyphens, max 64 chars, starts with letter/digit)`,
    });
  }

  // description length
  if (frontmatter.description && frontmatter.description.length > MAX_DESCRIPTION_LENGTH) {
    issues.push({
      skill: name,
      level: "error",
      message: `Description is ${frontmatter.description.length} chars (max ${MAX_DESCRIPTION_LENGTH})`,
    });
  }

  // description quality (warning, not error)
  if (frontmatter.description) {
    const d = frontmatter.description.toLowerCase();
    const hasTrigger = /\b(use when|when the user|trigger|fires?|invoke)\b/.test(d);
    if (!hasTrigger) {
      issues.push({
        skill: name,
        level: "warn",
        message: "Description does not look routing-quality (missing 'use when', 'when the user', etc.)",
      });
    }
    if (frontmatter.description.length < 40) {
      issues.push({
        skill: name,
        level: "warn",
        message: `Description is only ${frontmatter.description.length} chars — probably too vague to route well`,
      });
    }
  }

  // unknown top-level keys
  for (const key of Object.keys(rawFrontmatter)) {
    if (!ALLOWED_FRONTMATTER_KEYS.has(key)) {
      issues.push({
        skill: name,
        level: "error",
        message: `Unknown frontmatter key '${key}'. Allowed: ${[...ALLOWED_FRONTMATTER_KEYS].join(", ")}`,
      });
    }
  }

  // body size
  if (bodyLineCount > MAX_SKILL_BODY_LINES) {
    issues.push({
      skill: name,
      level: "error",
      message: `SKILL.md body is ${bodyLineCount} lines (max ${MAX_SKILL_BODY_LINES}). Move detail to references/.`,
    });
  }

  // allowed-tools shape
  if (frontmatter["allowed-tools"] !== undefined) {
    if (!Array.isArray(frontmatter["allowed-tools"])) {
      issues.push({ skill: name, level: "error", message: "'allowed-tools' must be an array of strings" });
    } else if (!frontmatter["allowed-tools"].every((t) => typeof t === "string")) {
      issues.push({ skill: name, level: "error", message: "'allowed-tools' must be an array of strings" });
    }
  }

  // forbidden-behaviours shape
  if (frontmatter["forbidden-behaviours"] !== undefined) {
    if (!Array.isArray(frontmatter["forbidden-behaviours"])) {
      issues.push({
        skill: name,
        level: "error",
        message: "'forbidden-behaviours' must be an array of strings",
      });
    }
  }

  // linked-skills shape
  const linked = frontmatter.metadata?.["linked-skills"];
  if (linked !== undefined && !Array.isArray(linked)) {
    issues.push({
      skill: name,
      level: "error",
      message: "'metadata.linked-skills' must be an array of skill names",
    });
  }

  return issues;
}

main().then((code) => process.exit(code));
