Feature: User authentication
  As a registered user
  I want to log in with my credentials
  So that I can access my personal dashboard

  Background:
    Given the application is running
    And a user account exists with email "alice@example.com" and password "Secure123!"

  Scenario: Successful login with valid credentials
    When the user submits login with email "alice@example.com" and password "Secure123!"
    Then the user is redirected to the dashboard
    And a session token is issued

  Scenario: Login fails with incorrect password
    When the user submits login with email "alice@example.com" and password "WrongPass"
    Then the error message "Invalid credentials" is displayed
    And no session token is issued

  Scenario: Login fails with unregistered email
    When the user submits login with email "unknown@example.com" and password "Secure123!"
    Then the error message "Invalid credentials" is displayed

  Scenario: Account is locked after 5 consecutive failures
    Given the user has failed to log in 4 times consecutively with email "alice@example.com"
    When the user submits login with email "alice@example.com" and password "WrongPass"
    Then the error message "Account locked for 15 minutes" is displayed
    And the account is locked for 15 minutes

  Scenario Outline: Login fails with malformed email format
    When the user submits login with email "<email>" and password "Secure123!"
    Then the error message "Invalid email format" is displayed

    Examples:
      | email             |
      | notanemail        |
      | @nodomain.com     |
      | missing-at-sign   |
      | spaces @test.com  |

  Scenario: Weak password is rejected during registration
    When the user attempts to register with email "bob@example.com" and password "abc"
    Then the error message "Password must be at least 8 characters and contain a digit" is displayed
