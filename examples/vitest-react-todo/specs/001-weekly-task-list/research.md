# Phase 0 Research: Weekly Task List

The technology stack itself is fixed by the project constitution's Additional Constraints (React
19 + TypeScript strict + Vite; Vitest + `@amiceli/vitest-cucumber`; `@testing-library/react` +
`@testing-library/user-event`; `jsdom`) — there is no NEEDS CLARIFICATION on stack choice. The
research below resolves the remaining open implementation questions raised by the spec and by the
step stubs already scaffolded in `features/step_definitions/`.

## 1. Controlling "today" for deterministic tests

**Decision**: Use `vi.setSystemTime(new Date(<date>))` (paired with `vi.useFakeTimers()` /
`vi.useRealTimers()` in setup/teardown) inside the `Given the current date is "..."` background
step, and have `TodoApp` compute "today" via `new Date()` internally (no injected clock prop).

**Rationale**: Every feature file's `Background` starts with `Given the current date is "..."`,
and several scenarios assert behavior relative to "today" (due-today flag, week inclusion at the
boundary). `vitest`'s built-in fake timers give a global, per-test-controllable clock without
threading a `now` prop through the component tree, which would be an abstraction the constitution's
Simplicity principle (IV) doesn't justify for a single-component app.

**Alternatives considered**: Inject a `now: Date` prop/context into `TodoApp` — rejected as
unnecessary indirection for a component with no other consumers; passing the current date as a
constructor argument would also require production code to thread a clock dependency it doesn't
otherwise need.

## 2. Week boundary calculation (Monday–Sunday)

**Decision**: A pure helper `getWeekRange(today: Date): { start: Date; end: Date }` in
`src/task.ts` computes the Monday 00:00:00 through Sunday 23:59:59 range containing `today`, using
local time (`Date` methods, not UTC), matching the spec's Assumption ("evaluated using the device's
local date"). Inclusion is `dueDate >= start && dueDate <= end`.

**Rationale**: JavaScript's `Date.getDay()` returns 0 (Sunday) through 6 (Saturday); Monday-start
weeks need `((getDay() + 6) % 7)` days-since-Monday math. Isolating this in a pure, unit-testable
function keeps `TodoApp` free of date-math branching and directly resolves the boundary
`ScenarioOutline` in `view-weekly-tasks.feature` (2026-07-12 excluded, 2026-07-13 included,
2026-07-19 included, 2026-07-20 excluded — confirming Monday=07-13 through Sunday=07-19 for a
"today" of 2026-07-15).

**Alternatives considered**: A date library (`date-fns`, `dayjs`) — rejected; constitution
Principle IV disallows dependencies beyond what's needed for a single feature, and native `Date`
arithmetic is sufficient at this scope.

## 3. Task identity and add-task validation

**Decision**: Each `Task` gets an `id` via `crypto.randomUUID()` at creation (available in
`jsdom`/modern browsers, no extra dependency). The add-task form rejects submission client-side
(no `Task` is created, no state update) when `title.trim() === ''` or `dueDate === ''`, and renders
a validation message string next to the form instead of navigating away or resetting other fields.

**Rationale**: Directly matches `add-task.feature`'s "the task is not saved" + explicit validation
message scenarios (title-missing → "Title is required", due-date-missing → "Due date is required").
Validating before constructing a `Task` means invalid input never reaches the list/filter logic.

**Alternatives considered**: Sequential numeric IDs (`useRef` counter) — works equally well and
avoids any dependency on `crypto`; left as an implementation-time choice, not a blocking decision,
since it doesn't affect observable behavior any scenario checks.

## 4. Sorting and same-day tasks

**Decision**: Filtered tasks are sorted ascending by `dueDate` using string comparison on
ISO `YYYY-MM-DD` values (lexicographic order equals chronological order for this format); tasks
sharing a due date keep their relative insertion order (`Array.prototype.sort` is stable in all
supported engines).

**Rationale**: Matches `view-weekly-tasks.feature`'s ordering scenario and the "tasks sharing the
same due date are both shown" scenario, which doesn't assert a specific order between same-day
tasks (per spec Edge Cases: "order between them is not significant to the user").

**Alternatives considered**: Sorting by `new Date(dueDate).getTime()` — equivalent output for valid
ISO date strings but adds unnecessary `Date` construction; string comparison is simpler and
sufficient (constitution Principle IV).
