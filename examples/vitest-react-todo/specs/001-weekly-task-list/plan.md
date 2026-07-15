# Implementation Plan: Weekly Task List

**Branch**: `001-weekly-task-list` | **Date**: 2026-07-15 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-weekly-task-list/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

A single-page React todo app that shows only the tasks due in the current Monday–Sunday week,
lets the user add a task (title + due date, both required), and lets the user toggle a task's
completion state — all in-memory, single-user, session-only. The three Gherkin feature files and
their failing `vitest-cucumber` step stubs already exist (`speckit.bdd.scaffold` ran ahead of this
plan); this plan defines the `Task` data shape, the week-boundary/ordering logic, and the
component contract those steps will drive against, so implementation turns the 81 failing steps
green without introducing state beyond `TodoApp`'s local component state.

## Technical Context

**Language/Version**: TypeScript 5 (`strict` mode), React 19, targeting ES2022
**Primary Dependencies**: React 19 + Vite 8 (app); Vitest 4 + `@amiceli/vitest-cucumber` (BDD feature tests); `@testing-library/react` + `@testing-library/user-event` (component-level assertions); `jsdom` (test environment) — all fixed by the project constitution's Additional Constraints
**Storage**: N/A — in-memory `TodoApp` component state only; per spec Assumptions, tasks persist for the current browser session only, no cross-session persistence
**Testing**: `vitest run` executing `features/step_definitions/**/*.steps.{ts,tsx}` (feature-level, via `vitest-cucumber`) plus any component-level RTL assertions written inside those steps; `tsc --noEmit` as a build gate
**Target Platform**: Client-side web browser (SPA served by Vite; no backend)
**Project Type**: Single frontend project (no `backend/`, no API) — existing `src/` + `features/` layout, not the generic CLI/library template options
**Performance Goals**: SC-001 — weekly list renders within 2s of opening the app (trivially met by a client-side render over an in-memory list; no special optimization required at this scale)
**Constraints**: No state-management library, routing, or backend (constitution Principle IV / Simplicity); TypeScript `strict`, `noUnusedLocals`, `noUnusedParameters` must stay green (constitution Principle III)
**Scale/Scope**: Single user, one device, an unbounded-but-small in-memory task list (no pagination/virtualization required); 3 user stories / 11 functional requirements / 3 feature files already scaffolded

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Check | Status |
|---|---|---|
| I. BDD/ATDD-First | `features/add-task.feature`, `features/mark-task-complete.feature`, `features/view-weekly-tasks.feature` already exist and cover all 3 user stories; this plan does not introduce implementation ahead of them | PASS |
| II. Test-First Development | `features/step_definitions/*.steps.ts` are scaffolded and currently fail (81/81, verified via `npx vitest run`) before any `TodoApp` behavior is implemented; this plan's data model and UI contract exist to make those specific stubs implementable, not to bypass them | PASS |
| III. Type Safety | Plan introduces a typed `Task` interface (see `data-model.md`) and no `any`/`@ts-ignore`; `tsc --noEmit` already passes on the current scaffold and must continue to | PASS |
| IV. Simplicity & Example Clarity | Design uses plain `useState`/derived values in `TodoApp`; no routing, no state library, no backend | PASS |
| V. Traceability | Every FR-001..FR-011 maps to at least one scenario across the 3 feature files (cross-checked below in Project Structure); no orphan requirements or scenarios identified | PASS |

No violations — Complexity Tracking table left empty.

**FR → scenario traceability** (spot-checked during this plan; full audit is `speckit.bdd.verify`'s job):
FR-001/002/010/011 → `view-weekly-tasks.feature` (week filtering, ordering); FR-003/009 → `view-weekly-tasks.feature` ("due today" flag) + `mark-task-complete.feature` (status shown); FR-004 → `view-weekly-tasks.feature` ("A message is shown when no tasks are due this week"); FR-005/006 → `add-task.feature`; FR-007/008 → `mark-task-complete.feature`.

### Post-Design Re-Check

*Re-evaluated after Phase 1 (`research.md`, `data-model.md`, `contracts/ui-contract.md`, `quickstart.md`).*

Design added exactly one new source file (`src/task.ts`, pure functions + the `Task` type) and one
UI/accessibility contract for the existing `TodoApp` component — no new dependency, no state
library, no backend, no persistence layer, and every derived value (`data-model.md`) traces to a
functional requirement. All five gates above still PASS with no changes; Complexity Tracking
remains empty.

## Project Structure

### Documentation (this feature)

```text
specs/001-weekly-task-list/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
│   └── ui-contract.md
├── checklists/
│   └── requirements.md
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── main.tsx              # Vite/React entry point (existing)
├── TodoApp.tsx            # Root component — extended in this feature with task
│                          # state, the add-task form, and the weekly list
├── task.ts                # NEW — Task type + pure helpers (week bounds, filter, sort)
└── test/
    └── setup.ts            # jest-dom matchers (existing)

features/
├── add-task.feature
├── mark-task-complete.feature
├── view-weekly-tasks.feature
└── step_definitions/
    ├── add-task.steps.ts          # scaffolded, currently failing
    ├── mark-task-complete.steps.ts # scaffolded, currently failing
    ├── view-weekly-tasks.steps.ts  # scaffolded, currently failing
    └── README.md
```

**Structure Decision**: Single frontend project — no `backend/`, no generic `src/models|services|cli|lib`
split. This is a small client-only React app (constitution Principle IV), so all feature logic lives in
`src/TodoApp.tsx` plus one new pure-logic module `src/task.ts` (week-boundary/filter/sort helpers,
kept separate from the component so they're unit-testable without rendering). Tests live entirely under
`features/step_definitions/` per the existing `vitest.config.ts` include pattern — no separate
`tests/unit|integration|contract` tree, since `vitest-cucumber` scenarios already cover the feature's
observable behavior end-to-end at the component level.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations — not applicable.
