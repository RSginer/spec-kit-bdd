# Spec-Kit BDD Extension Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a `spec-kit` community extension (`id: bdd`) that integrates BDD and ATDD into the spec-kit workflow — converting spec artifacts into Gherkin feature files, scaffolding step definitions, and verifying scenario coverage.

**Architecture:** Three prompt-driven commands (`speckit.bdd.scenarios`, `speckit.bdd.scaffold`, `speckit.bdd.verify`) plug into the spec-kit lifecycle via `after_specify` and `before_implement` hooks. All commands are Markdown prompts read by AI agents. The project follows ATDD: Python validation tests are written first, then the extension files are created to make them pass.

**Tech Stack:** YAML (extension.yml manifest), Markdown (AI command prompts), Python 3.10+ + pytest (validation tests), Gherkin (command content and acceptance test fixtures), git

## Global Constraints

- spec-kit version requirement: `">=0.2.0"`
- Extension ID: `bdd` — commands must match `^speckit\.bdd\.[a-z0-9-]+$`
- Schema version: `"1.0"` (current spec-kit schema)
- Command files live in `commands/` and are referenced via relative paths in `extension.yml`
- `$ARGUMENTS` placeholder required in every command file (spec-kit replaces it at invocation)
- No external tool dependencies in the extension itself — prompt-only, no scripts
- Python test dependencies: `pytest>=7.0`, `PyYAML>=6.0`
- All test files live in `tests/`; run with `pytest tests/ -v`
- All git commits use conventional commit prefixes: `feat:`, `test:`, `docs:`, `chore:`

---

## File Structure

```
spec-kit-bdd/
├── extension.yml                         # Extension manifest
├── README.md                             # Installation and usage docs
├── LICENSE                               # MIT license
├── CHANGELOG.md                          # Version history
├── .gitignore                            # Python + OS ignores
├── .extensionignore                      # Excludes dev files from distribution
├── requirements-dev.txt                  # Test dependencies
├── commands/
│   ├── scenarios.md                      # Convert spec → Gherkin feature files
│   ├── scaffold.md                       # Generate step definition stubs
│   └── verify.md                         # Verify scenario coverage vs spec
├── docs/
│   ├── usage.md                          # Detailed usage guide
│   └── examples/
│       ├── sample.spec.md                # Example spec-kit spec
│       ├── user-auth.feature             # Example generated feature file
│       └── steps_example.py             # Example pytest-bdd step stubs
└── tests/
    ├── fixtures/
    │   └── sample.spec.md                # Spec fixture used by command tests
    ├── test_manifest.py                  # Validates extension.yml structure
    └── test_commands.py                  # Validates command file content
```

---

### Task 1: Project Bootstrap and Test Infrastructure

**Files:**
- Create: `tests/test_manifest.py`
- Create: `tests/test_commands.py`
- Create: `tests/fixtures/sample.spec.md`
- Create: `requirements-dev.txt`
- Create: `.gitignore`
- Create: `.extensionignore`

**Interfaces:**
- Produces: A runnable test suite (all RED) that defines acceptance criteria for Tasks 2–6

- [ ] **Step 1: Initialize git repository**

```bash
cd /Users/ruben.soler/Workspace/spec-kit-bdd
git init
```

Expected output: `Initialized empty Git repository in ...spec-kit-bdd/.git/`

- [ ] **Step 2: Create requirements-dev.txt**

```
pytest>=7.0
PyYAML>=6.0
```

Save to `requirements-dev.txt`.

- [ ] **Step 3: Create .gitignore**

```
__pycache__/
*.py[cod]
*.egg-info/
.pytest_cache/
dist/
.venv/
venv/
*.local.yml
```

Save to `.gitignore`.

- [ ] **Step 4: Create .extensionignore**

```
# Exclude test and development files from distribution
tests/
requirements-dev.txt
docs/superpowers/
.gitignore
.extensionignore
```

Save to `.extensionignore`.

- [ ] **Step 5: Install test dependencies**

```bash
cd /Users/ruben.soler/Workspace/spec-kit-bdd
python3 -m venv .venv && source .venv/bin/activate && pip install -r requirements-dev.txt
```

Expected: `Successfully installed pytest-X.X PyYAML-X.X`

- [ ] **Step 6: Create tests/fixtures/sample.spec.md**

```markdown
# User Authentication Feature Specification

## Overview
Allow registered users to log in to the application using email and password credentials.

## Acceptance Criteria

1. A user with valid credentials can log in and receives a session token.
2. A login attempt with an incorrect password is rejected with an error message.
3. A login attempt with an unregistered email is rejected with an error message.
4. After 5 consecutive failed attempts, the account is locked for 15 minutes.
5. Passwords must be at least 8 characters and contain at least one digit.

## User Stories

**As a** registered user, **I want** to log in with my email and password **so that** I can access my personal dashboard.

**As a** security-conscious user, **I want** my account locked after repeated failures **so that** brute-force attacks are prevented.
```

Save to `tests/fixtures/sample.spec.md`.

- [ ] **Step 7: Write tests/test_manifest.py**

```python
import re
from pathlib import Path
import pytest
import yaml

EXTENSION_YML = Path("extension.yml")
COMMANDS_DIR = Path("commands")


def load_manifest():
    return yaml.safe_load(EXTENSION_YML.read_text())


def test_manifest_file_exists():
    assert EXTENSION_YML.exists(), "extension.yml must exist at project root"


def test_schema_version():
    assert load_manifest()["schema_version"] == "1.0"


def test_extension_id():
    ext = load_manifest()["extension"]
    assert ext["id"] == "bdd"
    assert re.match(r"^[a-z0-9-]+$", ext["id"])


def test_extension_version_is_semver():
    version = load_manifest()["extension"]["version"]
    assert re.match(r"^\d+\.\d+\.\d+$", version), f"'{version}' is not semver"


def test_required_extension_fields():
    ext = load_manifest()["extension"]
    for field in ("id", "name", "version", "description", "author", "license"):
        assert field in ext, f"extension.{field} is required"


def test_description_length():
    desc = load_manifest()["extension"]["description"]
    assert len(desc) <= 200, "description must be <= 200 characters"


def test_speckit_version_constraint():
    constraint = load_manifest()["requires"]["speckit_version"]
    assert ">=" in constraint, "speckit_version must have a >= lower bound"


def test_all_three_commands_registered():
    commands = load_manifest()["provides"]["commands"]
    names = {c["name"] for c in commands}
    assert names == {
        "speckit.bdd.scenarios",
        "speckit.bdd.scaffold",
        "speckit.bdd.verify",
    }


def test_command_names_match_pattern():
    pattern = re.compile(r"^speckit\.[a-z0-9-]+\.[a-z0-9-]+$")
    for cmd in load_manifest()["provides"]["commands"]:
        assert pattern.match(cmd["name"]), f"'{cmd['name']}' violates naming pattern"


def test_each_command_has_description():
    for cmd in load_manifest()["provides"]["commands"]:
        assert cmd.get("description"), f"Command '{cmd['name']}' needs a description"


def test_command_files_exist():
    for cmd in load_manifest()["provides"]["commands"]:
        path = Path(cmd["file"])
        assert path.exists(), f"Command file '{cmd['file']}' declared but not found"


def test_hooks_after_specify_present():
    hooks = load_manifest().get("hooks", {})
    assert "after_specify" in hooks, "after_specify hook is required"


def test_hooks_before_implement_present():
    hooks = load_manifest().get("hooks", {})
    assert "before_implement" in hooks, "before_implement hook is required"


def test_tags_present():
    tags = load_manifest().get("tags", [])
    assert len(tags) >= 2, "At least 2 tags are required for catalog discoverability"
```

- [ ] **Step 8: Write tests/test_commands.py**

```python
from pathlib import Path
import pytest
import yaml

COMMANDS_DIR = Path("commands")


def read_command(filename: str) -> str:
    path = COMMANDS_DIR / filename
    assert path.exists(), f"commands/{filename} must exist"
    return path.read_text()


def parse_frontmatter(content: str) -> tuple[dict, str]:
    if not content.startswith("---"):
        return {}, content
    end = content.index("---", 3)
    fm = yaml.safe_load(content[3:end])
    body = content[end + 3:].strip()
    return fm, body


class TestScenariosCommand:
    def test_file_exists(self):
        assert (COMMANDS_DIR / "scenarios.md").exists()

    def test_has_description_in_frontmatter(self):
        fm, _ = parse_frontmatter(read_command("scenarios.md"))
        assert "description" in fm and len(fm["description"]) > 10

    def test_references_specify_artifact(self):
        content = read_command("scenarios.md")
        assert ".specify" in content, "Must reference the .specify/ artifact directory"

    def test_references_features_directory(self):
        content = read_command("scenarios.md")
        assert "features/" in content, "Must tell the agent to write to features/"

    def test_mentions_gherkin_keywords(self):
        content = read_command("scenarios.md")
        for keyword in ("Given", "When", "Then", "Feature", "Scenario"):
            assert keyword in content, f"Must mention Gherkin keyword '{keyword}'"

    def test_mentions_happy_path_and_edge_cases(self):
        content = read_command("scenarios.md").lower()
        assert "happy" in content or "success" in content
        assert "edge" in content or "error" in content

    def test_mentions_scenario_outline(self):
        content = read_command("scenarios.md")
        assert "Scenario Outline" in content or "scenario outline" in content.lower()

    def test_has_arguments_placeholder(self):
        assert "$ARGUMENTS" in read_command("scenarios.md")


class TestScaffoldCommand:
    def test_file_exists(self):
        assert (COMMANDS_DIR / "scaffold.md").exists()

    def test_has_description_in_frontmatter(self):
        fm, _ = parse_frontmatter(read_command("scaffold.md"))
        assert "description" in fm and len(fm["description"]) > 10

    def test_references_features_directory(self):
        content = read_command("scaffold.md")
        assert "features/" in content

    def test_mentions_step_definitions(self):
        content = read_command("scaffold.md").lower()
        assert "step" in content and ("definition" in content or "stub" in content)

    def test_supports_multiple_languages(self):
        content = read_command("scaffold.md")
        languages = ("Python", "JavaScript", "Ruby", "Java", "C#")
        found = sum(1 for lang in languages if lang in content)
        assert found >= 3, f"Must support ≥3 languages, found {found}"

    def test_mentions_language_detection(self):
        content = read_command("scaffold.md").lower()
        assert "detect" in content or "package.json" in content or "requirements.txt" in content

    def test_mentions_pending_implementation(self):
        content = read_command("scaffold.md")
        assert "TODO" in content or "NotImplementedError" in content or "pending" in content.lower()

    def test_has_arguments_placeholder(self):
        assert "$ARGUMENTS" in read_command("scaffold.md")


class TestVerifyCommand:
    def test_file_exists(self):
        assert (COMMANDS_DIR / "verify.md").exists()

    def test_has_description_in_frontmatter(self):
        fm, _ = parse_frontmatter(read_command("verify.md"))
        assert "description" in fm and len(fm["description"]) > 10

    def test_references_specify_artifact(self):
        content = read_command("verify.md")
        assert ".specify" in content

    def test_references_features_directory(self):
        content = read_command("verify.md")
        assert "features/" in content or "feature" in content.lower()

    def test_mentions_traceability(self):
        content = read_command("verify.md").lower()
        assert "traceab" in content or "coverage" in content

    def test_mentions_traceability_matrix_output(self):
        content = read_command("verify.md")
        assert "TRACEABILITY.md" in content or "traceability matrix" in content.lower()

    def test_mentions_coverage_percentage(self):
        content = read_command("verify.md").lower()
        assert "%" in content or "percent" in content or "coverage" in content

    def test_mentions_uncovered_requirements(self):
        content = read_command("verify.md").lower()
        assert "uncovered" in content or "missing" in content or "gap" in content

    def test_has_arguments_placeholder(self):
        assert "$ARGUMENTS" in read_command("verify.md")
```

- [ ] **Step 9: Run tests to confirm they are all RED**

```bash
cd /Users/ruben.soler/Workspace/spec-kit-bdd && source .venv/bin/activate
pytest tests/ -v 2>&1 | tail -20
```

Expected: All tests FAIL — `extension.yml` and `commands/` do not exist yet. You should see errors like `FileNotFoundError` or `AssertionError: extension.yml must exist at project root`.

- [ ] **Step 10: Commit**

```bash
git add tests/ requirements-dev.txt .gitignore .extensionignore
git commit -m "test: add ATDD validation tests for manifest and commands (all RED)"
```

---

### Task 2: Extension Manifest

**Files:**
- Create: `extension.yml`
- Create: `commands/scenarios.md` (stub — frontmatter only)
- Create: `commands/scaffold.md` (stub — frontmatter only)
- Create: `commands/verify.md` (stub — frontmatter only)

**Interfaces:**
- Produces: Valid `extension.yml` that passes all `test_manifest.py` tests
- Consumes: Nothing (standalone manifest)

- [ ] **Step 1: Write the failing test subset to run**

```bash
cd /Users/ruben.soler/Workspace/spec-kit-bdd && source .venv/bin/activate
pytest tests/test_manifest.py -v 2>&1 | grep -E "FAILED|ERROR" | head -10
```

Expected: 13 failures, all manifest-related.

- [ ] **Step 2: Create extension.yml**

```yaml
schema_version: "1.0"

extension:
  id: bdd
  name: "Spec-Kit BDD"
  version: "1.0.0"
  description: "ATDD/BDD extension: convert specs to Gherkin scenarios, scaffold step definitions, and verify acceptance test coverage."
  author: "spec-kit-bdd contributors"
  repository: "https://github.com/your-org/spec-kit-bdd"
  license: "MIT"
  homepage: "https://github.com/your-org/spec-kit-bdd"

requires:
  speckit_version: ">=0.2.0"

provides:
  commands:
    - name: speckit.bdd.scenarios
      file: commands/scenarios.md
      description: "Convert spec-kit specification into Gherkin BDD feature files"
    - name: speckit.bdd.scaffold
      file: commands/scaffold.md
      description: "Generate step definition stubs from existing Gherkin feature files"
    - name: speckit.bdd.verify
      file: commands/verify.md
      description: "Verify BDD scenario coverage against the spec-kit specification"

hooks:
  after_specify:
    command: speckit.bdd.scenarios
    priority: 10
    optional: true
    prompt: "Generate Gherkin acceptance scenarios from the spec before planning?"
    description: "Converts acceptance criteria into Gherkin feature files immediately after spec is written"
  before_implement:
    command: speckit.bdd.scaffold
    priority: 10
    optional: true
    prompt: "Scaffold step definition stubs before starting implementation?"
    description: "Creates step definition stubs so acceptance tests run (and fail) before any code is written"

tags:
  - bdd
  - gherkin
  - atdd
  - acceptance-testing
  - tdd
  - quality
```

Save to `extension.yml`.

- [ ] **Step 3: Create command stub files**

Create `commands/scenarios.md`:

```markdown
---
description: "Convert spec-kit specification into Gherkin BDD feature files"
---

Stub — implementation in Task 3.

$ARGUMENTS
```

Create `commands/scaffold.md`:

```markdown
---
description: "Generate step definition stubs from existing Gherkin feature files"
---

Stub — implementation in Task 4.

$ARGUMENTS
```

Create `commands/verify.md`:

```markdown
---
description: "Verify BDD scenario coverage against the spec-kit specification"
---

Stub — implementation in Task 5.

$ARGUMENTS
```

- [ ] **Step 4: Run manifest tests — confirm GREEN**

```bash
cd /Users/ruben.soler/Workspace/spec-kit-bdd && source .venv/bin/activate
pytest tests/test_manifest.py -v
```

Expected: All 13 manifest tests PASS.

- [ ] **Step 5: Commit**

```bash
git add extension.yml commands/
git commit -m "feat: add extension manifest and command stubs"
```

---

### Task 3: Scenarios Command

**Files:**
- Modify: `commands/scenarios.md` (replace stub with full prompt)

**Interfaces:**
- Consumes: `.specify/specify.md` (spec-kit artifact, read by the AI at runtime)
- Produces: `features/*.feature` + `features/README.md` (written by AI agent at runtime)

- [ ] **Step 1: Run scenarios command tests to see current failures**

```bash
cd /Users/ruben.soler/Workspace/spec-kit-bdd && source .venv/bin/activate
pytest tests/test_commands.py::TestScenariosCommand -v
```

Expected: 7 FAILED (all except `test_file_exists` which passes due to stub).

- [ ] **Step 2: Replace commands/scenarios.md with the full implementation**

```markdown
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
    Given the user has failed to log in 4 times consecutively
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
```

- [ ] **Step 3: Run scenarios tests — confirm GREEN**

```bash
cd /Users/ruben.soler/Workspace/spec-kit-bdd && source .venv/bin/activate
pytest tests/test_commands.py::TestScenariosCommand -v
```

Expected: All 8 scenarios tests PASS.

- [ ] **Step 4: Run full test suite — confirm no regressions**

```bash
pytest tests/ -v
```

Expected: All manifest tests PASS, all scenarios tests PASS, scaffold and verify tests still partially FAIL (those are next).

- [ ] **Step 5: Commit**

```bash
git add commands/scenarios.md
git commit -m "feat: implement speckit.bdd.scenarios command prompt"
```

---

### Task 4: Scaffold Command

**Files:**
- Modify: `commands/scaffold.md` (replace stub with full prompt)

**Interfaces:**
- Consumes: `features/*.feature` (Gherkin files produced by `speckit.bdd.scenarios`)
- Produces: Step definition stub files in the appropriate framework directory (written by AI at runtime)

- [ ] **Step 1: Run scaffold tests to see current failures**

```bash
cd /Users/ruben.soler/Workspace/spec-kit-bdd && source .venv/bin/activate
pytest tests/test_commands.py::TestScaffoldCommand -v
```

Expected: 6 FAILED (description test passes due to stub frontmatter).

- [ ] **Step 2: Replace commands/scaffold.md with full implementation**

```markdown
---
description: "Generate step definition stubs from existing Gherkin feature files"
---

You are a BDD expert. Read all Gherkin feature files in the `features/` directory and generate step definition stubs that developers will implement to make the scenarios executable. This command embodies the ATDD principle: the tests must exist and fail before any implementation code is written.

## Discover Feature Files

Read every `*.feature` file in `features/`. If no feature files exist, tell the user: "No feature files found in features/. Run `/speckit.bdd.scenarios` first to generate them from the spec."

## Extract All Unique Steps

Collect every `Given`, `When`, `Then`, `And`, `But` step across all feature files. Normalize them:
- Strip `And` / `But` prefixes and classify by their logical type (`Given`/`When`/`Then`)
- Convert quoted literal values to parameters: `"alice@example.com"` → `{email}` (or the framework-specific pattern)
- Deduplicate steps that differ only in parameter values

## Detect Project Language

Check for these files in the project root and `src/` directories:

| File found            | Language     | Framework              |
|-----------------------|--------------|------------------------|
| `requirements.txt` or `pyproject.toml` | Python | pytest-bdd (preferred) or behave |
| `package.json`        | JavaScript/TypeScript | @cucumber/cucumber |
| `Gemfile`             | Ruby         | cucumber               |
| `pom.xml` or `build.gradle` | Java   | io.cucumber            |
| `*.csproj` or `*.sln` | C#          | SpecFlow               |

If no indicator is found, default to **Python (pytest-bdd)** and tell the user which default was applied.

## Generate Step Definition Files

### Python — pytest-bdd

Output path: `tests/step_defs/test_steps.py`

Also create `tests/step_defs/conftest.py`:
```python
import pytest

@pytest.fixture
def context():
    """Shared state bag for passing data between steps."""
    return {}
```

Main step file pattern:
```python
import pytest
from pytest_bdd import scenarios, given, when, then, parsers

scenarios("../../features/")

@given("the application is running")
def application_is_running():
    # TODO: Start the application under test or verify it is already running
    raise NotImplementedError("Implement: ensure app is running")

@given(parsers.parse('a user account exists with email "{email}" and password "{password}"'))
def existing_user(email, password):
    # TODO: Insert a test user with these credentials into the test database
    raise NotImplementedError("Implement: create user fixture")

@when(parsers.parse('the user submits login with email "{email}" and password "{password}"'))
def user_submits_login(email, password, context):
    # TODO: POST /auth/login with {"email": email, "password": password}, store response in context["response"]
    raise NotImplementedError("Implement: submit login request")

@then(parsers.parse('the error message "{message}" is displayed'))
def error_message_displayed(message, context):
    # TODO: Assert context["response"].json()["error"] == message
    raise NotImplementedError("Implement: check error response")
```

### Python — behave

Output path: `features/steps/steps.py`

```python
from behave import given, when, then, step
from behave import register_type
import parse

@given("the application is running")
def step_app_running(context):
    # TODO: Verify the application is accessible
    raise NotImplementedError("Implement: ensure app is running")

@given('a user account exists with email "{email}" and password "{password}"')
def step_user_exists(context, email, password):
    # TODO: Create test user in the database
    raise NotImplementedError("Implement: create user fixture")

@when('the user submits login with email "{email}" and password "{password}"')
def step_submit_login(context, email, password):
    # TODO: POST /auth/login, store response in context.response
    raise NotImplementedError("Implement: submit login")

@then('the error message "{message}" is displayed')
def step_error_displayed(context, message):
    # TODO: Assert context.response.json["error"] == message
    raise NotImplementedError("Implement: check error message")
```

### JavaScript (@cucumber/cucumber)

Output path: `features/step_definitions/steps.js`

```javascript
const { Given, When, Then } = require('@cucumber/cucumber');
const assert = require('assert');

Given('the application is running', async function () {
  // TODO: Verify the application is accessible at process.env.APP_URL
  throw new Error('Pending: ensure app is running');
});

Given('a user account exists with email {string} and password {string}', async function (email, password) {
  // TODO: Insert test user via API or database seed
  throw new Error('Pending: create user fixture');
});

When('the user submits login with email {string} and password {string}', async function (email, password) {
  // TODO: POST /auth/login, store response in this.response
  throw new Error('Pending: submit login request');
});

Then('the error message {string} is displayed', async function (message) {
  // TODO: assert this.response.body.error === message
  throw new Error('Pending: check error message');
});
```

### Ruby (Cucumber)

Output path: `features/step_definitions/steps.rb`

```ruby
Given("the application is running") do
  # TODO: Verify the application is responding at the configured base URL
  pending
end

Given("a user account exists with email {string} and password {string}") do |email, password|
  # TODO: Create a user record in the test database
  pending
end

When("the user submits login with email {string} and password {string}") do |email, password|
  # TODO: POST to /auth/login, store response in @response
  pending
end

Then("the error message {string} is displayed") do |message|
  # TODO: expect(@response.body["error"]).to eq(message)
  pending
end
```

### Java (io.cucumber)

Output path: `src/test/java/steps/StepDefinitions.java`

```java
package steps;

import io.cucumber.java.en.*;
import static org.junit.jupiter.api.Assertions.*;

public class StepDefinitions {

    @Given("the application is running")
    public void theApplicationIsRunning() {
        // TODO: Verify the application is accessible via HTTP health check
        throw new io.cucumber.java.PendingException();
    }

    @Given("a user account exists with email {string} and password {string}")
    public void aUserAccountExists(String email, String password) {
        // TODO: Insert a test user via the UserRepository or a test fixture API
        throw new io.cucumber.java.PendingException();
    }

    @When("the user submits login with email {string} and password {string}")
    public void userSubmitsLogin(String email, String password) {
        // TODO: POST /auth/login with email and password, store response in a shared context
        throw new io.cucumber.java.PendingException();
    }

    @Then("the error message {string} is displayed")
    public void errorMessageIsDisplayed(String message) {
        // TODO: Assert that the response body contains {"error": message}
        throw new io.cucumber.java.PendingException();
    }
}
```

### C# (SpecFlow)

Output path: `Features/StepDefinitions/StepDefinitions.cs`

```csharp
using TechTalk.SpecFlow;
using NUnit.Framework;

namespace Features.StepDefinitions
{
    [Binding]
    public class StepDefinitions
    {
        [Given(@"the application is running")]
        public void GivenTheApplicationIsRunning()
        {
            // TODO: Verify the application is running via HTTP health check
            throw new PendingStepException();
        }

        [Given(@"a user account exists with email ""(.*)"" and password ""(.*)""")]
        public void GivenAUserAccountExists(string email, string password)
        {
            // TODO: Create a test user in the database
            throw new PendingStepException();
        }

        [When(@"the user submits login with email ""(.*)"" and password ""(.*)""")]
        public void WhenTheUserSubmitsLogin(string email, string password)
        {
            // TODO: POST /auth/login and store the response
            throw new PendingStepException();
        }

        [Then(@"the error message ""(.*)"" is displayed")]
        public void ThenTheErrorMessageIsDisplayed(string message)
        {
            // TODO: Assert the response contains the expected error message
            throw new PendingStepException();
        }
    }
}
```

## After Generation

Create `features/step_definitions/README.md`:

```markdown
# Step Definitions

**Detected framework:** [framework name]

## Running scenarios

[Framework-specific command, e.g.:]
- pytest-bdd: `pytest tests/step_defs/ -v`
- behave: `behave features/`
- Cucumber.js: `npx cucumber-js`
- Cucumber (Ruby): `bundle exec cucumber`
- Cucumber (Java): `mvn test`
- SpecFlow: `dotnet test`

## What to implement

All stubs raise `NotImplementedError` / `pending` / `PendingException`. Replace each one with:
1. Application interaction (HTTP call, UI action, database query)
2. An assertion verifying the expected outcome

Implement one step at a time, re-running the suite after each.
```

Summarize in chat: which framework was detected, how many step stubs were generated, and the command to run the scenarios.

$ARGUMENTS
```

- [ ] **Step 3: Run scaffold tests — confirm GREEN**

```bash
cd /Users/ruben.soler/Workspace/spec-kit-bdd && source .venv/bin/activate
pytest tests/test_commands.py::TestScaffoldCommand -v
```

Expected: All 8 scaffold tests PASS.

- [ ] **Step 4: Commit**

```bash
git add commands/scaffold.md
git commit -m "feat: implement speckit.bdd.scaffold command prompt"
```

---

### Task 5: Verify Command

**Files:**
- Modify: `commands/verify.md` (replace stub with full prompt)

**Interfaces:**
- Consumes: `.specify/specify.md` + `features/*.feature`
- Produces: `features/TRACEABILITY.md` (written by AI at runtime) + chat summary

- [ ] **Step 1: Run verify tests to see current failures**

```bash
cd /Users/ruben.soler/Workspace/spec-kit-bdd && source .venv/bin/activate
pytest tests/test_commands.py::TestVerifyCommand -v
```

Expected: 7 FAILED.

- [ ] **Step 2: Replace commands/verify.md with full implementation**

```markdown
---
description: "Verify BDD scenario coverage against the spec-kit specification"
---

You are a BDD quality auditor. Compare the spec-kit specification with existing Gherkin feature files to find coverage gaps and produce a traceability matrix. This command completes the ATDD loop: after implementation, verify that every acceptance criterion is covered by a scenario.

## Read Inputs

1. **Specification** — Read `.specify/specify.md`. If not found, check `specify.md` at root. If neither exists, report: "No specification found. Run `/speckit.specify` first."
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
```

- [ ] **Step 3: Run verify tests — confirm GREEN**

```bash
cd /Users/ruben.soler/Workspace/spec-kit-bdd && source .venv/bin/activate
pytest tests/test_commands.py::TestVerifyCommand -v
```

Expected: All 9 verify tests PASS.

- [ ] **Step 4: Run full test suite — all GREEN**

```bash
pytest tests/ -v
```

Expected: All tests PASS. You should see `X passed` with 0 failures.

- [ ] **Step 5: Commit**

```bash
git add commands/verify.md
git commit -m "feat: implement speckit.bdd.verify command prompt"
```

---

### Task 6: Documentation and Examples

**Files:**
- Create: `README.md`
- Create: `CHANGELOG.md`
- Create: `LICENSE`
- Create: `docs/usage.md`
- Create: `docs/examples/sample.spec.md`
- Create: `docs/examples/user-auth.feature`
- Create: `docs/examples/steps_example.py`

**Interfaces:**
- Produces: Complete documentation; no new tests needed (documentation is validated by humans)

- [ ] **Step 1: Create LICENSE**

```
MIT License

Copyright (c) 2026 spec-kit-bdd contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

Save to `LICENSE`.

- [ ] **Step 2: Create CHANGELOG.md**

```markdown
# Changelog

All notable changes to spec-kit-bdd will be documented in this file.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [1.0.0] - 2026-07-14

### Added
- `speckit.bdd.scenarios` — converts spec-kit specifications into Gherkin feature files
- `speckit.bdd.scaffold` — generates step definition stubs for Python, JavaScript, Ruby, Java, and C#
- `speckit.bdd.verify` — produces a traceability matrix and coverage report
- `after_specify` hook — optionally triggers scenario generation after `/speckit.specify`
- `before_implement` hook — optionally scaffolds step stubs before `/speckit.implement`
```

Save to `CHANGELOG.md`.

- [ ] **Step 3: Create README.md**

```markdown
# spec-kit-bdd

A [spec-kit](https://github.com/github/spec-kit) community extension that adds Behavior-Driven Development (BDD) and Acceptance Test-Driven Development (ATDD) to the spec-driven workflow.

## What it does

| Command | What it produces |
|---------|-----------------|
| `/speckit.bdd.scenarios` | Gherkin `.feature` files from your spec-kit specification |
| `/speckit.bdd.scaffold` | Step definition stubs (Python, JS, Ruby, Java, C#) ready to implement |
| `/speckit.bdd.verify` | A traceability matrix mapping spec requirements ↔ scenarios |

**ATDD workflow:** write acceptance tests before writing code.

```
speckit.specify → speckit.bdd.scenarios → speckit.plan → speckit.tasks
                                                                      ↓
speckit.implement ← speckit.bdd.scaffold ←────────────────────────────
       ↓
speckit.bdd.verify
```

## Installation

```bash
specify extension add https://github.com/your-org/spec-kit-bdd/releases/download/v1.0.0/spec-kit-bdd-1.0.0.tar.gz
```

Or clone and install locally for development:

```bash
git clone https://github.com/your-org/spec-kit-bdd
specify extension add --dev ./spec-kit-bdd
```

## Usage

### 1. Generate Gherkin scenarios from your spec

After running `/speckit.specify`, convert acceptance criteria to Gherkin:

```
/speckit.bdd.scenarios
```

This creates `features/*.feature` files. Review them — they define what the system must do.

### 2. Scaffold step definitions before implementing

Before writing any application code:

```
/speckit.bdd.scaffold
```

This generates `features/step_definitions/` (or framework equivalent) with stubs that raise `NotImplementedError`. Your tests now exist and **fail** — as intended.

### 3. Implement until tests pass

Write code until `pytest tests/step_defs/ -v` (or equivalent) shows all scenarios passing.

### 4. Verify coverage

After implementing:

```
/speckit.bdd.verify
```

This produces `features/TRACEABILITY.md` showing which spec requirements are covered by scenarios, and highlights any gaps.

## Hooks

The extension registers two optional hooks:

- **`after_specify`** — prompts you to run scenario generation immediately after writing your spec
- **`before_implement`** — prompts you to scaffold step stubs before starting implementation

Both hooks are `optional: true` — they ask for confirmation and can be skipped.

## Requirements

- spec-kit `>=0.2.0`
- Any AI coding agent supported by spec-kit (Claude, Copilot, Cursor, etc.)

## Contributing

See [docs/usage.md](docs/usage.md) for full usage details and examples.
```

- [ ] **Step 4: Create docs/examples/sample.spec.md**

```markdown
# User Authentication — spec-kit Specification

## Overview
Allow registered users to log into the application with email and password.

## Acceptance Criteria

1. A user with valid credentials receives a session token and is redirected to the dashboard.
2. A login attempt with an incorrect password is rejected with the message "Invalid credentials".
3. A login attempt with an unregistered email is rejected with the message "Invalid credentials".
4. After 5 consecutive failed login attempts, the account is locked for 15 minutes.
5. Email must match RFC 5321 format; invalid formats are rejected with "Invalid email format".
6. Passwords must be at least 8 characters and contain at least one digit.

## User Stories

**As a** registered user, **I want** to log in with my email and password **so that** I can access my personal dashboard.

**As a** security-conscious user, **I want** my account locked after repeated failures **so that** brute-force attacks are prevented.
```

Save to `docs/examples/sample.spec.md`.

- [ ] **Step 5: Create docs/examples/user-auth.feature**

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
      | email             |
      | notanemail        |
      | @nodomain.com     |
      | missing-at-sign   |
      | spaces @test.com  |

  Scenario: Weak password is rejected during registration
    When the user attempts to register with email "bob@example.com" and password "abc"
    Then the error message "Password must be at least 8 characters and contain a digit" is displayed
```

Save to `docs/examples/user-auth.feature`.

- [ ] **Step 6: Create docs/examples/steps_example.py**

```python
# Example pytest-bdd step definitions — generated by /speckit.bdd.scaffold
# Replace each `raise NotImplementedError` with your actual implementation.

import pytest
from pytest_bdd import scenarios, given, when, then, parsers

scenarios("../../features/")


@pytest.fixture
def context():
    return {}


@given("the application is running")
def application_is_running(app_client):
    # TODO: Confirm the app is reachable; app_client fixture should set up a test HTTP client
    raise NotImplementedError("Implement: ensure app is running")


@given(parsers.parse('a user account exists with email "{email}" and password "{password}"'))
def existing_user(db, email, password):
    # TODO: Use the db fixture to INSERT a user row with a hashed password
    raise NotImplementedError("Implement: seed user in test database")


@given(parsers.parse('the user has failed to log in {count:d} times consecutively with email "{email}"'))
def user_has_failed_logins(db, count, email):
    # TODO: Insert `count` failed login attempt records for this email in the DB
    raise NotImplementedError("Implement: seed failed login records")


@when(parsers.parse('the user submits login with email "{email}" and password "{password}"'))
def user_submits_login(app_client, email, password, context):
    # TODO: POST /auth/login with {"email": email, "password": password}
    # Store the response: context["response"] = app_client.post("/auth/login", json={...})
    raise NotImplementedError("Implement: POST to /auth/login")


@when(parsers.parse('the user attempts to register with email "{email}" and password "{password}"'))
def user_attempts_registration(app_client, email, password, context):
    # TODO: POST /auth/register with the given credentials
    raise NotImplementedError("Implement: POST to /auth/register")


@then("the user is redirected to the dashboard")
def user_redirected_to_dashboard(context):
    # TODO: Assert context["response"].status_code == 302
    # Assert context["response"].headers["Location"] == "/dashboard"
    raise NotImplementedError("Implement: check redirect response")


@then("a session token is issued")
def session_token_issued(context):
    # TODO: Assert "token" in context["response"].json()
    raise NotImplementedError("Implement: verify token in response")


@then("no session token is issued")
def no_session_token_issued(context):
    # TODO: Assert "token" not in context["response"].json()
    raise NotImplementedError("Implement: verify no token in error response")


@then(parsers.parse('the error message "{message}" is displayed'))
def error_message_displayed(message, context):
    # TODO: Assert context["response"].json()["error"] == message
    raise NotImplementedError("Implement: check error message in response body")


@then("the account is locked for 15 minutes")
def account_is_locked(db, context):
    # TODO: Query the DB and assert the user's locked_until timestamp is ~15 minutes from now
    raise NotImplementedError("Implement: verify account lock in database")
```

Save to `docs/examples/steps_example.py`.

- [ ] **Step 7: Create docs/usage.md**

```markdown
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

Reads `.specify/specify.md` and generates `features/*.feature` files.

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
```

- [ ] **Step 8: Run full test suite — confirm still all GREEN**

```bash
cd /Users/ruben.soler/Workspace/spec-kit-bdd && source .venv/bin/activate
pytest tests/ -v
```

Expected: All tests PASS. No regressions.

- [ ] **Step 9: Commit**

```bash
git add README.md LICENSE CHANGELOG.md docs/
git commit -m "docs: add README, usage guide, examples, and license"
```

---

### Task 7: Integration Smoke Test

**Files:**
- No new files — validates the extension can be installed with the spec-kit CLI

**Interfaces:**
- Consumes: All files created in Tasks 1–6
- Produces: Confirmation that `specify extension add --dev .` succeeds and lists the extension

- [ ] **Step 1: Check if spec-kit CLI is installed**

```bash
which specify || echo "spec-kit CLI not installed"
specify --version || echo "spec-kit not available"
```

If `specify` is not installed, skip to Step 4 and note the manual validation instead.

- [ ] **Step 2: Install extension in dev mode**

```bash
cd /Users/ruben.soler/Workspace/spec-kit-bdd
specify extension add --dev .
```

Expected output: `✓ Extension 'bdd' installed (dev mode)`

- [ ] **Step 3: Verify extension is registered and commands are listed**

```bash
specify extension list
```

Expected: `bdd` appears in the list with version `1.0.0` and commands `speckit.bdd.scenarios`, `speckit.bdd.scaffold`, `speckit.bdd.verify`.

- [ ] **Step 4: Manual validation checklist (if spec-kit CLI unavailable)**

Open a new project directory and verify the extension would work by checking these files exist and are non-empty:

```bash
cd /Users/ruben.soler/Workspace/spec-kit-bdd
test -f extension.yml && echo "✓ extension.yml"
test -f commands/scenarios.md && echo "✓ commands/scenarios.md"
test -f commands/scaffold.md && echo "✓ commands/scaffold.md"
test -f commands/verify.md && echo "✓ commands/verify.md"
test -f README.md && echo "✓ README.md"
test -f LICENSE && echo "✓ LICENSE"
test -f CHANGELOG.md && echo "✓ CHANGELOG.md"
python3 -c "import yaml; yaml.safe_load(open('extension.yml'))" && echo "✓ extension.yml is valid YAML"
```

Expected: All 8 lines print `✓`.

- [ ] **Step 5: Final full test suite run**

```bash
cd /Users/ruben.soler/Workspace/spec-kit-bdd && source .venv/bin/activate
pytest tests/ -v --tb=short
```

Expected: All tests PASS, 0 warnings, 0 errors.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "chore: integration validation complete — v1.0.0 ready"
```

---

## Self-Review

### Spec Coverage Check

| Requirement | Covered by Task |
|-------------|-----------------|
| BDD extension for spec-kit | Task 2 (extension.yml manifest) |
| ATDD: acceptance tests first | Task 1 (tests written before implementation), Task 3–5 hooks guidance |
| Gherkin scenario generation from spec | Task 3 (scenarios.md) |
| Step definition scaffolding | Task 4 (scaffold.md) |
| Coverage verification | Task 5 (verify.md) |
| Multiple language support | Task 4 (Python/JS/Ruby/Java/C#) |
| spec-kit lifecycle hooks | Task 2 (after_specify, before_implement in extension.yml) |
| Community extension format | Task 2 (extension.yml follows schema_version 1.0) |
| Documentation | Task 6 |
| Integration validation | Task 7 |

No gaps found.

### Placeholder Scan

- No "TBD", "TODO", or "implement later" in plan steps (TODOs in generated example code are intentional — they are the product)
- All code blocks are complete
- All file paths are exact and consistent across tasks
- `$ARGUMENTS` placeholder present in all three command files ✓

### Type Consistency

- `extension.yml` → `provides.commands[].name` values match exactly what `test_manifest.py::test_all_three_commands_registered` asserts
- `provides.commands[].file` paths (`commands/scenarios.md`, etc.) match what `test_commands.py` reads
- Hook keys `after_specify` and `before_implement` match what `test_manifest.py` asserts
