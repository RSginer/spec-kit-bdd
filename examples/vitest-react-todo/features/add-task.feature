Feature: Add a task with a due date
  As a user
  I want to add a new task with a due date
  So that it appears in my weekly list when its due date falls within the current week

  Background:
    Given the current date is "2026-07-15"

  Scenario: Adding a task due this week makes it appear in the weekly list
    When the user adds a task titled "Submit expense report" due "2026-07-16"
    Then the weekly task list shows "Submit expense report"

  Scenario: Adding a task due outside this week does not add it to the weekly list
    When the user adds a task titled "Renew passport" due "2026-08-02"
    Then the weekly task list does not show "Renew passport"

  Scenario: Adding a task without a title is rejected
    When the user attempts to add a task with no title due "2026-07-16"
    Then the task is not saved
    And the validation message "Title is required" is displayed

  Scenario: Adding a task without a due date is rejected
    When the user attempts to add a task titled "Submit expense report" with no due date
    Then the task is not saved
    And the validation message "Due date is required" is displayed

  Scenario Outline: Adding a task with missing required fields is rejected
    When the user attempts to add a task titled "<title>" due "<due_date>"
    Then the task is not saved
    And the validation message "<message>" is displayed

    Examples:
      | title                  | due_date   | message               |
      |                        | 2026-07-16 | Title is required     |
      | Submit expense report  |            | Due date is required  |
      |                        |            | Title is required     |
