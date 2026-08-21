---

description: "Implementation tasks for the weekly todo REST API"
---

# Tasks: Weekly Todo CRUD

**Input**: Design documents from `specs/001-weekly-todo-crud/`

**Prerequisites**: [plan.md](plan.md), [spec.md](spec.md), [research.md](research.md), [data-model.md](data-model.md), [contracts/todos-api.md](contracts/todos-api.md), and [quickstart.md](quickstart.md)

**Tests**: The executable Cucumber scenarios and step-definition stubs already
exist. Separate test-file tasks are not added; implementation tasks include
replacing the pending REST step bodies and running the acceptance suite.

**Organization**: Tasks are grouped by user story so each story can be completed
and validated as an incremental REST API slice.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Establish the source and test-support locations required by all
weekly todo stories.

- [ ] T001 Create the planned source directories and module files at `src/models/todo.ts`, `src/services/todo-service.ts`, and `src/routes/todos.ts`.
- [ ] T002 Extend the Cucumber world in `features/support/world.ts` with the application client state and created-todo identifiers needed by REST step definitions.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Build the shared domain and routing boundaries before any user story
implementation.

**Checkpoint**: The application can construct an isolated todo service and mount
its `/todos` router without opening a listening socket.

- [ ] T003 Define the `Todo`, `CompletionState`, and todo request/response types in `src/models/todo.ts`.
- [ ] T004 Implement shared title, ISO-date, completion-state, and Monday-to-Sunday week validation in `src/services/todo-service.ts`.
- [ ] T005 Create the `/todos` Express router and JSON error-response helpers in `src/routes/todos.ts`.
- [ ] T006 Mount the `/todos` router from the application factory in `src/app.ts` while keeping process listening in `src/server.ts`.

---

## Phase 3: User Story 1 - Capture and Review Weekly Todos (Priority: P1) 🎯 MVP

**Goal**: Allow the API client to create valid weekly todos and list all todos
whose planned dates fall in the current local week.

**Independent Test**: Run the capture feature scenarios in
`features/weekly-todo-capture.feature`; valid creates return `201`, current-week
lists return `200`, and invalid titles or dates return `400` without mutation.

### Implementation for User Story 1

- [ ] T007 [US1] Implement application-scoped create and current-week list operations in `src/services/todo-service.ts`, including unique IDs and default `incomplete` state.
- [ ] T008 [US1] Implement `POST /todos` and `GET /todos` handlers in `src/routes/todos.ts` using the service and contract response shapes.
- [ ] T009 [US1] Replace the capture-related pending steps with SuperTest requests and response assertions in `features/step_definitions/todo.steps.ts`.
- [ ] T010 [US1] Run the User Story 1 scenarios in `features/weekly-todo-capture.feature` and correct any implementation or step-definition defects in `src/services/todo-service.ts`, `src/routes/todos.ts`, and `features/step_definitions/todo.steps.ts`.

**Checkpoint**: User Story 1 is independently functional and demonstrates the
MVP create/list workflow.

---

## Phase 4: User Story 2 - Maintain Todo Details (Priority: P2)

**Goal**: Allow the API client to update a weekly todo's title and planned date,
and transition its completion state in either direction.

**Independent Test**: Run the maintenance scenarios in
`features/weekly-todo-maintenance.feature`; valid changes return `200`, invalid
weekly dates return `400` without mutation, and unknown IDs return `404`.

### Implementation for User Story 2

- [ ] T011 [US2] Add title/planned-date update and completion-state transition operations to `src/services/todo-service.ts` without changing the existing create/list behavior.
- [ ] T012 [US2] Implement `PUT /todos/:id` and `PATCH /todos/:id` handlers in `src/routes/todos.ts` with `200`, `400`, and `404` contract responses.
- [ ] T013 [US2] Replace the maintenance-related pending steps with SuperTest requests, created-ID tracking, and response assertions in `features/step_definitions/todo.steps.ts`.
- [ ] T014 [US2] Run the User Story 2 scenarios in `features/weekly-todo-maintenance.feature` and correct defects in `src/services/todo-service.ts`, `src/routes/todos.ts`, and `features/step_definitions/todo.steps.ts`.

**Checkpoint**: User Stories 1 and 2 both remain independently functional.

---

## Phase 5: User Story 3 - Remove Unneeded Todos (Priority: P3)

**Goal**: Allow the API client to delete an existing todo while preserving other
weekly todos and returning `404` for unknown IDs.

**Independent Test**: Run the removal scenarios in
`features/weekly-todo-removal.feature`; existing deletions return `204`, unknown
IDs return `404`, and the subsequent current-week list preserves the right data.

### Implementation for User Story 3

- [ ] T015 [US3] Add delete-by-ID behavior to `src/services/todo-service.ts` that removes only an existing todo and reports unknown IDs without mutation.
- [ ] T016 [US3] Implement `DELETE /todos/:id` in `src/routes/todos.ts` with `204 No Content` and `404 Not Found` responses.
- [ ] T017 [US3] Replace the removal-related pending steps with SuperTest requests and response assertions in `features/step_definitions/todo.steps.ts`.
- [ ] T018 [US3] Run the User Story 3 scenarios in `features/weekly-todo-removal.feature` and correct defects in `src/services/todo-service.ts`, `src/routes/todos.ts`, and `features/step_definitions/todo.steps.ts`.

**Checkpoint**: All three user stories are independently functional and the full
weekly todo CRUD contract is covered.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Validate the complete feature and keep the design artifacts aligned
with the delivered behavior.

- [ ] T019 [P] Run `npm run build` and resolve TypeScript errors in `src/` and `features/`.
- [ ] T020 [P] Run `npm test` and confirm all existing health and weekly todo scenarios pass.
- [ ] T021 [P] Run the commands and REST smoke checks in `specs/001-weekly-todo-crud/quickstart.md` and update `specs/001-weekly-todo-crud/contracts/todos-api.md` only if the implemented response contract differs.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; creates the planned module locations and
  shared Cucumber state.
- **Foundational (Phase 2)**: Depends on Setup; blocks all user stories until
  the model, validation, router, and app boundary exist.
- **User Story 1 (Phase 3)**: Depends on Foundational and delivers the MVP.
- **User Story 2 (Phase 4)**: Depends on User Story 1's service and route wiring,
  but its scenarios validate the update behavior independently.
- **User Story 3 (Phase 5)**: Depends on User Story 1's list/service foundation;
  it can be implemented after or alongside User Story 2 if file ownership is
  coordinated.
- **Polish (Phase 6)**: Depends on all desired user stories being complete.

### User Story Dependencies

- **US1 (P1)**: Depends on Phase 2 only; no other story dependency.
- **US2 (P2)**: Depends on the shared service and router from Phase 2 and the
  todo identifiers/list behavior established by US1.
- **US3 (P3)**: Depends on the shared service and router from Phase 2 and the
  todo identifiers/list behavior established by US1.

### Parallel Opportunities

- T001 and T002 can run in parallel because they touch separate source/test
  support locations.
- T003 and T005 can begin in parallel because the model types and router shell
  are separate files; T004 follows the model types.
- After the foundational phase, US2 and US3 can be assigned to separate
  developers if edits to `src/routes/todos.ts`, `src/services/todo-service.ts`,
  and `features/step_definitions/todo.steps.ts` are coordinated.
- T019 and T020 can run in parallel after implementation; T021 follows their
  results for documentation alignment.

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 and Phase 2.
2. Complete Phase 3 for create and current-week list behavior.
3. Run `features/weekly-todo-capture.feature` independently.
4. Stop at the US1 checkpoint for an MVP demonstration.

### Incremental Delivery

1. Add User Story 2 for editing and completion transitions.
2. Run the maintenance feature independently while preserving US1 behavior.
3. Add User Story 3 for deletion and unknown-ID handling.
4. Run all feature files, then complete the quickstart validation.

## Notes

- Every task has a checkbox, sequential ID, required story label where applicable,
  and at least one concrete file path.
- `[P]` marks tasks that can run concurrently without depending on incomplete
  work in the same files.
- The existing Gherkin scenarios are the acceptance tests; pending step bodies
  become executable SuperTest integration steps during implementation.
