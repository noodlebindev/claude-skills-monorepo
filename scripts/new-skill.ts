/**
 * Scaffolds a new skill from templates/skill/.
 *
 * Run: pnpm new <kebab-case-name>
 */

import { cp, readdir, readFile, stat, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { SKILLS_DIR, SKILL_NAME_REGEX, TEMPLATES_DIR } from "./_lib.ts";

async function main() {
  const name = process.argv[2];

  if (!name) {
    console.error("Usage: pnpm new <kebab-case-skill-name>");
    return 1;
  }

  if (!SKILL_NAME_REGEX.test(name)) {
    console.error(`Invalid name '${name}'. Must match ${SKILL_NAME_REGEX}`);
    console.error("Rules: lowercase, hyphens only, max 64 chars, starts with letter or digit.");
    return 1;
  }

  const target = join(SKILLS_DIR, name);
  const exists = await stat(target).then(
    () => true,
    () => false,
  );
  if (exists) {
    console.error(`skills/${name}/ already exists. Pick a different name or remove it first.`);
    return 1;
  }

  const templateDir = join(TEMPLATES_DIR, "skill");
  await cp(templateDir, target, { recursive: true });

  // Walk and substitute placeholders in the copied tree
  await substituteInTree(target, {
    "{{SKILL_NAME}}": name,
    "{{SKILL_DESCRIPTION}}": `Use when the user asks to <REPLACE WITH TRIGGER for ${name}>`,
  });

  console.log(`Created skills/${name}/`);
  console.log("");
  console.log("Next steps:");
  console.log(`  1. Edit skills/${name}/SKILL.md — frontmatter + body`);
  console.log(`  2. Edit skills/${name}/README.md — human intro`);
  console.log(`  3. Edit skills/${name}/CLAUDE.md — per-skill agent notes`);
  console.log(`  4. Edit skills/${name}/package.json — set description`);
  console.log(`  5. Run: pnpm check`);
  console.log("");
  console.log(`See docs/adding-a-skill.md for the full checklist.`);
  return 0;
}

async function substituteInTree(root: string, replacements: Record<string, string>) {
  const entries = await readdir(root, { withFileTypes: true });
  for (const entry of entries) {
    const full = join(root, entry.name);
    if (entry.isDirectory()) {
      await substituteInTree(full, replacements);
    } else if (entry.isFile() && !entry.name.startsWith(".gitkeep")) {
      const original = await readFile(full, "utf8");
      let updated = original;
      for (const [from, to] of Object.entries(replacements)) {
        updated = updated.split(from).join(to);
      }
      if (updated !== original) {
        await writeFile(full, updated, "utf8");
      }
    }
  }
}

main().then((code) => process.exit(code));
