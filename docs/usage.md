# Spec-Kit BDD — Usage Guide

## The ATDD Workflow

ATDD (Acceptance Test-Driven Development) means: **write the acceptance tests before writing the code**.

This extension enforces that order:

1. `/speckit.specify` — write what you want to build
2. `/speckit.bdd.scenarios` — convert acceptance criteria to Gherkin (**tests written, RED**)
3. `/speckit.bdd.scaffold` — generate step definition stubs (**tests runnable, still RED**)
4. `/speckit.plan` + `/speckit.tasks` — plan the implementation
5. `/speckit.implement` — write code until all scenarios pass (**GREEN**)
6. `/speckit.bdd.verify` — confirm 100% spec coverage

## Command Reference

### `/speckit.bdd.scenarios [optional-focus]`

Reads the active feature's `spec.md` (resolved via `SPECIFY_FEATURE_DIRECTORY` or `.specify/feature.json`, e.g. `specs/003-user-auth/spec.md`) and generates `features/*.feature` files.

Pass an optional argument to focus on a subset:
```
/speckit.bdd.scenarios authentication flows only
```

**Output:**
- `features/<feature>.feature` — one file per logical feature area
- `features/README.md` — index of all feature files

### `/speckit.bdd.scaffold [optional-language]`

Reads all `features/*.feature` files and generates step definition stubs.

Override language detection:
```
/speckit.bdd.scaffold python behave
/speckit.bdd.scaffold javascript
```

**Output:** Step definition files with `TODO` comments and `NotImplementedError`/`pending` stubs.

### `/speckit.bdd.verify`

Reads the spec and all feature files, generates a traceability matrix.

**Output:**
- `features/TRACEABILITY.md` — full requirement ↔ scenario mapping
- Chat summary — coverage % and list of uncovered requirements

## Gherkin Best Practices

- **Declarative, not imperative:** "the user is logged in" ✓ vs "the user clicks Login and enters their password" ✗
- **Concrete values:** `"alice@example.com"` ✓ vs `"a valid email"` ✗
- **Independent scenarios:** no scenario depends on state created by another scenario
- **One When per scenario:** each scenario tests a single action

## Supported Frameworks

| Language | Framework | Step file location |
|----------|-----------|-------------------|
| Python | pytest-bdd | `tests/step_defs/` |
| Python | behave | `features/steps/` |
| JavaScript/TypeScript | @cucumber/cucumber | `features/step_definitions/` |
| Ruby | cucumber | `features/step_definitions/` |
| Java | io.cucumber | `src/test/java/steps/` |
| C# | SpecFlow | `Features/StepDefinitions/` |
