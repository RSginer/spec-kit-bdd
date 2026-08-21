Feature: Capture and review weekly todos
  As a REST API client
  I want to create and retrieve the tasks I need to complete this week
  So that I can keep track of my weekly work

  Background:
    Given the API client's local date is "2026-08-21"
    And the API client's todo store is empty

  Scenario: Create a weekly todo
    When the API client POSTs "/todos" with title "Send project update" and planned date "2026-08-21"
    Then the response status should be 201
    And the response body should contain a todo with title "Send project update", planned date "2026-08-21", and completion state "incomplete"

  Scenario: Review incomplete and completed weekly todos
    Given the API client has created a todo with title "Review pull request", planned date "2026-08-20", and completion state "incomplete"
    And the API client has created a todo with title "Submit expense report", planned date "2026-08-21", and completion state "complete"
    When the API client GETs "/todos" for the current week
    Then the response status should be 200
    And the response body should contain both todos with their titles, planned dates, and completion states

  Scenario: Review an empty weekly list
    When the API client GETs "/todos" for the current week
    Then the response status should be 200
    And the response body should contain an empty todo list

  Scenario Outline: Reject a todo with an invalid title
    When the API client POSTs "/todos" with title "<title>" and planned date "2026-08-21"
    Then the response status should be 400
    And the response body should report an invalid todo title
    When the API client GETs "/todos" for the current week
    Then the response body should contain an empty todo list

    Examples:
      | title                                                                                                                                                                                                      |
      |                                                                                                                                                                                                            |
      |                                                                                                                                                                                                            |
      | aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa |

  Scenario Outline: Accept only planned dates inside the current week
    When the API client POSTs "/todos" with title "Prepare weekly plan" and planned date "<planned_date>"
    Then the response status should be <status>

    Examples:
      | planned_date | status |
      |   2026-08-17 |    201 |
      |   2026-08-23 |    201 |
      |   2026-08-16 |    400 |
      |   2026-08-24 |    400 |
