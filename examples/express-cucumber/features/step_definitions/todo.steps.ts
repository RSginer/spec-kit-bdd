import assert from "node:assert/strict";
import { Given, Then, When } from "@cucumber/cucumber";
import request from "supertest";
import { createApp } from "../../src/app";
import type { CustomWorld } from "../support/world";

function ensureApp(world: CustomWorld): void {
  world.app ??= createApp({ currentDate: () => world.currentDate });
}

function appFor(world: CustomWorld) {
  ensureApp(world);
  assert.ok(world.app);
  return world.app;
}

function createdTodoPath(world: CustomWorld, path: string): string {
  const id = world.todoIds.values().next().value;
  assert.ok(id, "Expected a created todo");
  return path.replace("{id}", id);
}

function todoIdForTitle(world: CustomWorld, title: string): string {
  const id = world.todoIds.get(title);
  assert.ok(id, `Expected a created todo titled ${title}`);
  return id;
}

function responseTodos(world: CustomWorld): Array<Record<string, unknown>> {
  assert.ok(world.response, "Expected an API response");
  assert.ok(
    Array.isArray(world.response.body),
    "Expected a todo list response",
  );
  return world.response.body as Array<Record<string, unknown>>;
}

function assertTodoFields(
  todo: Record<string, unknown>,
  title: string,
  plannedDate: string,
  completionState: string,
): void {
  assert.deepEqual(todo, {
    id: todo.id,
    title,
    plannedDate,
    completionState,
  });
}

Given(
  "the API client's local date is {string}",
  function (this: CustomWorld, date: string) {
    this.currentDate = new Date(`${date}T00:00:00`);
    this.app = createApp({ currentDate: () => this.currentDate });
  },
);

Given("the API client's todo store is empty", function (this: CustomWorld) {
  this.app = createApp({ currentDate: () => this.currentDate });
  this.todoIds.clear();
});

Given(
  "the API client has created a todo with title {string}, planned date {string}, and completion state {string}",
  async function (
    this: CustomWorld,
    title: string,
    plannedDate: string,
    completionState: string,
  ) {
    const scenarioDate = this.currentDate;
    this.currentDate = new Date(`${plannedDate}T00:00:00`);
    const createResponse = await request(appFor(this))
      .post("/todos")
      .send({ title, plannedDate });
    this.currentDate = scenarioDate;
    assert.equal(createResponse.status, 201);
    const id = createResponse.body.id as string;
    this.todoIds.set(title, id);
    if (completionState === "complete") {
      const completionResponse = await request(appFor(this))
        .patch(`/todos/${id}`)
        .send({ completionState });
      assert.equal(completionResponse.status, 200);
    }
  },
);

Given(
  "the API client PATCHed the created todo at {string} with completion state {string}",
  async function (this: CustomWorld, path: string, completionState: string) {
    this.response = await request(appFor(this))
      .patch(createdTodoPath(this, path))
      .send({ completionState });
  },
);

When(
  "the API client POSTs {string} with title {string} and planned date {string}",
  async function (
    this: CustomWorld,
    path: string,
    title: string,
    plannedDate: string,
  ) {
    this.response = await request(appFor(this))
      .post(path)
      .send({ title, plannedDate });
  },
);

When(
  "the API client GETs {string} for the current week",
  async function (this: CustomWorld, path: string) {
    this.response = await request(appFor(this)).get(path);
  },
);

When(
  "the API client PUTs the created todo at {string} with title {string} and planned date {string}",
  async function (
    this: CustomWorld,
    path: string,
    title: string,
    plannedDate: string,
  ) {
    this.response = await request(appFor(this))
      .put(createdTodoPath(this, path))
      .send({ title, plannedDate });
  },
);

When(
  "the API client PATCHes the created todo at {string} with completion state {string}",
  async function (this: CustomWorld, path: string, completionState: string) {
    this.response = await request(appFor(this))
      .patch(createdTodoPath(this, path))
      .send({ completionState });
  },
);

When(
  "the API client PUTs {string} with title {string} and planned date {string}",
  async function (
    this: CustomWorld,
    path: string,
    title: string,
    plannedDate: string,
  ) {
    this.response = await request(appFor(this))
      .put(path)
      .send({ title, plannedDate });
  },
);

When(
  "the API client DELETEs the todo titled {string} at {string}",
  async function (this: CustomWorld, title: string, path: string) {
    this.response = await request(appFor(this)).delete(
      path.replace("{id}", todoIdForTitle(this, title)),
    );
  },
);

When(
  "the API client DELETEs {string}",
  async function (this: CustomWorld, path: string) {
    this.response = await request(appFor(this)).delete(path);
  },
);

Then(
  "the response body should contain a todo with title {string}, planned date {string}, and completion state {string}",
  function (
    this: CustomWorld,
    title: string,
    plannedDate: string,
    completionState: string,
  ) {
    assert.ok(this.response);
    assertTodoFields(this.response.body, title, plannedDate, completionState);
  },
);

Then(
  "the response body should contain both todos with their titles, planned dates, and completion states",
  function (this: CustomWorld) {
    const todos = responseTodos(this);
    assert.equal(todos.length, 2);
    assert.ok(
      todos.some(
        (todo) =>
          todo.title === "Review pull request" &&
          todo.completionState === "incomplete",
      ),
    );
    assert.ok(
      todos.some(
        (todo) =>
          todo.title === "Submit expense report" &&
          todo.completionState === "complete",
      ),
    );
  },
);

Then(
  "the response body should contain an empty todo list",
  function (this: CustomWorld) {
    assert.deepEqual(responseTodos(this), []);
  },
);

Then(
  "the response body should report an invalid todo title",
  function (this: CustomWorld) {
    assert.deepEqual(this.response?.body, { error: "Invalid todo title" });
  },
);

Then(
  "the response body should contain title {string}, planned date {string}, and completion state {string}",
  function (
    this: CustomWorld,
    title: string,
    plannedDate: string,
    completionState: string,
  ) {
    assert.ok(this.response);
    assertTodoFields(this.response.body, title, plannedDate, completionState);
  },
);

Then(
  "the response body should report completion state {string}",
  function (this: CustomWorld, completionState: string) {
    assert.equal(this.response?.body.completionState, completionState);
  },
);

Then(
  "the response body should report an invalid planned date",
  function (this: CustomWorld) {
    assert.deepEqual(this.response?.body, { error: "Invalid planned date" });
  },
);

Then(
  "the response body should report that the todo was not found",
  function (this: CustomWorld) {
    assert.deepEqual(this.response?.body, { error: "Todo not found" });
  },
);

Then(
  "the response body should still contain the created todo",
  function (this: CustomWorld) {
    const todos = responseTodos(this);
    assert.equal(todos.length, 1);
  },
);

Then(
  "the response body should still contain title {string} and planned date {string}",
  function (this: CustomWorld, title: string, plannedDate: string) {
    const todos = responseTodos(this);
    assert.ok(
      todos.some(
        (todo) => todo.title === title && todo.plannedDate === plannedDate,
      ),
    );
  },
);

Then(
  "the response body should not contain a todo titled {string}",
  function (this: CustomWorld, title: string) {
    assert.ok(!responseTodos(this).some((todo) => todo.title === title));
  },
);

Then(
  "the response body should contain a todo titled {string}",
  function (this: CustomWorld, title: string) {
    assert.ok(responseTodos(this).some((todo) => todo.title === title));
  },
);

Then(
  "the response body should contain both existing todos",
  function (this: CustomWorld) {
    assert.equal(responseTodos(this).length, 2);
  },
);

Then(
  "the response body should contain todos titled {string} and {string}",
  function (this: CustomWorld, firstTitle: string, secondTitle: string) {
    const titles = responseTodos(this).map((todo) => todo.title);
    assert.ok(titles.includes(firstTitle));
    assert.ok(titles.includes(secondTitle));
  },
);
