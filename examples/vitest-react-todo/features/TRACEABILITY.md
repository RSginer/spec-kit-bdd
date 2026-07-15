# BDD Traceability Matrix

Generated: 2026-07-15

Source spec: `specs/001-weekly-task-list/spec.md`
Feature files: `features/add-task.feature`, `features/mark-task-complete.feature`, `features/view-weekly-tasks.feature`

## Coverage Summary

| Metric               | Count | Percentage |
|-----------------------|-------|-----------|
| Total requirements    | 25    | —         |
| ✅ Covered            | 21    | 84%       |
| ❌ Uncovered          | 4     | 16%       |
| ⚠️ Orphaned scenarios | 0     | —         |

## Requirements → Scenarios

| Req ID  | Description                                                                 | Status | Covering Scenarios |
|---------|------------------------------------------------------------------------------|--------|---------------------|
| REQ-001 | US1 AS1: Only tasks due within the current week are shown when list opens    | ✅ | view-weekly-tasks.feature: Only tasks due within the current week are shown |
| REQ-002 | US1 AS2: A message is shown when no tasks are due this week                  | ✅ | view-weekly-tasks.feature: A message is shown when no tasks are due this week |
| REQ-003 | US1 AS3: A task due today is visually distinguished as due today             | ✅ | view-weekly-tasks.feature: A task due today is visually flagged as due today |
| REQ-004 | US2 AS1: Adding a task due this week makes it appear immediately             | ✅ | add-task.feature: Adding a task due this week makes it appear in the weekly list |
| REQ-005 | US2 AS2: Adding a task due outside this week does not add it to the list     | ✅ | add-task.feature: Adding a task due outside this week does not add it to the weekly list |
| REQ-006 | US2 AS3: Adding a task without a title is prevented with a validation message| ✅ | add-task.feature: Adding a task without a title is rejected; Adding a task with missing required fields is rejected (Scenario Outline) |
| REQ-007 | US3 AS1: Marking a task complete visually indicates it, remains visible      | ✅ | mark-task-complete.feature: Marking a task complete keeps it visible and flags it as complete |
| REQ-008 | US3 AS2: Unmarking a completed task returns it to incomplete                 | ✅ | mark-task-complete.feature: Unmarking a completed task returns it to incomplete |
| REQ-009 | FR-001: Display list of tasks whose due date falls within the current week  | ✅ | view-weekly-tasks.feature: Only tasks due within the current week are shown; Tasks are included or excluded based on the week boundary (Scenario Outline) |
| REQ-010 | FR-002: Week runs Monday through Sunday                                     | ✅ | view-weekly-tasks.feature: Tasks are included or excluded based on the week boundary (Scenario Outline) |
| REQ-011 | FR-003: Each task entry shows its title, due date, and completion status    | ❌ | None — title and completion status are asserted, but no scenario asserts the due date is displayed on a task entry |
| REQ-012 | FR-004: Display a clear message when no tasks are due in the current week   | ✅ | view-weekly-tasks.feature: A message is shown when no tasks are due this week |
| REQ-013 | FR-005: Users can add a new task by providing a title and due date          | ✅ | add-task.feature: Adding a task due this week makes it appear in the weekly list |
| REQ-014 | FR-006: Require non-empty title and due date; reject save otherwise         | ✅ | add-task.feature: Adding a task without a title is rejected; Adding a task without a due date is rejected; Adding a task with missing required fields is rejected (Scenario Outline) |
| REQ-015 | FR-007: Users can mark any task in the weekly list complete or incomplete   | ✅ | mark-task-complete.feature: Marking a task complete keeps it visible and flags it as complete; Unmarking a completed task returns it to incomplete |
| REQ-016 | FR-008: Visually distinguish completed tasks from incomplete ones           | ✅ | mark-task-complete.feature: Marking a task complete keeps it visible and flags it as complete; Unmarking a completed task returns it to incomplete |
| REQ-017 | FR-009: Visually flag tasks due today separately from tasks due later       | ✅ | view-weekly-tasks.feature: A task due today is visually flagged as due today |
| REQ-018 | FR-010: Order tasks in the weekly list by due date, earliest first          | ✅ | view-weekly-tasks.feature: Tasks in the weekly list are ordered by due date, earliest first |
| REQ-019 | FR-011: Tasks with a due date outside the current week must not appear      | ✅ | add-task.feature: Adding a task due outside this week does not add it to the weekly list; view-weekly-tasks.feature: Only tasks due within the current week are shown; Tasks are included or excluded based on the week boundary (Scenario Outline) |
| REQ-020 | SC-001: Full set of tasks due this week viewable within 2 seconds           | ❌ | None — no performance/timing scenario exists |
| REQ-021 | SC-002: New task correctly appears/excluded based on due date, 100% of time | ✅ | add-task.feature: Adding a task due this week makes it appear in the weekly list; Adding a task due outside this week does not add it to the weekly list |
| REQ-022 | SC-003: 100% of in-week tasks shown, 0% of out-of-week tasks shown          | ✅ | view-weekly-tasks.feature: Only tasks due within the current week are shown; Tasks are included or excluded based on the week boundary (Scenario Outline) |
| REQ-023 | SC-004: Users can tell at a glance which tasks are complete/incomplete/due today | ❌ | None — no scenario explicitly verifies at-a-glance distinguishability across all three states together |
| REQ-024 | Edge case: Tasks sharing the same due date are both shown, order not significant | ✅ | view-weekly-tasks.feature: Tasks sharing the same due date are both shown |
| REQ-025 | Edge case: List reflects the week as of last load/refresh, no live update at midnight rollover | ❌ | None — no scenario covers date-rollover/refresh behavior |

## Orphaned Scenarios

None. Every scenario in the feature files traces back to at least one spec requirement.

## Suggested Scenarios for Uncovered Requirements

### REQ-011: Each task entry shows its title, due date, and completion status

```gherkin
Scenario: A task entry displays its title, due date, and completion status
  Given a task "Submit expense report" due "2026-07-16"
  When the user views the weekly task list
  Then the task "Submit expense report" displays the due date "2026-07-16"
  And the task "Submit expense report" displays its completion status as incomplete
```

### REQ-020: Full set of tasks due this week viewable within 2 seconds

```gherkin
Scenario: Weekly task list renders within an acceptable time
  Given 50 tasks due within the current week
  When the user opens the app
  Then the weekly task list is fully rendered within 2 seconds
```

Note: this is a performance criterion. It may be better verified with a dedicated performance/load test than a functional BDD scenario — consider that instead of forcing it into Gherkin.

### REQ-023: Users can tell at a glance which tasks are complete, incomplete, or due today

```gherkin
Scenario: Task states are visually distinguishable without instructions
  Given a task "Submit expense report" due "2026-07-15" marked as complete
  And a task "Renew gym membership" due "2026-07-15" marked as incomplete
  And a task "Pay rent" due "2026-07-17" marked as incomplete
  When the user views the weekly task list
  Then "Submit expense report" is visually marked as complete and due today
  And "Renew gym membership" is visually marked as incomplete and due today
  And "Pay rent" is visually marked as incomplete and not due today
```

### REQ-025: List reflects the week as of last load/refresh, no live update at midnight rollover

```gherkin
Scenario: The weekly list does not update live when the date rolls over
  Given the current date is "2026-07-19"
  And a task "Submit expense report" due "2026-07-19"
  And the user has the weekly task list open
  When the system date advances to "2026-07-20" without the page being reloaded
  Then the weekly task list still shows "Submit expense report"
```
