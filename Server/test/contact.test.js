import assert from "node:assert/strict";
import { after, before, beforeEach, describe, it } from "node:test";
import {
  getPrisma,
  post,
  resetDatabase,
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

describe("contact messages", { concurrency: false }, () => {
  it("stores a public contact message without returning the stored record", async () => {
    const { response, payload } = await post("/api/contact", {
      name: "Amina Otieno",
      email: "amina@example.com",
      subject: "Viewing",
      message: "Can I see the Axio on Saturday?",
    });

    assert.equal(response.status, 201);
    assert.equal(payload.message, "Message sent successfully");
    assert.equal(payload.data, undefined);

    const stored = await getPrisma().contactMessage.findMany();
    assert.equal(stored.length, 1);
    assert.equal(stored[0].email, "amina@example.com");
  });

  it("rejects a contact message that is missing a name", async () => {
    const { response, payload } = await post("/api/contact", {
      email: "amina@example.com",
      message: "Hello",
    });

    assert.equal(response.status, 400);
    assert.equal(payload.message, "Name, email, and message are required");
  });
});
