# Implementation Plan: Weekly Todo CRUD

**Branch**: `001-weekly-todo-crud` | **Date**: 2026-08-21 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/001-weekly-todo-crud/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command; its definition describes the execution workflow.

## Summary

Add a REST API for one user's weekly todos. The API will expose create, list,
update, completion-state, and delete operations backed by a small in-memory
service owned by each application instance. The service will calculate the
Monday-through-Sunday range from an injectable current-date function so the
acceptance scenarios can use deterministic dates without coupling production
code to test data.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript 5.9 targeting Node.js ES2022

**Primary Dependencies**: Express 5; existing `@cucumber/cucumber` and SuperTest
for acceptance testing

**Storage**: In-memory collection scoped to an application instance; no durable
storage is required for this example feature

**Testing**: Cucumber.js with TypeScript step definitions and SuperTest; `npm
test`; TypeScript compiler via `npm run build`

**Target Platform**: Node.js service

**Project Type**: Web service

**Performance Goals**: Typical CRUD requests complete within 200 ms at the
feature's single-user example scale

**Constraints**: Validate titles and planned dates at the API boundary; keep
application construction independent from process listening; do not add
authentication, collaboration, recurring tasks, or durable persistence

**Scale/Scope**: One user and a modest weekly todo collection in a single
application instance

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

*GATE: PASS*

- **Behavior-First Delivery**: The specification and REST-oriented Cucumber
  scenarios exist before implementation.
- **Small Application Boundary**: The plan keeps routes and storage behind
  `createApp`; `server.ts` remains responsible only for listening.
- **Testable Contracts**: Each public operation has success and failure scenarios
  in the feature files.
- **Integration at the HTTP Boundary**: Step definitions will use SuperTest
  against the assembled application.
- **Minimal, Explicit Change**: In-memory storage and a focused service avoid a
  database, repository abstraction, or unrelated configuration.

## Project Structure

### Documentation (this feature)

```text
specs/001-weekly-todo-crud/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
src/
├── app.ts
├── server.ts
├── models/
│   └── todo.ts
├── routes/
│   └── todos.ts
└── services/
  └── todo-service.ts

features/
├── weekly-todo-capture.feature
├── weekly-todo-maintenance.feature
├── weekly-todo-removal.feature
└── step_definitions/
  └── todo.steps.ts
```

**Structure Decision**: Extend the existing single-project Express service with
one todo model, one in-memory service, and one route module. Keep acceptance
steps under the existing `features/step_definitions` directory and continue to
construct the service through `createApp`.

## Complexity Tracking

No violations. Complexity tracking is not required.

## Constitution Check (Post-Design)

*GATE: PASS*

The design keeps the REST contract and Cucumber scenarios as the public behavior
source, places weekly validation in one small service, keeps all state scoped to
`createApp`, and adds no persistence or unrelated dependencies. The planned
acceptance tests exercise the assembled HTTP application, and the implementation
can be validated with `npm test` and `npm run build`.
