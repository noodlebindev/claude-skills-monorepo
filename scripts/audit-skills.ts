/**
 * Aggregate health audit across every skill.
 * Checks for: required files, package.json hygiene, hardcoded user paths,
 * secret-shaped strings, junk files (.DS_Store etc.), forbidden-behaviours sanity.
 *
 * Run: pnpm audit
 *
 * Note: this is a custom audit (not `npm audit`). Repo design choice — see scripts in root package.json.
 */

import { readFile, stat } from "node:fs/promises";
import { join, relative } from "node:path";
import { type LintIssue, listSkillDirs, loadSkill, reportIssues, walkFiles, SKILLS_DIR } from "./_lib.ts";

const REQUIRED_FILES = ["SKILL.md", "README.md", "CLAUDE.md", "package.json"];

const JUNK_FILES = new Set([".DS_Store", "Thumbs.db", "desktop.ini"]);

const SECRET_PATTERNS: Array<{ name: string; re: RegExp }> = [
  { name: "AWS Access Key ID", re: /AKIA[0-9A-Z]{16}/ },
  { name: "OpenAI key", re: /sk-[A-Za-z0-9]{32,}/ },
  { name: "Anthropic key", re: /sk-ant-[A-Za-z0-9_-]{20,}/ },
  { name: "GitHub PAT (classic)", re: /\bghp_[A-Za-z0-9]{36}\b/ },
  { name: "GitHub fine-grained PAT", re: /\bgithub_pat_[A-Za-z0-9_]{82,}\b/ },
  { name: "Slack token", re: /xox[baprs]-[A-Za-z0-9-]{10,}/ },
  { name: "Google API key", re: /AIza[0-9A-Za-z_-]{35}/ },
  { name: "Private key block", re: /-----BEGIN (?:RSA |EC |OPENSSH |)PRIVATE KEY-----/ },
];

const USER_PATH_PATTERNS: Array<{ name: string; re: RegExp }> = [
  { name: "macOS home path", re: /\/Users\/[a-z0-9][a-z0-9._-]*\// },
  { name: "Linux home path", re: /\/home\/[a-z0-9][a-z0-9._-]*\// },
  { name: "Windows home path", re: /[A-Z]:\\Users\\[A-Za-z0-9._-]+\\/ },
];

const SCAN_EXTENSIONS = new Set([".md", ".ts", ".js", ".mjs", ".cjs", ".json", ".yaml", ".yml", ".txt", ".sh"]);

async function main() {
  const skillNames = await listSkillDirs();
  if (skillNames.length === 0) {
    console.log("No skills found. Nothing to audit.");
    return 0;
  }

  console.log(`Auditing ${skillNames.length} skill(s)...`);
  const issues: LintIssue[] = [];

  for (const name of skillNames) {
    issues.push(...(await auditSkill(name)));
  }

  const errors = reportIssues(issues);
  return errors > 0 ? 1 : 0;
}

async function auditSkill(name: string): Promise<LintIssue[]> {
  const issues: LintIssue[] = [];
  const dir = join(SKILLS_DIR, name);

  // Required files
  for (const f of REQUIRED_FILES) {
    const present = await stat(join(dir, f)).then(
      (s) => s.isFile(),
      () => false,
    );
    if (!present) {
      issues.push({ skill: name, level: "error", message: `Missing required file: ${f}` });
    }
  }

  // package.json hygiene
  try {
    const pkgRaw = await readFile(join(dir, "package.json"), "utf8");
    const pkg = JSON.parse(pkgRaw) as Record<string, unknown>;
    const expectedName = `@claude-skills/${name}`;
    if (pkg.name !== expectedName) {
      issues.push({
        skill: name,
        level: "error",
        message: `package.json 'name' should be '${expectedName}' (got '${String(pkg.name)}')`,
      });
    }
    if (!pkg.version) {
      issues.push({ skill: name, level: "error", message: "package.json missing 'version'" });
    }
    if (!pkg.license) {
      issues.push({ skill: name, level: "warn", message: "package.json missing 'license'" });
    }
    if (!pkg.description) {
      issues.push({ skill: name, level: "warn", message: "package.json missing 'description'" });
    }
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== "ENOENT") {
      issues.push({ skill: name, level: "error", message: `Invalid package.json: ${(err as Error).message}` });
    }
  }

  // Frontmatter must parse (defer to lint for detail, but flag total failure)
  try {
    await loadSkill(name);
  } catch (err) {
    issues.push({
      skill: name,
      level: "error",
      message: `SKILL.md failed to parse: ${(err as Error).message}`,
    });
  }

  // Walk all files and scan for junk + secrets + user paths
  try {
    for await (const relPath of walkFiles(dir)) {
      const base = relPath.split("/").pop()!;

      if (JUNK_FILES.has(base)) {
        issues.push({ skill: name, level: "error", message: `Junk file: ${relPath}` });
        continue;
      }

      const ext = base.includes(".") ? "." + base.split(".").pop()! : "";
      if (!SCAN_EXTENSIONS.has(ext)) continue;

      const content = await readFile(join(dir, relPath), "utf8").catch(() => "");
      if (!content) continue;

      for (const { name: secretName, re } of SECRET_PATTERNS) {
        const m = re.exec(content);
        if (m) {
          issues.push({
            skill: name,
            level: "error",
            message: `Possible ${secretName} in ${relPath} (matched: ${redact(m[0])})`,
          });
        }
      }
      for (const { name: pathName, re } of USER_PATH_PATTERNS) {
        const m = re.exec(content);
        if (m) {
          issues.push({
            skill: name,
            level: "warn",
            message: `${pathName} in ${relPath}: ${m[0]}`,
          });
        }
      }
    }
  } catch (err) {
    issues.push({ skill: name, level: "error", message: `Walk failed: ${(err as Error).message}` });
  }

  return issues;
}

function redact(s: string): string {
  if (s.length <= 8) return s.slice(0, 2) + "***";
  return s.slice(0, 4) + "..." + s.slice(-2);
}

main().then((code) => process.exit(code));
