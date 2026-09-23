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

async function registerAndPromoteAdmin() {
  await post("/api/users/register", {
    fullName: "Delete Admin",
    email: "delete.admin@example.com",
    phoneNumber: "0714000001",
    password: "secret12",
  });
  await getPrisma().user.update({
    where: { email: "delete.admin@example.com" },
    data: { role: "admin" },
  });
  const login = await post("/api/auth/login", {
    email: "delete.admin@example.com",
    password: "secret12",
  });
  return login.cookie;
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

describe("user deletion", { concurrency: false }, () => {
  it("deletes an account that has no cars or inquiries", async () => {
    const cookie = await registerAndPromoteAdmin();
    await post("/api/users/register", {
      fullName: "Plain User",
      email: "plain.user@example.com",
      phoneNumber: "0714000002",
      password: "secret12",
    });
    const user = await getPrisma().user.findUnique({
      where: { email: "plain.user@example.com" },
    });

    const { response, payload } = await send(
      "DELETE",
      `/api/users/${user.id}`,
      cookie,
    );

    assert.equal(response.status, 200);
    assert.equal(payload.email, "plain.user@example.com");
    assert.equal(Object.hasOwn(payload, "password"), false);
    const remaining = await getPrisma().user.findUnique({ where: { id: user.id } });
    assert.equal(remaining, null);
  });

  it("returns 409 when inquiries still reference the account", async () => {
    const cookie = await registerAndPromoteAdmin();
    await post("/api/users/register", {
      fullName: "Car Owner",
      email: "car.owner@example.com",
      phoneNumber: "0714000003",
      password: "secret12",
    });
    await post("/api/users/register", {
      fullName: "Inquirer",
      email: "inquirer.user@example.com",
      phoneNumber: "0714000004",
      password: "secret12",
    });
    const owner = await getPrisma().user.findUnique({
      where: { email: "car.owner@example.com" },
    });
    const inquirer = await getPrisma().user.findUnique({
      where: { email: "inquirer.user@example.com" },
    });
    const car = await getPrisma().car.create({
      data: {
        make: "Toyota",
        model: "Axio",
        year: 2020,
        price: 1500000,
        description: "clean",
        imageUrl: "http://example.com/car.png",
        ownerId: owner.id,
      },
    });
    await getPrisma().inquiry.create({
      data: { userId: inquirer.id, carId: car.id, message: "available?" },
    });

    const { response, payload } = await send(
      "DELETE",
      `/api/users/${inquirer.id}`,
      cookie,
    );

    assert.equal(response.status, 409);
    assert.equal(payload.success, false);
    assert.equal(payload.message.includes("prisma"), false);
    const stillThere = await getPrisma().user.findUnique({
      where: { id: inquirer.id },
    });
    assert.equal(stillThere.email, "inquirer.user@example.com");
  });
});
