import assert from "node:assert/strict";
import { after, before, beforeEach, describe, it } from "node:test";
import {
  post,
  resetDatabase,
  send,
  startTestApp,
  stopTestApp,
} from "./harness.js";

before(async () => {
  await startTestApp();
});

beforeEach(async () => {
  await resetDatabase();
});

after(async () => {
  await stopTestApp();
});

describe("cookie session", { concurrency: false }, () => {
  it("logs in with an httpOnly expiring cookie and no readable token", async () => {
    await post("/api/users/register", {
      fullName: "Session User",
      email: "session.user@example.com",
      phoneNumber: "0712000001",
      password: "secret12",
    });

    const { response, payload, setCookie } = await post("/api/auth/login", {
      email: "session.user@example.com",
      password: "secret12",
    });

    assert.equal(response.status, 200);
    assert.equal(Object.hasOwn(payload, "token"), false);
    assert.equal(Object.hasOwn(payload.data, "password"), false);
    const cookie = setCookie[0] || "";
    assert.match(cookie, /access_token=/);
    assert.match(cookie, /HttpOnly/i);
    assert.match(cookie, /Max-Age=\d+/);
    assert.doesNotMatch(cookie, /Secure/i);
  });

  it("returns the signed-in user from the session endpoint", async () => {
    await post("/api/users/register", {
      fullName: "Session User",
      email: "session.user@example.com",
      phoneNumber: "0712000001",
      password: "secret12",
    });
    const { cookie } = await post("/api/auth/login", {
      email: "session.user@example.com",
      password: "secret12",
    });

    const { response, payload } = await send("GET", "/api/auth/session", cookie);

    assert.equal(response.status, 200);
    assert.equal(payload.data.email, "session.user@example.com");
    assert.equal(payload.data.role, "user");
    assert.equal(Object.hasOwn(payload.data, "password"), false);
  });

  it("rejects a session request without a cookie", async () => {
    const { response } = await send("GET", "/api/auth/session");
    assert.equal(response.status, 401);
  });

  it("uses a secure cross-site cookie in production", async () => {
    const previous = process.env.NODE_ENV;
    process.env.NODE_ENV = "production";
    const { sessionCookieOptions } = await import("../controllers/auth.controllers.js");
    const options = sessionCookieOptions();
    process.env.NODE_ENV = previous;

    assert.equal(options.httpOnly, true);
    assert.equal(options.secure, true);
    assert.equal(options.sameSite, "none");
    assert.equal(options.partitioned, true);
  });

  it("clears the session cookie on logout", async () => {
    await post("/api/users/register", {
      fullName: "Session User",
      email: "session.user@example.com",
      phoneNumber: "0712000001",
      password: "secret12",
    });
    const { cookie } = await post("/api/auth/login", {
      email: "session.user@example.com",
      password: "secret12",
    });

    const loggedOut = await post("/api/auth/logout", {}, cookie);
    const cleared = loggedOut.setCookie[0] || "";
    assert.equal(loggedOut.response.status, 200);
    assert.match(cleared, /access_token=/);
    assert.match(cleared, /HttpOnly/i);

    const session = await send("GET", "/api/auth/session");
    assert.equal(session.response.status, 401);
  });
});
