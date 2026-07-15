# UI Contract: `TodoApp`

This project has no network API, CLI, or public library surface — its only "contract" is the
accessible DOM `TodoApp` renders, since that's what the already-scaffolded step definitions in
`features/step_definitions/*.steps.ts` must query and interact with via
`@testing-library/react` + `@testing-library/user-event`. This contract fixes the accessible names
and structure so implementation and step definitions agree without guesswork.

Query by role/label, never by CSS class or test-id (idiomatic RTL, and the constitution's
Simplicity principle doesn't call for a test-id layer this small app doesn't otherwise need).

## Add-task form

| Element | Accessible query | Notes |
|---|---|---|
| Title field | `screen.getByLabelText('Title')` | `<input>`, controlled, no default value |
| Due date field | `screen.getByLabelText('Due date')` | `<input type="date">`, value/typed text as `YYYY-MM-DD` |
| Submit button | `screen.getByRole('button', { name: 'Add task' })` | Triggers validation, then `onAddTask` |
| Validation message | `screen.getByText('Title is required')` / `screen.getByText('Due date is required')` | Rendered only after a failed submit attempt; absent otherwise (`screen.queryByText(...)` is `null` before any submit) |

Resolves the `add-task.steps.ts` TODOs: "fill in the add-task form ... via userEvent" is
`await user.type(screen.getByLabelText('Title'), title)` /
`await user.type(screen.getByLabelText('Due date'), dueDate)` /
`await user.click(screen.getByRole('button', { name: 'Add task' }))`.

## Weekly task list

| Element | Accessible query | Notes |
|---|---|---|
| List container | `screen.getByRole('list', { name: 'Weekly task list' })` | `<ul aria-label="Weekly task list">`; present even when empty |
| Task row | `screen.getByRole('listitem', { name: /Submit expense report/ })` | `<li>`; accessible name includes the task title so `getByText(title)` inside it also resolves |
| Complete toggle | `screen.getByRole('checkbox', { name: 'Submit expense report' })` | Accessible name = task title; `checked` reflects `Task.completed`; toggling fires the mark-complete/incomplete handler |
| "Due today" indicator | text `Due today` inside the task row | e.g. `within(taskRow).getByText('Due today')`; present only when `isDueToday(task, today)` |
| Empty-state message | `screen.getByText('No tasks due this week')` | Rendered instead of the (still present, but childless) list when the filtered set is empty |

Resolves the remaining TODOs:
- "shows" steps → `screen.getByText(title)` (or scoped: `within(list).getByText(title)`).
- "does not show" steps → `screen.queryByText(title)` is `null`.
- "is flagged as complete/incomplete" → `screen.getByRole('checkbox', { name: title }).checked === true` / `=== false`.
- "is flagged as due today" → the due-today text is present within that task's row.
- Ordering (`view-weekly-tasks.steps.ts`'s `table` param) → `screen.getAllByRole('listitem').map(li => within(li).getByText(/.+/).textContent)` (or simpler: assert each title's row precedes the next via `within(list).getAllByRole('listitem')` order) matches `table.map(row => row.task)`.

## Out of scope

Task deletion and due-date editing have no contract entries — both are explicitly out of scope per
the spec's Assumptions, and no scenario exercises them.
