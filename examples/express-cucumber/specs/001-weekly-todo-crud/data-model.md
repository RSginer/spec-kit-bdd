# Data Model: Weekly Todo CRUD

## Todo

Represents a task the single user plans to complete during the current week.

| Field | Type | Rules |
|-------|------|-------|
| `id` | string | Unique within the application instance; assigned on creation |
| `title` | string | Trimmed before validation; required; 1-200 characters after trimming |
| `plannedDate` | ISO calendar date | Required; must be within the current local Monday-Sunday week |
| `completionState` | `incomplete` or `complete` | Defaults to `incomplete`; can transition in either direction |

## Current Week

A derived value, not a persisted entity. It is the inclusive calendar range from
Monday through Sunday containing the user's current local date.

- The first and last days are valid planned dates.
- Dates before Monday or after Sunday are invalid for create and update.
- `GET /todos` returns todos whose `plannedDate` is within this range.
- Todos outside the range remain stored but are excluded from the weekly list.

## State Transitions

```text
incomplete <-> complete
```

Deletion removes the todo from the application-scoped collection. Updating or
deleting an unknown ID does not mutate any stored todo.
