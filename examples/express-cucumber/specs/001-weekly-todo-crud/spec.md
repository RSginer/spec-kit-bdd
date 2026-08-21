# Feature Specification: Weekly Todo CRUD

**Feature Branch**: `001-weekly-todo-crud`

**Created**: 2026-08-21

**Status**: Draft

**Input**: User description: "As a user I would to have a CRUD of todos that I have to do this week"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Capture and Review Weekly Todos (Priority: P1)

A user can record tasks they need to complete during the current week and review
all of those tasks in one place. Each todo has a title, a planned date within
the current week, and a completion state.

**Why this priority**: Creating and reviewing tasks delivers the core value of
knowing what must be done this week.

**Independent Test**: Create two weekly todos and verify that both appear in the
weekly list with their titles, planned dates, and incomplete state.

**Acceptance Scenarios**:

1. **Given** the current week has no matching todo, **When** the user creates a
   todo with a title and planned date in the current week, **Then** the todo is
   saved and appears in the weekly list as incomplete.
2. **Given** the current week contains incomplete and completed todos, **When**
   the user opens the weekly list, **Then** all todos for the current week are
   shown with their title, planned date, and completion state.
3. **Given** the user tries to create a todo with an empty title, **When** the
   todo is submitted, **Then** the todo is rejected and the existing list is
   unchanged.

---

### User Story 2 - Maintain Todo Details (Priority: P2)

A user can change a weekly todo when its wording or planned date changes, and
can mark it complete after finishing the task.

**Why this priority**: Updating task details keeps the weekly plan accurate as
circumstances change.

**Independent Test**: Create a todo, change its title and planned date, mark it
complete, and verify the updated values in the weekly list.

**Acceptance Scenarios**:

1. **Given** an existing weekly todo, **When** the user changes its title and
   planned date to another date in the current week, **Then** the updated values
   are shown in the weekly list.
2. **Given** an incomplete weekly todo, **When** the user marks it complete,
   **Then** its completion state changes to complete.
3. **Given** a completed weekly todo, **When** the user marks it incomplete,
   **Then** its completion state changes to incomplete.
4. **Given** an existing weekly todo, **When** the user changes its planned date
   outside the current week, **Then** the change is rejected and the previous
   planned date remains unchanged.

---

### User Story 3 - Remove Unneeded Todos (Priority: P3)

A user can permanently remove a todo that is no longer relevant to the week's
plan.

**Why this priority**: Removing obsolete tasks keeps the list focused and useful
without affecting the remaining weekly work.

**Independent Test**: Create a todo, remove it, and verify it no longer appears
in the weekly list while another todo remains visible.

**Acceptance Scenarios**:

1. **Given** an existing weekly todo, **When** the user deletes it, **Then** it
   no longer appears in the weekly list.
2. **Given** an unknown todo identifier, **When** the user attempts to delete
   it, **Then** the request is rejected and all existing todos remain unchanged.

### Edge Cases

- A planned date at the first or last day of the current week is accepted.
- A planned date outside Monday through Sunday of the current week is rejected.
- Leading and trailing whitespace in a title is removed before validation and
  storage; a title containing only whitespace is rejected.
- A title longer than 200 characters is rejected without changing the todo list.
- The weekly list is empty when no todo belongs to the current week.
- A todo from a previous or future week is not included in the current week's
  list.
- Updating or deleting an unknown todo does not change any existing todo.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST allow the user to create a todo with a non-empty
  title and a planned date within the current week.
- **FR-002**: The system MUST assign each created todo a unique identifier and an
  incomplete completion state by default.
- **FR-003**: The system MUST allow the user to view all todos whose planned date
  falls within the current week, including both incomplete and completed todos.
- **FR-004**: The system MUST show each listed todo's identifier, title, planned
  date, and completion state.
- **FR-005**: The system MUST allow the user to update a todo's title and planned
  date when the todo exists and the new values are valid.
- **FR-006**: The system MUST allow the user to change an existing todo between
  incomplete and complete states.
- **FR-007**: The system MUST allow the user to delete an existing todo.
- **FR-008**: The system MUST reject empty or whitespace-only titles and titles
  longer than 200 characters.
- **FR-009**: The system MUST reject planned dates outside the current week for
  both creation and update.
- **FR-010**: The system MUST reject update and delete requests for unknown todo
  identifiers without modifying existing todos.
- **FR-011**: The system MUST preserve todos created for the current week when
  the user views or modifies other todos.
- **FR-012**: The system MUST determine the current week as Monday through Sunday
  in the user's local calendar context.

### Key Entities *(include if feature involves data)*

- **Todo**: A task the user plans to complete during the current week. It has a
  unique identifier, title, planned date, and completion state.
- **Current Week**: The Monday-through-Sunday calendar period containing the
  user's current local date; it defines which todos are shown and which planned
  dates are valid.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A user can create and see a valid weekly todo in the weekly list in
  under 30 seconds.
- **SC-002**: A user can update a todo's title, planned date, or completion state
  and confirm the result in under 30 seconds.
- **SC-003**: At least 95% of valid create, update, and delete actions produce
  the expected weekly list state on the first attempt during acceptance testing.
- **SC-004**: The weekly list shows 100% of todos with planned dates in the
  current week and excludes 100% of todos outside that week during acceptance
  testing.
- **SC-005**: A user can distinguish incomplete from completed todos without
  opening an individual todo.

## Assumptions

- The feature serves one user in its initial scope; account management,
  authentication, sharing, and collaboration are out of scope.
- The current week runs from Monday through Sunday and uses the user's local
  calendar context.
- A todo is retained after completion until the user deletes it or it falls
  outside the current weekly view.
- Todos do not repeat automatically and do not have priorities, notes, reminders,
  attachments, or subtasks in the initial scope.
- The user has a stable connection while creating, viewing, updating, or deleting
  todos.
