import assert from "node:assert/strict";
import { after, before, beforeEach, describe, it } from "node:test";
import {
  getPrisma,
  post,
  resetDatabase,
  send,
  startTestApp,
  stopTestApp,
} from "./harness.js";

const userPayload = (suffix, phone) => ({
  fullName: `User ${suffix}`,
  email: `user.${suffix}@example.com`,
  phoneNumber: phone,
  password: "secret12",
});

before(async () => {
  await startTestApp();
});

beforeEach(async () => {
  await resetDatabase();
});

after(async () => {
  await stopTestApp();
});

describe("profile authorization", { concurrency: false }, () => {
  it("lets a user update their own account without returning a password hash", async () => {
    await post("/api/users/register", userPayload("self", "0711000001"));
    const { payload: loginBody, cookie } = await post("/api/auth/login", {
      email: "user.self@example.com",
      password: "secret12",
    });

    const { response, payload } = await send(
      "PATCH",
      `/api/users/update/${loginBody.data.id}`,
      cookie,
      {
        fullName: "Updated Self",
        email: "user.self@example.com",
        phoneNumber: "0711000001",
      },
    );

    assert.equal(response.status, 200);
    assert.equal(payload.data.fullName, "Updated Self");
    assert.equal(Object.hasOwn(payload.data, "password"), false);
  });

  it("rejects an update aimed at another account", async () => {
    await post("/api/users/register", userPayload("one", "0711000002"));
    await post("/api/users/register", userPayload("two", "0711000003"));
    const { cookie } = await post("/api/auth/login", {
      email: "user.one@example.com",
      password: "secret12",
    });
    const other = await getPrisma().user.findUnique({
      where: { email: "user.two@example.com" },
    });

    const { response } = await send(
      "PATCH",
      `/api/users/update/${other.id}`,
      cookie,
      {
        fullName: "Hijacked",
        email: "user.two@example.com",
        phoneNumber: "0711000003",
      },
    );

    assert.equal(response.status, 403);
    const unchanged = await getPrisma().user.findUnique({ where: { id: other.id } });
    assert.equal(unchanged.fullName, "User two");
  });

  it("rejects an unauthenticated profile update", async () => {
    await post("/api/users/register", userPayload("guest", "0711000004"));
    const user = await getPrisma().user.findUnique({
      where: { email: "user.guest@example.com" },
    });

    const { response } = await send("PATCH", `/api/users/update/${user.id}`, null, {
      fullName: "Nope",
      email: "user.guest@example.com",
      phoneNumber: "0711000004",
    });

    assert.equal(response.status, 401);
  });

  it("omits password hashes from the admin user list", async () => {
    await post("/api/users/register", userPayload("listed", "0711000005"));
    await post("/api/users/register", userPayload("admin", "0711000006"));
    await getPrisma().user.update({
      where: { email: "user.admin@example.com" },
      data: { role: "admin" },
    });
    const { cookie } = await post("/api/auth/login", {
      email: "user.admin@example.com",
      password: "secret12",
    });

    const { response, payload } = await send("GET", "/api/users", cookie);

    assert.equal(response.status, 200);
    assert.ok(Array.isArray(payload));
    assert.ok(payload.length >= 1);
    for (const user of payload) {
      assert.equal(Object.hasOwn(user, "password"), false);
    }
  });
});
