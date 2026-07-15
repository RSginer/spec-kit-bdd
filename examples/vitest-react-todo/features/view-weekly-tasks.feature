Feature: View tasks due this week
  As a user
  I want to see all my tasks that are due this week
  So that I can prioritize what needs to get done without reviewing my full backlog

  Background:
    Given the current date is "2026-07-15"

  Scenario: Only tasks due within the current week are shown
    Given a task "Submit expense report" due "2026-07-16"
    And a task "Renew passport" due "2026-08-02"
    And a task "Pay rent" due "2026-07-01"
    When the user views the weekly task list
    Then the weekly task list shows "Submit expense report"
    And the weekly task list does not show "Renew passport"
    And the weekly task list does not show "Pay rent"

  Scenario: A message is shown when no tasks are due this week
    Given no tasks are due between "2026-07-13" and "2026-07-19"
    When the user views the weekly task list
    Then the message "No tasks due this week" is displayed

  Scenario: A task due today is visually flagged as due today
    Given a task "Submit expense report" due "2026-07-15"
    When the user views the weekly task list
    Then "Submit expense report" is flagged as due today

  Scenario: Tasks in the weekly list are ordered by due date, earliest first
    Given a task "Renew gym membership" due "2026-07-18"
    And a task "Submit expense report" due "2026-07-16"
    And a task "Pay rent" due "2026-07-13"
    When the user views the weekly task list
    Then the weekly task list shows tasks in this order:
      | task                    |
      | Pay rent                |
      | Submit expense report   |
      | Renew gym membership    |

  Scenario: Tasks sharing the same due date are both shown
    Given a task "Submit expense report" due "2026-07-16"
    And a task "Call the dentist" due "2026-07-16"
    When the user views the weekly task list
    Then the weekly task list shows "Submit expense report"
    And the weekly task list shows "Call the dentist"

  Scenario Outline: Tasks are included or excluded based on the week boundary
    Given a task "Review pull request" due "<due_date>"
    When the user views the weekly task list
    Then the weekly task list <inclusion> "Review pull request"

    Examples:
      | due_date   | inclusion       |
      | 2026-07-12 | does not show   |
      | 2026-07-13 | shows           |
      | 2026-07-19 | shows           |
      | 2026-07-20 | does not show   |
