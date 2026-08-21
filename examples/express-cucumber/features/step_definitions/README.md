# Step Definitions

**Detected framework:** TypeScript with `@cucumber/cucumber` (Cucumber.js)

## Running scenarios

- Cucumber.js: `npm test`

## What to implement

The todo steps in `todo.steps.ts` exercise the REST API through SuperTest. Keep
each step focused on:

1. The corresponding REST API request or test-state setup
2. An assertion verifying the expected HTTP response or response body

The existing health definitions in `health.steps.ts` already implement the shared
response-status assertion. Implement one todo step at a time and rerun `npm test`
after each step.
