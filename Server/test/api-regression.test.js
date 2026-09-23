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

const carBody = {
  make: "Mazda",
  model: "Demio",
  year: 2017,
  price: 780000,
  description: "compact hatch",
  imageUrl: "http://example.com/demio.png",
};

async function registerAndLogin(email, phone, role) {
  await post("/api/users/register", {
    fullName: "Regression User",
    email,
    phoneNumber: phone,
    password: "secret12",
    role: "admin",
  });
  if (role) {
    await getPrisma().user.update({ where: { email }, data: { role } });
  }
  const login = await post("/api/auth/login", { email, password: "secret12" });
  return login;
}

before(async () => {
  await startTestApp();
});

beforeEach(async () => {
  await resetDatabase();
});

after(async () => {
  await stopTestApp();
});

describe("API regression", { concurrency: false }, () => {
  it("registers a normal user and rejects a bad password", async () => {
    const registered = await post("/api/users/register", {
      fullName: "New Driver",
      email: "new.driver@example.com",
      phoneNumber: "0719000101",
      password: "secret12",
      role: "admin",
    });

    assert.equal(registered.response.status, 201);
    assert.equal(registered.payload.success, true);
    assert.equal(Object.hasOwn(registered.payload, "password"), false);
    const stored = await getPrisma().user.findUnique({
      where: { email: "new.driver@example.com" },
    });
    assert.equal(stored.role, "user");

    const badLogin = await post("/api/auth/login", {
      email: "new.driver@example.com",
      password: "wrong-password",
    });
    assert.equal(badLogin.response.status, 400);
    assert.equal(badLogin.payload.message, "Invalid login credentials");
  });

  it("keeps guests and ordinary users out of admin vehicle changes", async () => {
    const guest = await send("POST", "/api/cars/add", null, carBody);
    assert.equal(guest.response.status, 401);

    const user = await registerAndLogin("driver.one@example.com", "0719000102");
    const forbidden = await send("POST", "/api/cars/add", user.cookie, carBody);
    assert.equal(forbidden.response.status, 403);

    const inquiries = await send("GET", "/api/inquiries", user.cookie);
    assert.equal(inquiries.response.status, 403);
  });

  it("lets an admin add and delete a vehicle", async () => {
    const admin = await registerAndLogin(
      "fleet.admin@example.com",
      "0719000103",
      "admin",
    );

    const created = await send("POST", "/api/cars/add", admin.cookie, carBody);
    assert.equal(created.response.status, 201);

    const listed = await send("GET", "/api/cars?make=Mazda");
    assert.equal(listed.response.status, 200);
    assert.equal(listed.payload.length, 1);
    const carId = listed.payload[0].id;

    const removed = await send("DELETE", `/api/cars/${carId}`, admin.cookie);
    assert.equal(removed.response.status, 200);

    const missing = await send("GET", `/api/cars/${carId}`);
    assert.equal(missing.response.status, 404);
  });
});
