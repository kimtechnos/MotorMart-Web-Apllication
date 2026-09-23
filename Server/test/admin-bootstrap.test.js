import assert from "node:assert/strict";
import { after, before, beforeEach, describe, it } from "node:test";
import { bootstrapAdmin } from "../prisma/seed.js";
import { getPrisma, post, resetDatabase, startTestApp, stopTestApp } from "./harness.js";

before(async () => {
  await startTestApp();
});

beforeEach(async () => {
  await resetDatabase();
  delete process.env.ADMIN_EMAIL;
  delete process.env.ADMIN_PASSWORD;
  delete process.env.ADMIN_PHONE;
  delete process.env.ADMIN_FULL_NAME;
});

after(async () => {
  await stopTestApp();
});

describe("admin bootstrap", { concurrency: false }, () => {
  it("keeps public registration from creating an admin", async () => {
    const { response } = await post("/api/users/register", {
      fullName: "Hopeful Admin",
      email: "hopeful.admin@example.com",
      phoneNumber: "0713000002",
      password: "secret12",
      role: "admin",
    });

    assert.equal(response.status, 201);
    const user = await getPrisma().user.findUnique({
      where: { email: "hopeful.admin@example.com" },
    });
    assert.equal(user.role, "user");
  });

  it("creates or updates a single bootstrap admin from the environment", async () => {
    process.env.ADMIN_EMAIL = "bootstrap.admin@example.com";
    process.env.ADMIN_PASSWORD = "secret12";
    process.env.ADMIN_PHONE = "0713000001";
    process.env.ADMIN_FULL_NAME = "Bootstrap Admin";

    await bootstrapAdmin(getPrisma());
    await bootstrapAdmin(getPrisma());

    const admins = await getPrisma().user.findMany({
      where: { email: "bootstrap.admin@example.com" },
    });
    assert.equal(admins.length, 1);
    assert.equal(admins[0].role, "admin");
    assert.equal(admins[0].fullName, "Bootstrap Admin");
  });

  it("refuses to bootstrap without the required environment values", async () => {
    await assert.rejects(() => bootstrapAdmin(getPrisma()), /ADMIN_EMAIL/);
  });
});
