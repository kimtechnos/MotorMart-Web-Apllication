import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "dotenv";
import { PrismaClient } from "@prisma/client";

const serverRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

config({ path: path.join(serverRoot, ".env") });

const sourceUrl = process.env.DATABASE_URL;
if (!sourceUrl) {
  throw new Error("DATABASE_URL is required so tests can target a separate database");
}

const databaseUrl = new URL(sourceUrl);
databaseUrl.pathname = "/motormart_test";
if (databaseUrl.pathname.includes("cardelivary")) {
  throw new Error("Refusing to run tests against the personal development database");
}

process.env.DATABASE_URL = databaseUrl.toString();
process.env.JWT_SECRET = "test-only-jwt-secret";
process.env.NODE_ENV = "test";

const pgEnv = {
  ...process.env,
  PGUSER: databaseUrl.username,
  PGPASSWORD: decodeURIComponent(databaseUrl.password),
  PGHOST: databaseUrl.hostname,
  PGPORT: databaseUrl.port || "5432",
  PGDATABASE: "postgres",
};

let prisma;
let server;
let baseUrl;

export async function startTestApp() {
  spawnSync("createdb", ["motormart_test"], { env: pgEnv });
  const migrated = spawnSync("npx", ["prisma", "migrate", "deploy"], {
    cwd: serverRoot,
    env: process.env,
    shell: true,
    encoding: "utf8",
  });
  if (migrated.status !== 0) {
    throw new Error(migrated.stderr || migrated.stdout || "prisma migrate deploy failed");
  }

  prisma = new PrismaClient();
  const { app } = await import("../index.js");
  server = app.listen(0, "127.0.0.1");
  await new Promise((resolve) => server.once("listening", resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
  return { prisma, baseUrl };
}

export function getPrisma() {
  return prisma;
}

export async function resetDatabase() {
  await prisma.$executeRawUnsafe(
    'TRUNCATE TABLE "contact_messages", "table_inquiries", "table_cars", "users_table" RESTART IDENTITY CASCADE',
  );
}

export async function stopTestApp() {
  if (server) {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
    server = null;
  }
  if (prisma) {
    await prisma.$disconnect();
    prisma = null;
  }
}

export async function post(pathname, body, cookie) {
  const response = await fetch(`${baseUrl}${pathname}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(cookie ? { Cookie: cookie } : {}),
    },
    body: JSON.stringify(body),
  });
  const payload = await response.json();
  const setCookie = response.headers.getSetCookie?.() || [];
  const nextCookie = setCookie.map((entry) => entry.split(";")[0]).join("; ");
  return { response, payload, cookie: nextCookie || cookie, setCookie };
}

export async function send(method, pathname, cookie, body) {
  const response = await fetch(`${baseUrl}${pathname}`, {
    method,
    headers: {
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...(cookie ? { Cookie: cookie } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const payload = await response.json();
  return { response, payload };
}
