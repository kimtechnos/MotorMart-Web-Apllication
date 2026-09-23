import assert from "node:assert/strict";
import { after, before, beforeEach, describe, it } from "node:test";
import {
  getPrisma,
  post,
  resetDatabase,
  startTestApp,
  stopTestApp,
} from "./harness.js";

async function createUser(suffix, phone) {
  await post("/api/users/register", {
    fullName: `Inquiry ${suffix}`,
    email: `inquiry.${suffix}@example.com`,
    phoneNumber: phone,
    password: "secret12",
  });
  const login = await post("/api/auth/login", {
    email: `inquiry.${suffix}@example.com`,
    password: "secret12",
  });
  const user = await getPrisma().user.findUnique({
    where: { email: `inquiry.${suffix}@example.com` },
  });
  return { cookie: login.cookie, user };
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

describe("inquiries", { concurrency: false }, () => {
  it("stores an inquiry against the exact vehicle id", async () => {
    const { user } = await createUser("owner", "0715000001");
    const asker = await createUser("asker", "0715000002");
    const older = await getPrisma().car.create({
      data: {
        make: "Toyota",
        model: "Axio",
        year: 2018,
        price: 900000,
        description: "older",
        imageUrl: "http://example.com/old.png",
        ownerId: user.id,
      },
    });
    const newer = await getPrisma().car.create({
      data: {
        make: "Toyota",
        model: "Axio",
        year: 2022,
        price: 1800000,
        description: "newer",
        imageUrl: "http://example.com/new.png",
        ownerId: user.id,
      },
    });

    const { response, payload } = await post(
      "/api/inquiries",
      { carId: newer.id, message: "Is the 2022 model available?" },
      asker.cookie,
    );

    assert.equal(response.status, 201);
    assert.equal(payload.data.carId, newer.id);
    assert.notEqual(payload.data.carId, older.id);
  });

  it("rejects an inquiry for a vehicle that does not exist", async () => {
    const asker = await createUser("missing", "0715000003");
    const { response, payload } = await post(
      "/api/inquiries",
      {
        carId: "00000000-0000-0000-0000-000000000000",
        message: "Still there?",
      },
      asker.cookie,
    );

    assert.equal(response.status, 404);
    assert.equal(payload.message, "Car not found");
  });
});
