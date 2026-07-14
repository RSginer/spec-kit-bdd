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
