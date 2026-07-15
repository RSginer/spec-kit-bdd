---

description: "Task list template for feature implementation"
---

# Tasks: Weekly Task List

**Input**: Design documents from `specs/001-weekly-task-list/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/ui-contract.md, quickstart.md

**Tests**: The three `.feature` files and their `vitest-cucumber` step-definition stubs already
exist (`speckit.bdd.scaffold` ran ahead of this plan) — all 81 steps currently `throw` a
`Pending: ...` error, which is the required Red state (constitution Principle II, NON-NEGOTIABLE).
No new test-writing tasks are generated here; instead, each user-story phase ends with a task that
*fills in* that story's existing step file (interaction + assertion) once the component/logic it
drives against exists, then a task that runs it and confirms Green.

**Organization**: Tasks are grouped by user story (spec.md priorities P1/P2/P3) to enable
independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- File paths are relative to `examples/vitest-react-todo/`

## Path Conventions

Single frontend project (per plan.md Structure Decision): `src/` and `features/` at the project
root — no `backend/`/`frontend/` split, no `tests/` directory (BDD scenarios under
`features/step_definitions/` are the test suite).

---

## Phase 1: Setup

**Purpose**: Confirm the existing scaffold's starting state before any implementation.

- [ ] T001 Run `npm install` in `examples/vitest-react-todo/` to confirm dependencies resolve (no new dependencies needed — stack is fixed by the constitution's Additional Constraints)
- [ ] T002 [P] Run `npx tsc --noEmit` (must pass) and `npm test` (must show 81/81 failing with `Pending: ...` errors) to confirm the Red baseline before implementation begins

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared `Task` type, pure filter/sort helpers, and base rendering used by all three
user stories (every feature file asserts "the weekly task list shows/does not show ...").

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T003 Define the `Task` type and pure helpers `getWeekRange(today)`, `isDueThisWeek(task, range)`, `sortByDueDate(tasks)` in `src/task.ts`, per `data-model.md` and `research.md` §2 & §4
- [ ] T004 In `src/TodoApp.tsx`: add an `initialTasks?: Task[]` prop (deterministic test seeding — used by the `Given a task "..." due "..."` background steps in `view-weekly-tasks.feature` and `mark-task-complete.feature`), `useState<Task[]>(initialTasks ?? [])` task state, and render the weekly list container (`<ul aria-label="Weekly task list">` with one `<li role="listitem">` per task showing its title) from `sortByDueDate(tasks.filter(t => isDueThisWeek(t, getWeekRange(new Date()))))` — depends on T003

**Checkpoint**: Foundation ready — user story implementation can now begin.

---

## Phase 3: User Story 1 - View tasks due this week (Priority: P1) 🎯 MVP

**Goal**: The weekly list shows only tasks due Monday–Sunday of the current week, ordered
earliest-first, flags a task due today, and shows a message when the list is empty.

**Independent Test**: `render(<TodoApp initialTasks={[...]} />)` with tasks inside/outside/on the
week boundary (using `vi.setSystemTime` to control "today"), and assert per
`features/view-weekly-tasks.feature` — no dependency on US2 or US3.

- [ ] T005 [US1] Implement `isDueToday(task, today)` in `src/task.ts` and render a "Due today" indicator inside each task row in `src/TodoApp.tsx` when true, per `contracts/ui-contract.md` — depends on T004
- [ ] T006 [US1] Render "No tasks due this week" in `src/TodoApp.tsx` in place of the list when the filtered weekly list is empty, per `contracts/ui-contract.md` — depends on T004
- [ ] T007 [US1] Implement the failing steps in `features/step_definitions/view-weekly-tasks.steps.ts` — seed tasks via the `initialTasks` prop, freeze "today" via `vi.setSystemTime`, assert via the `screen`/`within` queries defined in `contracts/ui-contract.md` — replace every `throw new Error('Pending: ...')` — depends on T005, T006
- [ ] T008 [US1] Run `npx vitest run features/step_definitions/view-weekly-tasks.steps.ts` and confirm all steps pass — depends on T007

**Checkpoint**: User Story 1 is fully functional and independently testable — this is the MVP.

---

## Phase 4: User Story 2 - Add a task with a due date (Priority: P2)

**Goal**: A user can add a task (title + due date); invalid submissions are rejected with a
validation message and no state change; valid ones appear in the weekly list built in US1.

**Independent Test**: `render(<TodoApp />)`, drive the add-task form via `userEvent`, assert per
`features/add-task.feature`. Relies on US1's list rendering to observe results (per spec.md's
stated story dependency), but adds no new dependency on US3.

- [ ] T009 [US2] Add the add-task form (labelled "Title" input, labelled "Due date" input, "Add task" submit button) to `src/TodoApp.tsx`, per `contracts/ui-contract.md` — depends on T004
- [ ] T010 [US2] Implement client-side validation in the submit handler — non-empty trimmed title, non-empty due date — rendering "Title is required" / "Due date is required" and leaving task state unchanged on failure, per `data-model.md` Validation summary — depends on T009
- [ ] T011 [US2] On successful validation, append a new `Task` (`id: crypto.randomUUID()`, `completed: false`) to state in `src/TodoApp.tsx` — depends on T010
- [ ] T012 [US2] Implement the failing steps in `features/step_definitions/add-task.steps.ts` — drive the form via `userEvent`, assert via `contracts/ui-contract.md` queries — replace every `throw new Error('Pending: ...')` — depends on T011
- [ ] T013 [US2] Run `npx vitest run features/step_definitions/add-task.steps.ts` and confirm all steps pass — depends on T012

**Checkpoint**: User Stories 1 AND 2 both work independently.

---

## Phase 5: User Story 3 - Mark a task complete (Priority: P3)

**Goal**: A user can toggle a task's completion state from the weekly list; the task remains
visible in the list either way.

**Independent Test**: `render(<TodoApp initialTasks={[...]} />)`, toggle via `userEvent`, assert
per `features/mark-task-complete.feature` — no dependency on US2 (uses `initialTasks` seeding from
Foundational, same as US1).

- [ ] T014 [US3] Add a completion checkbox (`role="checkbox"`, accessible name = task title, `checked` bound to `task.completed`) to each task row in `src/TodoApp.tsx`, per `contracts/ui-contract.md` — depends on T004
- [ ] T015 [US3] Wire the checkbox's change handler to toggle that task's `completed` field by `id` in `src/TodoApp.tsx` state — depends on T014
- [ ] T016 [US3] Implement the failing steps in `features/step_definitions/mark-task-complete.steps.ts` — seed via `initialTasks`, toggle via `userEvent.click`, assert checkbox state via `contracts/ui-contract.md` queries — replace every `throw new Error('Pending: ...')` — depends on T015
- [ ] T017 [US3] Run `npx vitest run features/step_definitions/mark-task-complete.steps.ts` and confirm all steps pass — depends on T016

**Checkpoint**: All three user stories are independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Whole-suite verification once all three stories are implemented.

- [ ] T018 [P] Run `npx tsc --noEmit` and resolve any `strict` / `noUnusedLocals` / `noUnusedParameters` violations across `src/` and `features/` (constitution Principle III)
- [ ] T019 Run `npm test` and confirm all 81 scenario steps pass (constitution Principle II Green state)
- [ ] T020 [P] Run `npm run build` and confirm it succeeds
- [ ] T021 Walk through `quickstart.md` end-to-end and confirm the documented commands match actual behavior
- [ ] T022 Cross-check the FR → scenario → step traceability table in `plan.md`'s Constitution Check section against the final implementation; resolve any orphan requirement or scenario (constitution Principle V) — this is what `speckit.bdd.verify` automates

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup — BLOCKS all user stories
- **User Stories (Phase 3–5)**: All depend on Foundational completion
  - US1 has no dependency on US2/US3 and is the suggested MVP
  - US2 observes results through US1's rendering (per spec.md) but adds no code US1 depends on
  - US3 depends only on Foundational (uses `initialTasks` seeding, same as US1), not on US2
- **Polish (Phase 6)**: Depends on all three user stories being complete

### Within Each User Story

- Component/logic tasks before the step-definition completion task (steps need something real to assert against)
- Step-definition completion before the "run and confirm green" checkpoint task
- Story complete before moving to the next priority (though US2/US3 could be built in parallel by different developers once Foundational is done, since neither depends on the other)

### Parallel Opportunities

- T002 (baseline check) can run in parallel with T001 (install) — read-only checks, no shared file writes
- T018 and T020 (Polish) can run in parallel — independent verification commands
- Within a user story, most tasks touch `src/TodoApp.tsx` sequentially (same file) — genuine `[P]` parallelism is limited to across-story work by different developers, not within a single story

---

## Parallel Example: After Foundational Completes

```bash
# Different developers can take different stories in parallel — none depends on another:
Task: "User Story 1 (T005-T008) — view-weekly-tasks"
Task: "User Story 2 (T009-T013) — add-task"
Task: "User Story 3 (T014-T017) — mark-task-complete"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T002)
2. Complete Phase 2: Foundational (T003-T004) — CRITICAL, blocks all stories
3. Complete Phase 3: User Story 1 (T005-T008)
4. **STOP and VALIDATE**: `npx vitest run features/step_definitions/view-weekly-tasks.steps.ts` green
5. Demo the weekly list on its own

### Incremental Delivery

1. Setup + Foundational → foundation ready
2. Add US1 → validate independently → MVP demo
3. Add US2 → validate independently → demo (task creation)
4. Add US3 → validate independently → demo (completion toggle)
5. Phase 6 Polish → full-suite green, traceability confirmed

### Parallel Team Strategy

Once Foundational (T003-T004) is done: Developer A takes US1, Developer B takes US2, Developer C
takes US3 — all three touch `src/TodoApp.tsx`, so coordinate merges (e.g. land US1 first since it's
the MVP and the other two are additive UI sections within the same component).

---

## Notes

- `[P]` tasks = different files or read-only commands, no dependencies
- `[Story]` label maps task to its user story (US1/US2/US3) for traceability back to spec.md
- Every step-definition file's `throw new Error('Pending: ...')` lines are the concrete signal of
  what's left to implement — grep for `Pending:` in `features/step_definitions/` to find remaining work
- Commit after each checkpoint (T008, T013, T017, T022)
- Avoid: editing `src/TodoApp.tsx` for two different stories in the same commit — keep each story's
  diff independently reviewable and revertable
