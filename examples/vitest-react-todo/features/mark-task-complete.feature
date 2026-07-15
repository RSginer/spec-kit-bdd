Feature: Mark a task complete
  As a user
  I want to mark a task as complete directly from my weekly list
  So that I can track what I've finished this week

  Background:
    Given the current date is "2026-07-15"
    And a task "Submit expense report" due "2026-07-16"

  Scenario: Marking a task complete keeps it visible and flags it as complete
    When the user marks "Submit expense report" as complete
    Then "Submit expense report" is flagged as complete
    And the weekly task list shows "Submit expense report"

  Scenario: Unmarking a completed task returns it to incomplete
    Given "Submit expense report" is marked as complete
    When the user marks "Submit expense report" as incomplete
    Then "Submit expense report" is flagged as incomplete
    And the weekly task list shows "Submit expense report"
