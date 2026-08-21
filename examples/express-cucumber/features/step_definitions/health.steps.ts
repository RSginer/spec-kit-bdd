import assert from "node:assert/strict";
import { Then, When } from "@cucumber/cucumber";
import request from "supertest";
import { createApp } from "../../src/app";
import type { CustomWorld } from "../support/world";

When("I request the health endpoint", async function (this: CustomWorld) {
  this.response = await request(createApp()).get("/health");
});

Then("the response status should be {int}", function (this: CustomWorld, status: number) {
  assert.equal(this.response?.status, status);
});

Then(
  "the response body should report status {string}",
  function (this: CustomWorld, status: string) {
    assert.deepEqual(this.response?.body, { status });
  },
);
