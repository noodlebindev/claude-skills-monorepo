/**
 * Detects cross-skill references — one skill referring to another by path,
 * import, or markdown link.
 *
 * Allowed exception: explicit declaration in SKILL.md frontmatter:
 *   metadata:
 *     linked-skills: [other-skill-name]
 *
 * Run: pnpm contamination
 */

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { type LintIssue, listSkillDirs, loadSkill, reportIssues, walkFiles, SKILLS_DIR } from "./_lib.ts";

const SCAN_EXTENSIONS = new Set([".md", ".ts", ".js", ".mjs", ".cjs", ".json", ".yaml", ".yml"]);

async function main() {
  const skillNames = await listSkillDirs();
  if (skillNames.length === 0) {
    console.log("No skills found. Nothing to check.");
    return 0;
  }

  console.log(`Checking ${skillNames.length} skill(s) for cross-references...`);

  const skills = await Promise.all(skillNames.map((n) => loadSkill(n).catch(() => null)));
  const validSkills = skills.filter((s): s is NonNullable<typeof s> => s !== null);
  const allSkillNames = new Set(validSkills.map((s) => s.name));

  const issues: LintIssue[] = [];

  for (const skill of validSkills) {
    const others = new Set(allSkillNames);
    others.delete(skill.name);
    const allowed = new Set(skill.frontmatter.metadata?.["linked-skills"] ?? []);

    for await (const relPath of walkFiles(skill.dir)) {
      const ext = relPath.includes(".") ? "." + relPath.split(".").pop()! : "";
      if (!SCAN_EXTENSIONS.has(ext)) continue;

      const filePath = join(skill.dir, relPath);
      const content = await readFile(filePath, "utf8").catch(() => "");
      if (!content) continue;

      for (const other of others) {
        if (allowed.has(other)) continue;
        const refs = findReferences(content, other);
        for (const ref of refs) {
          issues.push({
            skill: skill.name,
            level: "error",
            message: `Reference to skill '${other}' in ${relPath}: ${ref}. If intentional, declare in metadata.linked-skills.`,
          });
        }
      }
    }
  }

  const errors = reportIssues(issues);
  return errors > 0 ? 1 : 0;
}

/**
 * Returns the set of textual references to `otherSkill` in `content`.
 * Matches: relative paths, skills/<name>/, wiki-links [[name]], package imports.
 * Tolerates incidental word matches by requiring path-like context.
 */
function findReferences(content: string, otherSkill: string): string[] {
  const found = new Set<string>();
  const escaped = otherSkill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const patterns: RegExp[] = [
    new RegExp(`skills/${escaped}/`, "g"),
    new RegExp(`\\.\\./${escaped}/`, "g"),
    new RegExp(`\\.\\./\\.\\./skills/${escaped}/`, "g"),
    new RegExp(`@claude-skills/${escaped}\\b`, "g"),
    new RegExp(`\\[\\[${escaped}\\]\\]`, "g"),
  ];

  for (const pattern of patterns) {
    const matches = content.match(pattern);
    if (matches) {
      for (const m of matches) found.add(m);
    }
  }

  return [...found];
}

main().then((code) => process.exit(code));
