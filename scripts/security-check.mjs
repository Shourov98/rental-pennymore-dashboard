import { existsSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";

/**
 * Project-specific guardrails for the compromise pattern previously observed
 * in this repository family. This is intentionally narrow: it is not a
 * general malware scanner and must complement code review and secret scanning.
 */
const root = process.cwd();
const failures = [];

const prohibitedPaths = [
  "api.js",
  ".vscode/tasks.json",
  ".vscode/launch.json",
];

for (const path of prohibitedPaths) {
  if (existsSync(resolve(root, path))) {
    failures.push(`${path} is not permitted in this project.`);
  }
}

const suspiciousConfigPatterns = [
  /\beval\s*\(/i,
  /\bchild_process\b/i,
  /\bspawn\s*\(/i,
  /\bexec(?:Sync)?\s*\(/i,
  /\bglobal\s*\[[^\]]+\]\s*=/i,
  /\bETH_RPC_URL\b/i,
  /\bfromCharCode\s*\(/i,
];

for (const path of ["postcss.config.mjs", "eslint.config.mjs"]) {
  const file = resolve(root, path);
  if (!existsSync(file)) continue;

  const content = readFileSync(file, "utf8");
  if (statSync(file).size > 20_000) {
    failures.push(`${path} is unexpectedly large and requires review.`);
  }
  if (suspiciousConfigPatterns.some(pattern => pattern.test(content))) {
    failures.push(`${path} contains prohibited executable or obfuscated content.`);
  }
}

const packageJson = JSON.parse(readFileSync(resolve(root, "package.json"), "utf8"));
const scripts = Object.entries(packageJson.scripts ?? {});
const suspiciousScriptPatterns = [
  /(?:^|[;&|]\s*)node\s+(?:\.\/)?api\.js\b/i,
  /(?:^|[;&|]\s*)(?:curl|wget)\b[^\n]*\|\s*(?:sh|bash)\b/i,
];

for (const [name, command] of scripts) {
  if (
    typeof command === "string"
    && suspiciousScriptPatterns.some(pattern => pattern.test(command))
  ) {
    failures.push(`package.json script \"${name}\" contains a prohibited execution pattern.`);
  }
}

if (failures.length > 0) {
  console.error(`Security check failed:\n- ${failures.join("\n- ")}`);
  process.exit(1);
}

console.log("Security check passed.");
