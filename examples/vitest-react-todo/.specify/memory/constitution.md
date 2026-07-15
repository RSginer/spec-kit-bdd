<!--
Sync Impact Report
Version change: (template) → 1.0.0
Modified principles: N/A (initial ratification)
Added sections:
  - Core Principles: I. BDD/ATDD-First (NON-NEGOTIABLE); II. Test-First Development (NON-NEGOTIABLE);
    III. Type Safety; IV. Simplicity & Example Clarity; V. Traceability
  - Additional Constraints (technology stack)
  - Development Workflow (spec-kit-bdd command pipeline)
  - Governance
Removed sections: none
Templates requiring updates:
  - .specify/templates/plan-template.md ✅ (generic "[Gates determined based on constitution file]" — no edit needed)
  - .specify/templates/spec-template.md ✅ (no constitution-specific references)
  - .specify/templates/tasks-template.md ✅ (no constitution-specific references)
  - .specify/templates/commands/*.md — no matching directory found under .specify/templates; command guidance lives in .claude/skills/* and .specify/extensions/*/commands/*.md, which are extension-owned and not covered by this constitution
Follow-up TODOs: none
-->

# vitest-react-todo Constitution
<!-- This project is the reference example for the spec-kit-bdd extension: it demonstrates the
     ATDD/BDD workflow (specify → bdd.scenarios → plan → tasks → bdd.scaffold → implement → bdd.verify)
     end-to-end on a small React + Vitest todo app. -->

## Core Principles

### I. BDD/ATDD-First (NON-NEGOTIABLE)
Every feature MUST begin as a Gherkin scenario under `features/` before any implementation
code is written. Scenarios are generated from the spec via `speckit.bdd.scenarios` and MUST
be reviewed as the executable definition of "done" before planning proceeds. No feature may
be implemented without a corresponding `.feature` file.

**Rationale**: This project exists to demonstrate the spec-kit-bdd extension's workflow; skipping
the Gherkin-first step would defeat the project's purpose and leave undocumented, untraceable
behavior.

### II. Test-First Development (NON-NEGOTIABLE)
Step definitions MUST be scaffolded (`speckit.bdd.scaffold`) and MUST fail before implementation
begins. Red-Green-Refactor is strictly enforced: write the failing step/component test, get user
or reviewer sign-off on scenario intent, then implement until green. Tests run via
`@amiceli/vitest-cucumber` (feature-level) and `@testing-library/react` (component-level); both
MUST pass before a change is considered complete.

**Rationale**: A failing-test-first discipline is the concrete proof that the acceptance criteria
were captured before the code, which is the core value proposition being showcased.

### III. Type Safety
TypeScript `strict` mode, `noUnusedLocals`, `noUnusedParameters`, and `noFallthroughCasesInSwitch`
MUST remain enabled in `tsconfig.json` and MUST NOT be weakened. `tsc --noEmit` MUST pass as part
of `npm run build` before any change is considered shippable. Use of `any` or type-check
suppression comments (`@ts-ignore`, `@ts-expect-error`) requires an inline justification comment.

**Rationale**: As a teaching example, the code's type signatures are part of the documentation;
loosening them would mislead readers about the guarantees the workflow produces.

### IV. Simplicity & Example Clarity
This is a small reference application, not a production system. Code MUST stay minimal and
readable over "production-grade" — no state-management libraries, routing, or backend beyond
what is needed to demonstrate one todo-list feature and the BDD workflow around it (YAGNI).
Prefer plain React hooks and local component state over added abstraction layers.

**Rationale**: Extra abstraction obscures the thing this repo is meant to teach: how spec-kit-bdd
turns a spec into Gherkin scenarios, failing tests, and passing implementation.

### V. Traceability
Every Gherkin scenario MUST map back to a requirement in the spec that produced it, and every
scenario MUST have a corresponding, currently-passing step-definition test verified via
`speckit.bdd.verify`. Orphan scenarios (no spec requirement) and orphan requirements (no
scenario) are both constitution violations and MUST be resolved before merging.

**Rationale**: Traceability between spec, scenario, and test is the artifact spec-kit-bdd
produces; letting it drift would make the example dishonest about what the tool actually does.

## Additional Constraints

Technology stack is fixed for this example and changes to it require a constitution amendment:
React 19 + TypeScript (strict) + Vite for the app; Vitest + `@amiceli/vitest-cucumber` for BDD
feature tests; `@testing-library/react` + `@testing-library/user-event` for component-level
assertions; `jsdom` as the test environment. Do not introduce alternative test runners, BDD
frameworks, or component libraries without updating this document first.

## Development Workflow

Work MUST follow the spec-kit-bdd command pipeline in order: `speckit.specify` →
`speckit.bdd.scenarios` → `speckit.plan` → `speckit.tasks` → `speckit.bdd.scaffold` →
`speckit.implement` → `speckit.bdd.verify`. Git commit checkpoints are automated via the
`speckit.git.commit` hooks registered in `.specify/extensions.yml` at each phase boundary;
do not skip or reorder phases. A change is not "done" until `speckit.bdd.verify` shows full
scenario-to-requirement traceability and `npm run test` and `npm run build` both pass.

## Governance

This constitution supersedes ad hoc practice for this repository. Amendments are made by
editing this file directly, MUST include a Sync Impact Report as an HTML comment at the top,
and MUST bump the version according to semantic versioning: MAJOR for backward-incompatible
principle removals/redefinitions, MINOR for new or materially expanded principles/sections,
PATCH for clarifications and wording fixes. Every `speckit.plan` run MUST perform a
Constitution Check gate against the principles above before implementation planning proceeds;
any violation MUST be explicitly justified in the plan's Complexity Tracking section or the
plan MUST be revised to comply.

**Version**: 1.0.0 | **Ratified**: 2026-07-15 | **Last Amended**: 2026-07-15
