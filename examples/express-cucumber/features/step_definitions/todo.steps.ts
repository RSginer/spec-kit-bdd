import { Given, Then, When } from "@cucumber/cucumber";
import type { CustomWorld } from "../support/world";

function pendingStep(description: string): never {
  throw new Error(`Pending: ${description}`);
}

Given(
  "the API client's local date is {string}",
  function (this: CustomWorld, date: string) {
    pendingStep(`set the API client's local date to ${date}`);
  },
);

Given("the API client's todo store is empty", function (this: CustomWorld) {
  pendingStep("reset the todo store");
});

Given(
  "the API client has created a todo with title {string}, planned date {string}, and completion state {string}",
  function (
    this: CustomWorld,
    title: string,
    plannedDate: string,
    completionState: string,
  ) {
    pendingStep(
      `create fixture todo ${title} for ${plannedDate} as ${completionState}`,
    );
  },
);

Given(
  "the API client PATCHed the created todo at {string} with completion state {string}",
  function (this: CustomWorld, path: string, completionState: string) {
    pendingStep(`PATCH ${path} with completion state ${completionState}`);
  },
);

When(
  "the API client POSTs {string} with title {string} and planned date {string}",
  function (
    this: CustomWorld,
    path: string,
    title: string,
    plannedDate: string,
  ) {
    pendingStep(`POST ${path} with ${title} for ${plannedDate}`);
  },
);

When(
  "the API client GETs {string} for the current week",
  function (this: CustomWorld, path: string) {
    pendingStep(`GET ${path} for the current week`);
  },
);

When(
  "the API client PUTs the created todo at {string} with title {string} and planned date {string}",
  function (
    this: CustomWorld,
    path: string,
    title: string,
    plannedDate: string,
  ) {
    pendingStep(`PUT ${path} with ${title} for ${plannedDate}`);
  },
);

When(
  "the API client PATCHes the created todo at {string} with completion state {string}",
  function (this: CustomWorld, path: string, completionState: string) {
    pendingStep(`PATCH ${path} with completion state ${completionState}`);
  },
);

When(
  "the API client PUTs {string} with title {string} and planned date {string}",
  function (
    this: CustomWorld,
    path: string,
    title: string,
    plannedDate: string,
  ) {
    pendingStep(`PUT ${path} with ${title} for ${plannedDate}`);
  },
);

When(
  "the API client DELETEs the todo titled {string} at {string}",
  function (this: CustomWorld, title: string, path: string) {
    pendingStep(`DELETE ${path} for todo ${title}`);
  },
);

When(
  "the API client DELETEs {string}",
  function (this: CustomWorld, path: string) {
    pendingStep(`DELETE ${path}`);
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
    pendingStep(
      `assert todo ${title} for ${plannedDate} is ${completionState}`,
    );
  },
);

Then(
  "the response body should contain both todos with their titles, planned dates, and completion states",
  function (this: CustomWorld) {
    pendingStep("assert both todos and their fields");
  },
);

Then(
  "the response body should contain an empty todo list",
  function (this: CustomWorld) {
    pendingStep("assert the response contains no todos");
  },
);

Then(
  "the response body should report an invalid todo title",
  function (this: CustomWorld) {
    pendingStep("assert the invalid title error");
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
    pendingStep(
      `assert todo ${title} for ${plannedDate} is ${completionState}`,
    );
  },
);

Then(
  "the response body should report completion state {string}",
  function (this: CustomWorld, completionState: string) {
    pendingStep(`assert completion state ${completionState}`);
  },
);

Then(
  "the response body should report an invalid planned date",
  function (this: CustomWorld) {
    pendingStep("assert the invalid planned date error");
  },
);

Then(
  "the response body should report that the todo was not found",
  function (this: CustomWorld) {
    pendingStep("assert the todo not found error");
  },
);

Then(
  "the response body should still contain the created todo",
  function (this: CustomWorld) {
    pendingStep("assert the created todo remains");
  },
);

Then(
  "the response body should still contain title {string} and planned date {string}",
  function (this: CustomWorld, title: string, plannedDate: string) {
    pendingStep(`assert todo ${title} for ${plannedDate} remains unchanged`);
  },
);

Then(
  "the response body should not contain a todo titled {string}",
  function (this: CustomWorld, title: string) {
    pendingStep(`assert todo ${title} is absent`);
  },
);

Then(
  "the response body should contain a todo titled {string}",
  function (this: CustomWorld, title: string) {
    pendingStep(`assert todo ${title} is present`);
  },
);

Then(
  "the response body should contain both existing todos",
  function (this: CustomWorld) {
    pendingStep("assert both existing todos remain");
  },
);

Then(
  "the response body should contain todos titled {string} and {string}",
  function (this: CustomWorld, firstTitle: string, secondTitle: string) {
    pendingStep(`assert todos ${firstTitle} and ${secondTitle} are present`);
  },
);
