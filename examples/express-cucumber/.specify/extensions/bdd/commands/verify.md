---
description: "Verify BDD scenario coverage against the spec-kit specification"
---

You are a BDD quality auditor. Compare the spec-kit specification with existing Gherkin feature files to find coverage gaps and produce a traceability matrix. This command completes the ATDD loop: after implementation, verify that every acceptance criterion is covered by a scenario.

## Read Inputs

1. **Specification** — Resolve the active feature specification:
   1. If `SPECIFY_FEATURE_DIRECTORY` is set, treat it as the feature directory.
   2. Otherwise, read `feature_directory` from `.specify/feature.json`.
   3. Read the specification from `<feature_directory>/spec.md`.

   If no feature directory can be resolved, or `<feature_directory>/spec.md` does not exist, fall back to `.specify/specify.md`, then `specify.md` at the project root. If none of these resolve, report: "No specification found. Run `/speckit.specify` first."
2. **Feature files** — Read all `*.feature` files in `features/`. If none exist, report: "No feature files found. Run `/speckit.bdd.scenarios` first."

## Extract Requirements

From the specification, extract every:
- Explicit acceptance criterion (lines with "must", "should", "shall", or numbered criteria)
- User story ("As a... I want... So that...")
- Functional requirement
- Non-functional requirement with an observable behavior (e.g., "response within 500ms")

Assign sequential IDs: `REQ-001`, `REQ-002`, etc.

## Extract Scenarios

From all feature files, collect every `Scenario:` and `Scenario Outline:` with:
- The feature file name
- The scenario name
- All `Given`/`When`/`Then` step text

## Map Requirements → Scenarios

For each requirement, determine which scenario(s) verify it. A scenario **covers** a requirement if its `Then` steps assert behavior that satisfies the requirement's stated outcome.

Flag as **orphaned** any scenario whose behavior cannot be traced to any requirement.

## Generate features/TRACEABILITY.md

```markdown
# BDD Traceability Matrix

Generated: YYYY-MM-DD

## Coverage Summary

| Metric               | Count | Percentage |
|----------------------|-------|------------|
| Total requirements   | N     | —          |
| ✅ Covered           | N     | XX%        |
| ❌ Uncovered         | N     | XX%        |
| ⚠️ Orphaned scenarios | N    | —          |

## Requirements → Scenarios

| Req ID  | Description                                      | Status | Covering Scenarios                        |
|---------|--------------------------------------------------|--------|-------------------------------------------|
| REQ-001 | User can log in with valid credentials           | ✅     | user-auth.feature: Successful login       |
| REQ-002 | Account locked after 5 failed attempts           | ✅     | user-auth.feature: Account locked after 5 failures |
| REQ-003 | Password reset via email link                    | ❌     | None                                      |

## Orphaned Scenarios

Scenarios not traced to any spec requirement:

| Feature File          | Scenario Name        | Notes                        |
|-----------------------|----------------------|------------------------------|
| user-auth.feature     | Admin bypass login   | Not mentioned in spec — confirm with product owner |

## Suggested Scenarios for Uncovered Requirements

For each uncovered requirement, here is a skeleton scenario to add:

### REQ-003: Password reset via email link

```gherkin
Scenario: User receives password reset email
  Given a user account exists with email "alice@example.com"
  When the user requests a password reset for "alice@example.com"
  Then a password reset email is sent to "alice@example.com"
  And the email contains a reset link valid for 60 minutes

Scenario: Password reset link expires after 60 minutes
  Given a password reset link was generated 61 minutes ago for "alice@example.com"
  When the user follows the reset link
  Then the error message "Reset link has expired" is displayed
```
```

## Coverage Decision Rule

After generating `features/TRACEABILITY.md`, print a coverage verdict in chat:

- **≥ 80% covered:** `✅ BDD COVERAGE: XX% — All critical requirements have scenarios. Safe to implement.`
- **50–79% covered:** `⚠️ BDD COVERAGE: XX% — Some requirements lack scenarios. Review TRACEABILITY.md before proceeding.`
- **< 50% covered:** `❌ BDD COVERAGE: XX% — Coverage is critically low. Run /speckit.bdd.scenarios to generate missing scenarios before implementing.`

Always list uncovered requirements by ID and description in the chat summary, regardless of percentage.

$ARGUMENTS
