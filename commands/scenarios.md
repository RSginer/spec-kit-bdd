---
description: "Convert spec-kit specification into Gherkin BDD feature files"
---

You are a BDD expert applying Acceptance Test-Driven Development (ATDD). Read the current spec-kit specification and produce comprehensive Gherkin feature files that will drive implementation. Write the acceptance tests **before** any code exists — that is the ATDD principle.

## Read the Specification

Resolve the active feature specification:

1. If `SPECIFY_FEATURE_DIRECTORY` is set, treat it as the feature directory.
2. Otherwise, read `feature_directory` from `.specify/feature.json`.
3. Read the specification from `<feature_directory>/spec.md`.

If no feature directory can be resolved, or `<feature_directory>/spec.md` does not exist, fall back to `.specify/specify.md`, then `specify.md` at the project root. If none of these resolve, tell the user: "No spec-kit specification found. Run `/speckit.specify` first, then re-run this command."

## Detect Consumer Type

Before generating scenarios, determine **who or what acts as the primary actor** — this
determines the phrasing of every `As a`/`When`/`Then` step. Check the project root (and,
for Node/Python, the manifest file's dependency lists) for these signals:

| Signal category | Node/TS (`package.json`) | Python (`requirements.txt` / `pyproject.toml`) | Ruby (`Gemfile`/`.gemspec`) | Java (`pom.xml`/`build.gradle`) | C# (`*.csproj`) |
|---|---|---|---|---|---|
| **Frontend / UI** | `react`, `react-dom`, `vue`, `svelte`, `@angular/core`, `next`, `nuxt` in `dependencies` | `django` templates + no DRF/ninja API-only config, or a paired `frontend/`/`static/` app | `Rails` with view/asset pipeline (not `--api` mode) | Spring MVC with Thymeleaf/JSP views | Razor Pages / Blazor / MVC views |
| **CLI** | `bin` field in `package.json` **and** `commander`, `yargs`, or `oclif` in `dependencies` | `click`, `typer`, or `argparse`-based `console_scripts` entry point in `pyproject.toml`/`setup.py`, no web framework | `bin/` executable + `Gemfile` has no Rails/Sinatra | `Main-Class` manifest entry, no Spring Boot web starter | `<OutputType>Exe</OutputType>`, no ASP.NET Core |
| **GraphQL** | `graphql`, `apollo-server*`, `graphql-yoga`, `@nestjs/graphql` in `dependencies`; or a `*.graphql`/`*.gql`/`schema.graphql` file | `graphene`, `strawberry-graphql`, `ariadne` | `graphql-ruby` gem | `graphql-java`, `com.netflix.graphql.*` | `HotChocolate`, `GraphQL.NET` |
| **REST API** | `express`, `fastify`, `koa`, `@nestjs/core` (without a paired frontend framework above) in `dependencies` | `fastapi`, `flask`, `django-rest-framework` (`djangorestframework`) in requirements | `sinatra`, or `rails` in `--api` mode (`config.api_only = true`) | `spring-boot-starter-web` without a view engine | `Microsoft.AspNetCore.*` without Razor/Blazor views |
| **Other API shape** (gRPC / WebSocket / SOAP / event-driven) | `@grpc/grpc-js`, `grpc-js`, `ws`, `socket.io`, `soap` in `dependencies` | `grpcio`, `websockets`, `zeep`, `aio-pika` | `grpc` gem, `faye-websocket` | `grpc-java`, `io.grpc.*` | `Grpc.AspNetCore`, `SignalR` |
| **Library / SDK** | `package.json` has `main`/`module`/`types`/`exports` fields, **no** `bin`, **no** server/frontend/CLI framework in `dependencies` | Installable package (`pyproject.toml` with `[build-system]`/`setup.py`) with no web/CLI framework dependency, meant to be `import`-ed | `.gemspec` with no Rails/Sinatra, meant to be `require`-d | Published artifact (jar with no `main` web starter), no CLI/web entry point | Class library `.csproj` (no `OutputType=Exe`, no ASP.NET Core) |

**Precedence when multiple signals are present** (check in this order, stop at the first match):

1. **Frontend/UI signal found** → the project has a human-facing UI, even if it also has a REST/GraphQL backend behind it. Use **Human end user of UI**. (The API is implementation detail behind the screen the human actually uses.)
2. **CLI signal found** (and no UI signal) → **CLI user**.
3. **GraphQL signal found** (and no UI/CLI signal) → **GraphQL client**.
4. **REST API signal found** (and no UI/CLI/GraphQL signal) → **REST API client**.
5. **Other API-shape signal found** (gRPC/WebSocket/SOAP, and none of the above) → **Other/generic API consumer**.
6. **Library/SDK shape** (installable/importable package, no server/CLI/frontend/UI entry point at all) → **Library/SDK consumer**.
7. **No manifest file and no recognizable project layout** → apply the fallback below.

If signals conflict in a way not resolved by the precedence order above (e.g., both `express`
and `graphql` appear with no clear frontend), prefer the **more specific** protocol: GraphQL
over generic REST if a GraphQL endpoint/schema is the primary interface; otherwise default to
REST API client, since REST is the more common shape for a plain HTTP server framework.

**Fallback default:** if no signal matches any category (empty repo, spec-only project, or an
unrecognized stack), default to **Human end user of UI** — this preserves the extension's
original default behavior — and tell the user in the chat summary which default was applied
and why (mirroring the fallback-disclosure pattern used by `/speckit.bdd.scaffold`).

The six consumer types and their phrasing anchor:

| # | Consumer type | `As a` line | Step phrasing anchor |
|---|---|---|---|
| 1 | REST API client | `As a REST API client` | "the API client POSTs/GETs/PUTs/DELETEs `<path>` with ..." |
| 2 | GraphQL client | `As a GraphQL client` | "the client sends a mutation/query to ..." |
| 3 | Other/generic API consumer | `As an API consumer` | phrase at the protocol-appropriate level, e.g. "the client opens a WebSocket connection and sends ...", "the caller invokes the `CreateTodo` RPC with ..." |
| 4 | CLI user | `As a CLI user` | "the user runs `<command> <args>`" / "the command exits with status `<code>`" / "stdout contains ..." |
| 5 | Library/SDK consumer | `As a developer integrating the library` | "the caller invokes `functionName(...)`" / "the call returns ..." / "the call raises ..." |
| 6 | Human end user of UI | `As a user` | "the user submits/clicks/enters ..." (existing default behavior — unchanged) |

## Generate Feature Files

For each distinct user-facing feature, capability, or user story in the spec:

0. **Reframe the actor — do not copy `spec.md`'s wording verbatim.** `spec.md`'s
   Acceptance Scenarios are written generically as "the user does X" regardless of the
   target project's shape. Translate that phrasing into the consumer type detected above:
   "the user creates a todo" becomes "the API client POSTs `/todos` with ..." for a REST
   API, "the caller invokes `createTodo(...)`" for a library, "the user runs
   `myapp todo add "..."`" for a CLI, etc. Only keep `spec.md`'s literal "the user ..."
   wording when the detected consumer type is **Human end user of UI** (category 6) — that
   is the one case where `spec.md`'s phrasing is already correct as written.
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

## Examples of Correct Gherkin

### Example: Human end user of a UI

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

### Example: REST API client

```gherkin
Feature: Manage tasks via the tasks API
  As a REST API client
  I want to create and retrieve tasks
  So that I can track work programmatically

  Background:
    Given the API is running
    And the task store is empty

  Scenario: Create a task with valid data
    When the API client POSTs "/tasks" with title "Write release notes" and priority "high"
    Then the response status should be 201
    And the response body should contain a task with title "Write release notes", priority "high", and status "open"

  Scenario: List existing tasks
    Given a task exists with title "Fix login bug" and priority "high"
    And a task exists with title "Update dependencies" and priority "low"
    When the API client GETs "/tasks"
    Then the response status should be 200
    And the response body should contain both tasks with their titles and priorities

  Scenario: Reject a task with a missing title
    When the API client POSTs "/tasks" with title "" and priority "medium"
    Then the response status should be 400
    And the response body should report an invalid task title

  Scenario: Requesting an unknown task returns 404
    When the API client GETs "/tasks/does-not-exist"
    Then the response status should be 404
    And the response body should report that the task was not found

  Scenario Outline: Reject a task with an invalid priority
    When the API client POSTs "/tasks" with title "Review PR" and priority "<priority>"
    Then the response status should be 400

    Examples:
      | priority |
      | urgent   |
      | ""       |
      | 5        |
```

## Output

- Save each feature file to `features/<feature-name>.feature`
- Create `features/README.md` listing every feature file with a one-line purpose description

After writing the files, summarize in chat:
- Which consumer type was detected (or which default was assumed, and why)
- How many feature files were created
- Total scenario count (including Scenario Outline examples rows)
- Any spec requirements that were ambiguous and required assumptions

$ARGUMENTS
