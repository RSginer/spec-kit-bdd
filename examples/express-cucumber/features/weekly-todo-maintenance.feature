Feature: Maintain weekly todo details
  As a REST API client
  I want to update my weekly todos and completion state
  So that my weekly plan stays accurate

  Background:
    Given the API client's local date is "2026-08-21"
    And the API client has created a todo with title "Prepare meeting agenda", planned date "2026-08-21", and completion state "incomplete"

  Scenario: Update a todo's title and planned date
    When the API client PUTs the created todo at "/todos/{id}" with title "Prepare client meeting agenda" and planned date "2026-08-22"
    Then the response status should be 200
    And the response body should contain title "Prepare client meeting agenda", planned date "2026-08-22", and completion state "incomplete"

  Scenario: Mark an incomplete todo complete
    When the API client PATCHes the created todo at "/todos/{id}" with completion state "complete"
    Then the response status should be 200
    And the response body should report completion state "complete"

  Scenario: Mark a completed todo incomplete
    Given the API client PATCHed the created todo at "/todos/{id}" with completion state "complete"
    When the API client PATCHes the created todo at "/todos/{id}" with completion state "incomplete"
    Then the response status should be 200
    And the response body should report completion state "incomplete"

  Scenario: Reject an update outside the current week
    When the API client PUTs the created todo at "/todos/{id}" with title "Prepare next week's agenda" and planned date "2026-08-24"
    Then the response status should be 400
    And the response body should report an invalid planned date
    When the API client GETs "/todos" for the current week
    Then the response body should still contain title "Prepare meeting agenda" and planned date "2026-08-21"

  Scenario: Reject an update for an unknown todo
    When the API client PUTs "/todos/todo-999" with title "Unknown task" and planned date "2026-08-22"
    Then the response status should be 404
    And the response body should report that the todo was not found
    When the API client GETs "/todos" for the current week
    Then the response body should still contain the created todo
