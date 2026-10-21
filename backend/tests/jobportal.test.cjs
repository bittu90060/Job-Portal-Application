
const request = require("supertest");
const { describe, it } = require("node:test");
const assert = require("node:assert/strict");

const BASE_URL = "http://localhost:5000";

describe("JobBridge API", () => {
  it("GET /api/jobs responds to requests", async () => {
    const response = await request(BASE_URL).get("/api/jobs");

    assert.equal(response.statusCode, 200);
    assert.ok(response.body !== undefined);
  });
});
