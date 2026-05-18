/**
 * Shared helpers for monorepo tooling scripts.
 * Pure functions, no top-level side effects.
 */

import { readdir, readFile, stat } from "node:fs/promises";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import yaml from "js-yaml";

export const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
export const SKILLS_DIR = join(REPO_ROOT, "skills");
export const TEMPLATES_DIR = join(REPO_ROOT, "templates");

export const ALLOWED_FRONTMATTER_KEYS = new Set([
  "name",
  "description",
  "license",
  "compatibility",
  "allowed-tools",
  "forbidden-behaviours",
  "metadata",
]);

export const SKILL_NAME_REGEX = /^[a-z0-9][a-z0-9-]{0,63}$/;
export const MAX_DESCRIPTION_LENGTH = 1024;
export const MAX_SKILL_BODY_LINES = 500;

export type SkillFrontmatter = {
  name: string;
  description: string;
  license?: string;
  compatibility?: unknown;
  "allowed-tools"?: string[];
  "forbidden-behaviours"?: string[];
  metadata?: Record<string, unknown> & {
    "linked-skills"?: string[];
  };
};

export type Skill = {
  name: string;
  dir: string;
  skillMdPath: string;
  frontmatter: SkillFrontmatter;
  body: string;
  bodyLineCount: number;
  rawFrontmatter: Record<string, unknown>;
};

export type LintIssue = {
  skill: string;
  level: "error" | "warn";
  message: string;
};

/**
 * Lists all skill directory names under skills/.
 * A skill folder is any direct subdirectory of skills/ that contains a SKILL.md.
 */
export async function listSkillDirs(): Promise<string[]> {
  let entries: string[];
  try {
    entries = await readdir(SKILLS_DIR);
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw err;
  }

  const result: string[] = [];
  for (const entry of entries) {
    if (entry.startsWith(".")) continue;
    const full = join(SKILLS_DIR, entry);
    const s = await stat(full).catch(() => null);
    if (!s?.isDirectory()) continue;
    const skillMd = join(full, "SKILL.md");
    const hasSkillMd = await stat(skillMd).then(
      (st) => st.isFile(),
      () => false,
    );
    if (hasSkillMd) result.push(entry);
  }
  return result.sort();
}

/**
 * Reads and parses a single skill. Throws on malformed frontmatter.
 */
export async function loadSkill(name: string): Promise<Skill> {
  const dir = join(SKILLS_DIR, name);
  const skillMdPath = join(dir, "SKILL.md");
  const raw = await readFile(skillMdPath, "utf8");
  const { frontmatter, body, rawFrontmatter } = parseSkillMd(raw);
  const bodyLineCount = body.split("\n").length;
  return { name, dir, skillMdPath, frontmatter, body, bodyLineCount, rawFrontmatter };
}

/**
 * Splits a SKILL.md into YAML frontmatter and markdown body.
 * Throws if frontmatter is missing or malformed.
 */
export function parseSkillMd(raw: string): {
  frontmatter: SkillFrontmatter;
  body: string;
  rawFrontmatter: Record<string, unknown>;
} {
  if (!raw.startsWith("---\n") && !raw.startsWith("---\r\n")) {
    throw new Error("SKILL.md must begin with '---' frontmatter delimiter");
  }
  const rest = raw.replace(/^---\r?\n/, "");
  const end = rest.search(/\r?\n---\r?\n/);
  if (end < 0) {
    throw new Error("SKILL.md frontmatter has no closing '---' delimiter");
  }
  const yamlText = rest.slice(0, end);
  const body = rest.slice(end).replace(/^\r?\n---\r?\n/, "");

  const parsed = yaml.load(yamlText);
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("SKILL.md frontmatter must be a YAML mapping");
  }
  const rawFrontmatter = parsed as Record<string, unknown>;
  const frontmatter = rawFrontmatter as unknown as SkillFrontmatter;
  return { frontmatter, body, rawFrontmatter };
}

/**
 * Recursively walks a directory and yields file paths (relative to the directory).
 * Skips node_modules and dotfile dirs.
 */
export async function* walkFiles(root: string, rel = ""): AsyncGenerator<string> {
  const entries = await readdir(join(root, rel), { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === "node_modules") continue;
    if (entry.name.startsWith(".") && entry.name !== ".gitkeep") continue;
    const childRel = rel ? join(rel, entry.name) : entry.name;
    if (entry.isDirectory()) {
      yield* walkFiles(root, childRel);
    } else if (entry.isFile()) {
      yield childRel;
    }
  }
}

/**
 * Pretty-prints a list of lint issues grouped by skill, returns count of errors.
 */
export function reportIssues(issues: LintIssue[]): number {
  if (issues.length === 0) {
    console.log("All checks passed.");
    return 0;
  }

  const bySkill = new Map<string, LintIssue[]>();
  for (const issue of issues) {
    const arr = bySkill.get(issue.skill) ?? [];
    arr.push(issue);
    bySkill.set(issue.skill, arr);
  }

  let errors = 0;
  for (const [skill, list] of bySkill) {
    console.log(`\n${skill}`);
    for (const issue of list) {
      const tag = issue.level === "error" ? "  ERROR" : "  WARN ";
      console.log(`${tag}  ${issue.message}`);
      if (issue.level === "error") errors++;
    }
  }
  console.log(`\n${errors} error(s), ${issues.length - errors} warning(s)`);
  return errors;
}
