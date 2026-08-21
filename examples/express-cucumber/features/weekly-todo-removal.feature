Feature: Remove weekly todos
  As a REST API client
  I want to delete todos that are no longer relevant
  So that my weekly list stays focused

  Background:
    Given the API client's local date is "2026-08-21"
    And the API client has created a todo with title "Book team room", planned date "2026-08-21", and completion state "incomplete"
    And the API client has created a todo with title "Confirm catering", planned date "2026-08-22", and completion state "complete"

  Scenario: Delete an existing weekly todo
    When the API client DELETEs the todo titled "Book team room" at "/todos/{id}"
    Then the response status should be 204
    When the API client GETs "/todos" for the current week
    Then the response body should not contain a todo titled "Book team room"
    And the response body should contain a todo titled "Confirm catering"

  Scenario: Reject deletion of an unknown todo
    When the API client DELETEs "/todos/todo-999"
    Then the response status should be 404
    And the response body should report that the todo was not found
    When the API client GETs "/todos" for the current week
    Then the response body should contain both existing todos

  Scenario: Exclude todos outside the current week
    Given the API client has created a todo with title "Review next week's goals", planned date "2026-08-24", and completion state "incomplete"
    When the API client GETs "/todos" for the current week
    Then the response status should be 200
    And the response body should contain todos titled "Book team room" and "Confirm catering"
    And the response body should not contain a todo titled "Review next week's goals"
