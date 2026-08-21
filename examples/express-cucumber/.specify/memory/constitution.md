<!--
Sync Impact Report
- Version change: unversioned scaffold -> 1.0.0
- Modified principles: none; all five principles are newly established
- Added sections: Runtime Constraints; Development Workflow
- Removed sections: none
- Follow-up TODOs: Confirm the project's original ratification date and replace
	TODO(RATIFICATION_DATE) when known.
-->

# Express Cucumber Example Constitution

## Core Principles

### I. Behavior-First Delivery
Every user-visible behavior MUST be described by a readable Cucumber feature and
scenario before implementation is considered complete. Scenarios MUST express
observable outcomes and MUST remain independent of implementation details. This
keeps the executable specification aligned with the service's purpose.

### II. Small Application Boundary
Application construction MUST be exposed through a testable factory such as
`createApp`, while process startup and listening MUST remain outside that
factory. Routes MUST be added through the application boundary and MUST avoid
owning global mutable state unless explicitly required by the behavior.

### III. Testable Contracts
Every endpoint or service contract change MUST include automated coverage for
successful behavior and relevant failure behavior. Tests MUST assert public
responses, status codes, and payloads rather than private implementation
details. A change is not complete while the focused test suite is failing.

### IV. Integration at the HTTP Boundary
HTTP behavior MUST be tested through the assembled Express application using the
same public boundary that callers use. Unit tests MAY supplement these checks,
but they MUST NOT replace integration coverage for routes, middleware, status
codes, or response bodies. This catches wiring and middleware regressions.

### V. Minimal, Explicit Change
Implementations MUST use the smallest design that satisfies the documented
behavior and MUST avoid speculative abstractions, dependencies, and
configuration. Public behavior changes MUST be documented in the feature
specification and reviewed for compatibility. Simplicity is required because
this example is intended to remain readable as a reference project.

## Runtime Constraints

The service MUST remain compatible with the repository's TypeScript, Node.js,
Express, and Cucumber toolchain as declared in `package.json`. JSON APIs MUST
return an explicit status code and a stable response shape. Secrets MUST NOT be
committed to the repository or embedded in source code. Changes that alter
startup, routing, or middleware behavior MUST preserve the ability to construct
the application without opening a listening socket.

## Development Workflow

Changes MUST be validated with `npm test` and `npm run build` before merge.
Pull requests MUST identify the affected behavior, include or update Cucumber
coverage when behavior changes, and explain any exception to a principle.
Reviewers MUST check the feature specification, implementation boundary, test
coverage, and absence of unrelated changes.

## Governance
<!-- Example: Constitution supersedes all other practices; Amendments require documentation, approval, migration plan -->

This constitution governs project practices and takes precedence over conflicting
local conventions. An amendment MUST update this document, prepend a Sync
Impact Report, state the reason for the change, and update the version and last
amended date. Amendments that remove or redefine a principle are MAJOR; added
principles or materially expanded requirements are MINOR; clarifications and
non-semantic corrections are PATCH changes.

Every pull request MUST receive a compliance review against these principles.
Exceptions MUST be recorded in the pull request with scope, rationale, and an
owner or follow-up date. The project MUST re-check compliance whenever its
toolchain, public HTTP contract, or testing workflow changes.

**Version**: 1.0.0 | **Ratified**: TODO(RATIFICATION_DATE): confirm original adoption date | **Last Amended**: 2026-08-21
