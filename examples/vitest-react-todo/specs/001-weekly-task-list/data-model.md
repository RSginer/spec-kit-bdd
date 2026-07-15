# Phase 1 Data Model: Weekly Task List

## Task

The sole entity in this feature (spec Key Entities: "Task: A single to-do item. Key attributes:
title, due date, completion status"). Lives entirely in `TodoApp`'s in-memory state (`useState<Task[]>`)
— no persistence layer per spec Assumptions.

```ts
// src/task.ts
export interface Task {
  id: string
  title: string
  /** ISO date, "YYYY-MM-DD" */
  dueDate: string
  completed: boolean
}
```

| Field | Type | Rules |
|---|---|---|
| `id` | `string` | Generated at creation (`crypto.randomUUID()`), never user-editable. Uniquely identifies a task within the session. |
| `title` | `string` | Required, non-empty after trimming (FR-006). Rejecting save on empty title → "Title is required" (`add-task.feature`). |
| `dueDate` | `string` (`YYYY-MM-DD`) | Required (FR-006). Rejecting save on empty due date → "Due date is required" (`add-task.feature`). Immutable after creation — no scenario edits a task's due date. |
| `completed` | `boolean` | Defaults to `false` on creation (FR-007). Toggled by the mark-complete/incomplete steps; no other field changes when toggled. |

### State transitions

`completed` is the only mutable field, with exactly two transitions, both user-initiated and
reversible:

```
incomplete --(user marks complete)--> complete
complete   --(user marks incomplete)--> incomplete
```

No other lifecycle exists in this feature — task deletion and due-date editing are explicitly out
of scope (spec Assumptions).

### Derived values (not stored — computed from `Task[]` + "today")

These live as pure functions in `src/task.ts`, consumed by `TodoApp` for rendering; see
`research.md` §2 and §4 for the reasoning behind each.

- `getWeekRange(today: Date): { start: Date; end: Date }` — Monday 00:00–Sunday 23:59:59 containing `today`.
- `isDueThisWeek(task: Task, range: { start: Date; end: Date }): boolean` — FR-001/FR-011 filter predicate.
- `isDueToday(task: Task, today: Date): boolean` — FR-009 "due today" flag.
- `sortByDueDate(tasks: Task[]): Task[]` — FR-010 ascending order, stable for same-day tasks.

### Validation summary (enforced before a `Task` is constructed)

| Rule | Source |
|---|---|
| `title.trim() !== ''` | FR-006, `add-task.feature` "Adding a task without a title is rejected" + Scenario Outline |
| `dueDate !== ''` | FR-006, `add-task.feature` "Adding a task without a due date is rejected" + Scenario Outline |

Both checks run client-side in the add-task form handler; a failing check leaves existing state
untouched and surfaces the corresponding validation message (FR-006).
