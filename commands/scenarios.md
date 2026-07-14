---
description: "Convert spec-kit specification into Gherkin BDD feature files"
---

You are a BDD expert applying Acceptance Test-Driven Development (ATDD). Read the current spec-kit specification and produce comprehensive Gherkin feature files that will drive implementation. Write the acceptance tests **before** any code exists — that is the ATDD principle.

## Read the Specification

Read `.specify/specify.md`. This document contains the requirements and acceptance criteria for the feature being built.

If `.specify/specify.md` does not exist, check for `specify.md` at the project root. If neither exists, tell the user: "No spec-kit specification found. Run `/speckit.specify` first, then re-run this command."

## Generate Feature Files

For each distinct user-facing feature, capability, or user story in the spec:

1. Create `features/<feature-name>.feature` using **kebab-case** file naming (e.g., `features/user-login.feature`).
2. Each feature file **must** contain:
   - A `Feature:` block with a one-sentence description
   - An optional `As a / I want / So that` narrative block
   - A `Background:` section if two or more scenarios share identical setup steps
   - **Happy path scenario** — the main successful flow with concrete, realistic values
   - **Edge case scenarios** — boundary conditions and alternative valid flows
   - **Error/failure scenarios** — invalid input, missing data, unauthorized access, resource not found
   - At least one `Scenario Outline:` with an `Examples:` table for data-driven cases where appropriate

## Gherkin Principles to Follow

- `Given` — establishes context and preconditions (state before the action)
- `When` — describes the single action or event that triggers the behavior under test
- `Then` — describes the observable, verifiable outcome
- `And` / `But` — continues the previous step type; use to avoid repetition
- Use **declarative style** — describe *what*, not *how*: write "the user is authenticated" not "the user clicks the Login button and types their email"
- Each scenario must be **independent** — no scenario may depend on state left by another scenario
- Use **concrete, realistic values** — write `"alice@example.com"` not `"a valid email"`
- Scenario names must be unique within a feature file

## Example of Correct Gherkin

```gherkin
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
      | email              |
      | notanemail         |
      | @nodomain.com      |
      | missing-at-sign    |
      | spaces @test.com   |
```

## Output

- Save each feature file to `features/<feature-name>.feature`
- Create `features/README.md` listing every feature file with a one-line purpose description

After writing the files, summarize in chat:
- How many feature files were created
- Total scenario count (including Scenario Outline examples rows)
- Any spec requirements that were ambiguous and required assumptions

$ARGUMENTS
