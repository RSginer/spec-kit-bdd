# Step Definitions

**Detected framework:** `@amiceli/vitest-cucumber` (already a devDependency in `package.json`), not the generic `@cucumber/cucumber` — this project runs Gherkin scenarios directly through Vitest via `describeFeature`/`Scenario` blocks rather than a global step registry.

## Running scenarios

```
npm test
```

`vitest.config.ts` already scopes test discovery to `features/step_definitions/**/*.steps.{ts,tsx}`, so no extra config is needed. Run a single feature with `npx vitest run features/step_definitions/add-task.steps.ts`.

## What to implement

Each `Given`/`When`/`Then`/`And` stub currently `throw`s a `Pending: ...` error — this is the ATDD "red" state: the scenarios exist and fail before any application code is written. Replace each `throw` with:

1. Application interaction — render `<TodoApp />` (from `../../src/TodoApp`) with React Testing Library and drive it with `userEvent`.
2. An assertion (`screen.getByText`, `expect(...).toHaveClass(...)`, etc.) verifying the expected outcome.

Steps within the same `Scenario`/`Background` block share closure scope, so introduce a local variable (e.g. a rendered `view`, or a `userEvent.setup()` instance) at the top of each `describeFeature` callback and set it in a `Given`/`When` step for later steps to read — see the `vitest-cucumber` docs on [Background](https://vitest-cucumber.miceli.click/features/background) and [Structure hooks](https://vitest-cucumber.miceli.click/features/structure-context) for patterns.

The `Then the weekly task list shows tasks in this order:` step in `view-weekly-tasks.steps.ts` receives the Gherkin data table as its second argument (`table: { task: string }[]`) — see [DataTables](https://vitest-cucumber.miceli.click/features/data-tables).

`Scenario Outline` steps keep the literal `<placeholder>` tokens in their step text (matching this project's own `npx @amiceli/vitest-cucumber` generator output) — `vitest-cucumber` substitutes the Examples table values automatically when matching against the scenario's actual step text.

Implement one step at a time, re-running the suite after each.
