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

before(async () => {
  await startTestApp();
});

beforeEach(async () => {
  await resetDatabase();
});

after(async () => {
  await stopTestApp();
});

describe("vehicle editing", { concurrency: false }, () => {
  it("stores year and price as numbers when an admin edits a vehicle", async () => {
    await post("/api/users/register", {
      fullName: "Editor Admin",
      email: "editor.admin@example.com",
      phoneNumber: "0717000001",
      password: "secret12",
    });
    await getPrisma().user.update({
      where: { email: "editor.admin@example.com" },
      data: { role: "admin" },
    });
    const login = await post("/api/auth/login", {
      email: "editor.admin@example.com",
      password: "secret12",
    });
    const admin = await getPrisma().user.findUnique({
      where: { email: "editor.admin@example.com" },
    });
    const car = await getPrisma().car.create({
      data: {
        make: "Toyota",
        model: "Axio",
        year: 2018,
        price: 900000,
        description: "older",
        imageUrl: "http://example.com/axio.png",
        ownerId: admin.id,
      },
    });

    const { response, payload } = await send(
      "PATCH",
      `/api/cars/${car.id}`,
      login.cookie,
      {
        make: "Toyota",
        model: "Fielder",
        year: "2021",
        price: "1750000.5",
        description: "updated",
        imageUrl: "http://example.com/fielder.png",
      },
    );

    assert.equal(response.status, 200);
    assert.equal(payload.data.model, "Fielder");
    assert.equal(payload.data.year, 2021);
    assert.equal(payload.data.price, 1750000.5);
  });
});
