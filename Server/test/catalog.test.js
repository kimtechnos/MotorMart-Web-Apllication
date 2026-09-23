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

describe("public catalog", { concurrency: false }, () => {
  it("returns every vehicle when no filters are provided", async () => {
    await post("/api/users/register", {
      fullName: "Catalog Owner",
      email: "catalog.owner@example.com",
      phoneNumber: "0716000001",
      password: "secret12",
    });
    const owner = await getPrisma().user.findUnique({
      where: { email: "catalog.owner@example.com" },
    });
    await getPrisma().car.createMany({
      data: [
        {
          make: "Toyota",
          model: "Axio",
          year: 2020,
          price: 1500000,
          description: "clean",
          imageUrl: "http://example.com/axio.png",
          ownerId: owner.id,
        },
        {
          make: "Nissan",
          model: "Note",
          year: 2019,
          price: 900000,
          description: "compact",
          imageUrl: "http://example.com/note.png",
          ownerId: owner.id,
        },
      ],
    });

    const { response, payload } = await send("GET", "/api/cars");

    assert.equal(response.status, 200);
    assert.equal(payload.length, 2);
  });

  it("returns only vehicles matching make and maximum price", async () => {
    await post("/api/users/register", {
      fullName: "Catalog Owner",
      email: "catalog.owner@example.com",
      phoneNumber: "0716000001",
      password: "secret12",
    });
    const owner = await getPrisma().user.findUnique({
      where: { email: "catalog.owner@example.com" },
    });
    await getPrisma().car.createMany({
      data: [
        {
          make: "Toyota",
          model: "Axio",
          year: 2020,
          price: 1500000,
          description: "clean",
          imageUrl: "http://example.com/axio.png",
          ownerId: owner.id,
        },
        {
          make: "Toyota",
          model: "Land Cruiser",
          year: 2021,
          price: 8000000,
          description: "large",
          imageUrl: "http://example.com/lc.png",
          ownerId: owner.id,
        },
      ],
    });

    const { response, payload } = await send(
      "GET",
      "/api/cars?make=toyota&maxPrice=2000000",
    );

    assert.equal(response.status, 200);
    assert.equal(payload.length, 1);
    assert.equal(payload[0].model, "Axio");
  });

  it("returns one vehicle by id and a clean miss for an unknown id", async () => {
    await post("/api/users/register", {
      fullName: "Catalog Owner",
      email: "catalog.owner@example.com",
      phoneNumber: "0716000001",
      password: "secret12",
    });
    const owner = await getPrisma().user.findUnique({
      where: { email: "catalog.owner@example.com" },
    });
    const car = await getPrisma().car.create({
      data: {
        make: "Toyota",
        model: "Axio",
        year: 2020,
        price: 1500000,
        description: "clean",
        imageUrl: "http://example.com/axio.png",
        ownerId: owner.id,
      },
    });

    const found = await send("GET", `/api/cars/${car.id}`);
    assert.equal(found.response.status, 200);
    assert.equal(found.payload.model, "Axio");

    const missing = await send(
      "GET",
      "/api/cars/00000000-0000-0000-0000-000000000000",
    );
    assert.equal(missing.response.status, 404);
    assert.equal(missing.payload.message, "Car not found");
  });
});
