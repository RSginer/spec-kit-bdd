# BDD Traceability Matrix

Generated: 2026-08-21

## Coverage Summary

| Metric | Count | Percentage |
|--------|-------|------------|
| Total requirements | 36 | — |
| ✅ Covered | 31 | 86.1% |
| ❌ Uncovered | 5 | 13.9% |
| ⚠️ Orphaned scenarios | 1 | — |

Scenario outlines are counted once in the matrix. Their seven example rows are
also executed by the suite, producing 19 total executable scenarios across all
feature files.

## Requirements → Scenarios

### User Stories

| Req ID | Description | Status | Covering Scenarios |
|--------|-------------|--------|--------------------|
| REQ-001 | User can capture and review tasks planned for the current week. | ✅ | weekly-todo-capture.feature: Create a weekly todo; Review incomplete and completed weekly todos |
| REQ-002 | User can maintain todo details and completion state. | ✅ | weekly-todo-maintenance.feature: Update a todo's title and planned date; Mark an incomplete todo complete; Mark a completed todo incomplete |
| REQ-003 | User can remove obsolete weekly todos. | ✅ | weekly-todo-removal.feature: Delete an existing weekly todo; Reject deletion of an unknown todo |

### Acceptance Criteria

| Req ID | Description | Status | Covering Scenarios |
|--------|-------------|--------|--------------------|
| REQ-004 | A valid weekly todo is saved and returned as incomplete. | ✅ | weekly-todo-capture.feature: Create a weekly todo |
| REQ-005 | The current-week list returns incomplete and completed todos with their fields. | ✅ | weekly-todo-capture.feature: Review incomplete and completed weekly todos |
| REQ-006 | An empty title is rejected without changing the list. | ✅ | weekly-todo-capture.feature: Reject a todo with an invalid title |
| REQ-007 | A weekly todo title and planned date can be changed within the current week. | ✅ | weekly-todo-maintenance.feature: Update a todo's title and planned date |
| REQ-008 | An incomplete todo can be marked complete. | ✅ | weekly-todo-maintenance.feature: Mark an incomplete todo complete |
| REQ-009 | A completed todo can be marked incomplete. | ✅ | weekly-todo-maintenance.feature: Mark a completed todo incomplete |
| REQ-010 | An update to a date outside the current week is rejected and leaves the previous date unchanged. | ✅ | weekly-todo-maintenance.feature: Reject an update outside the current week |
| REQ-011 | An existing weekly todo can be deleted without deleting another todo. | ✅ | weekly-todo-removal.feature: Delete an existing weekly todo |
| REQ-012 | Deleting an unknown identifier is rejected and existing todos remain. | ✅ | weekly-todo-removal.feature: Reject deletion of an unknown todo |

### Functional Requirements

| Req ID | Description | Status | Covering Scenarios |
|--------|-------------|--------|--------------------|
| REQ-013 | Create a todo with a non-empty title and planned date in the current week. | ✅ | weekly-todo-capture.feature: Create a weekly todo; Accept only planned dates inside the current week |
| REQ-014 | Assign each todo a unique identifier and default incomplete state. | ✅ | weekly-todo-capture.feature: Create a weekly todo; Review incomplete and completed weekly todos |
| REQ-015 | List all todos whose planned dates fall in the current week, including both states. | ✅ | weekly-todo-capture.feature: Review incomplete and completed weekly todos; Review an empty weekly list; weekly-todo-removal.feature: Exclude todos outside the current week |
| REQ-016 | Return each listed todo's identifier, title, planned date, and completion state. | ✅ | weekly-todo-capture.feature: Create a weekly todo; Review incomplete and completed weekly todos |
| REQ-017 | Update an existing todo's title and planned date when valid. | ✅ | weekly-todo-maintenance.feature: Update a todo's title and planned date |
| REQ-018 | Change an existing todo between incomplete and complete states. | ✅ | weekly-todo-maintenance.feature: Mark an incomplete todo complete; Mark a completed todo incomplete |
| REQ-019 | Delete an existing todo. | ✅ | weekly-todo-removal.feature: Delete an existing weekly todo |
| REQ-020 | Reject empty, whitespace-only, and over-200-character titles. | ❌ | weekly-todo-capture.feature: Reject a todo with an invalid title covers rejection, but does not assert trimming before storage |
| REQ-021 | Reject planned dates outside the current week for creation and update. | ✅ | weekly-todo-capture.feature: Accept only planned dates inside the current week; weekly-todo-maintenance.feature: Reject an update outside the current week |
| REQ-022 | Reject unknown update and delete identifiers without mutating existing todos. | ✅ | weekly-todo-maintenance.feature: Reject an update for an unknown todo; weekly-todo-removal.feature: Reject deletion of an unknown todo |
| REQ-023 | Preserve other current-week todos when viewing or modifying a todo. | ✅ | weekly-todo-capture.feature: Review incomplete and completed weekly todos; weekly-todo-removal.feature: Delete an existing weekly todo |
| REQ-024 | Determine the current week as Monday through Sunday in the user's local calendar context. | ✅ | weekly-todo-capture.feature: Accept only planned dates inside the current week; weekly-todo-removal.feature: Exclude todos outside the current week |

### Edge Cases

| Req ID | Description | Status | Covering Scenarios |
|--------|-------------|--------|--------------------|
| REQ-025 | Accept the first and last day of the current week. | ✅ | weekly-todo-capture.feature: Accept only planned dates inside the current week, examples `2026-08-17` and `2026-08-23` |
| REQ-026 | Reject dates before Monday and after Sunday. | ✅ | weekly-todo-capture.feature: Accept only planned dates inside the current week, examples `2026-08-16` and `2026-08-24`; weekly-todo-maintenance.feature: Reject an update outside the current week |
| REQ-027 | Trim leading and trailing title whitespace before validation and storage. | ❌ | None |
| REQ-028 | Reject titles longer than 200 characters without changing the list. | ✅ | weekly-todo-capture.feature: Reject a todo with an invalid title, 202-character example |
| REQ-029 | Return an empty list when no todo belongs to the current week. | ✅ | weekly-todo-capture.feature: Review an empty weekly list |
| REQ-030 | Exclude previous- and future-week todos from the current-week list. | ✅ | weekly-todo-removal.feature: Exclude todos outside the current week |
| REQ-031 | Unknown updates and deletes do not change existing todos. | ✅ | weekly-todo-maintenance.feature: Reject an update for an unknown todo; weekly-todo-removal.feature: Reject deletion of an unknown todo |

### Success Criteria

| Req ID | Description | Status | Covering Scenarios |
|--------|-------------|--------|--------------------|
| REQ-032 | A user can create and see a valid weekly todo in under 30 seconds. | ❌ | No scenario measures elapsed completion time |
| REQ-033 | A user can update a todo and confirm the result in under 30 seconds. | ❌ | No scenario measures elapsed completion time |
| REQ-034 | At least 95% of valid CRUD actions produce the expected state on the first attempt. | ❌ | No scenario computes this aggregate acceptance metric |
| REQ-035 | The weekly list includes all current-week todos and excludes all out-of-week todos. | ✅ | weekly-todo-capture.feature: Accept only planned dates inside the current week; weekly-todo-removal.feature: Exclude todos outside the current week |
| REQ-036 | A user can distinguish incomplete and completed todos without opening an individual todo. | ✅ | weekly-todo-capture.feature: Review incomplete and completed weekly todos |

## Orphaned Scenarios

These scenarios are not traceable to a requirement in the weekly todo
specification:

| Feature File | Scenario Name | Notes |
|--------------|---------------|-------|
| health.feature | Service reports healthy status | Belongs to the existing service-health behavior, not the weekly todo feature. |

## Suggested Scenarios for Uncovered Requirements

### REQ-020 and REQ-027: Trim valid title whitespace

```gherkin
Scenario: Trim title whitespace before storing a todo
  Given the API client's local date is "2026-08-21"
  And the API client's todo store is empty
  When the API client POSTs "/todos" with title "  Send project update  " and planned date "2026-08-21"
  Then the response status should be 201
  And the response body should contain a todo with title "Send project update", planned date "2026-08-21", and completion state "incomplete"
```

### REQ-032: Create within the target time

```gherkin
Scenario: Create a weekly todo within 30 seconds
  Given the API client's local date is "2026-08-21"
  When the API client POSTs "/todos" with title "Send project update" and planned date "2026-08-21"
  Then the response status should be 201 within 30 seconds
```

### REQ-033: Update within the target time

```gherkin
Scenario: Update a weekly todo within 30 seconds
  Given the API client has created a todo with title "Prepare agenda", planned date "2026-08-21", and completion state "incomplete"
  When the API client PUTs the created todo at "/todos/{id}" with title "Prepare client agenda" and planned date "2026-08-22"
  Then the response status should be 200 within 30 seconds
```

### REQ-034: Track first-attempt CRUD success

This aggregate criterion is better validated by a test report than by one
scenario. Add a test-run metric that counts valid create, update, and delete
examples and verifies at least 95% produce the expected state on the first
attempt.

## Verification Notes

- The current implementation passes the executable suite: 19 scenarios and 111
  steps.
- The matrix evaluates behavioral coverage, not whether an implementation exists.
- The five uncovered items are measurable or transformation requirements that
  need explicit acceptance assertions or a separate test-run metric.
