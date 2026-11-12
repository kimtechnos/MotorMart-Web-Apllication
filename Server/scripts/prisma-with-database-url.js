import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { config } from "dotenv";

const serverRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
config({ path: path.join(serverRoot, ".env") });

const SECRET_DIR = process.env.RENDER_SECRET_DIR || "/etc/secrets";

function normalizeDatabaseUrl(raw) {
  let url = String(raw ?? "").trim().replace(/^\uFEFF/, "");
  if (
    (url.startsWith('"') && url.endsWith('"')) ||
    (url.startsWith("'") && url.endsWith("'"))
  ) {
    url = url.slice(1, -1).trim();
  }
  if (/^DATABASE_URL\s*=/.test(url)) {
    return normalizeDatabaseUrl(url.replace(/^DATABASE_URL\s*=\s*/, ""));
  }
  return url;
}

function parseDotEnv(contents) {
  for (const line of contents.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const match = trimmed.match(/^DATABASE_URL\s*=\s*(.*)$/);
    if (match) return normalizeDatabaseUrl(match[1]);
  }
  return "";
}

function resolveDatabaseUrl(env = process.env) {
  const candidates = [normalizeDatabaseUrl(env.DATABASE_URL)];
  const secretUrlPath = `${SECRET_DIR}/DATABASE_URL`;
  if (existsSync(secretUrlPath)) {
    candidates.push(normalizeDatabaseUrl(readFileSync(secretUrlPath, "utf8")));
  }
  const secretEnvPath = `${SECRET_DIR}/.env`;
  if (existsSync(secretEnvPath)) {
    candidates.push(parseDotEnv(readFileSync(secretEnvPath, "utf8")));
  }
  return candidates.find((value) => value) || "";
}

function describeUrl(url) {
  if (!url) return "empty or unset";
  return `prefix ${JSON.stringify(url.slice(0, 15))}, length ${url.length}`;
}

const url = resolveDatabaseUrl();
console.log(`DATABASE_URL ${describeUrl(url)}`);

if (!/^postgres(ql)?:\/\//i.test(url)) {
  console.error(
    "Set DATABASE_URL on the motormart-api service as an Environment Variable.",
  );
  console.error(
    "Paste only the connection string, with no quotes and no DATABASE_URL= prefix.",
  );
  process.exit(1);
}

process.env.DATABASE_URL = url;
const result = spawnSync("npx", ["prisma", ...process.argv.slice(2)], {
  stdio: "inherit",
  env: process.env,
  shell: true,
});
process.exit(result.status ?? 1);
