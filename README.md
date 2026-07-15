# spec-kit-bdd

A [spec-kit](https://github.com/github/spec-kit) community extension that adds Behavior-Driven Development (BDD) and Acceptance Test-Driven Development (ATDD) to the spec-driven workflow.

## Why?

Lean software development treats anything that doesn't directly deliver value to the user as waste — rework from misread requirements, code built against specs nobody validated, defects caught late instead of early. [W. Edwards Deming's](https://es.wikipedia.org/wiki/William_Edwards_Deming) core teaching, later formalized for software in [Mary and Tom Poppendieck's](https://es.wikipedia.org/wiki/Mary_Poppendieck) in his book [Lean Software Development: An Agile Toolkit](https://ptgmedia.pearsoncmg.com/images/9780321150783/samplepages/0321150783.pdf), is to build quality into the process instead of inspecting for it afterward.

BDD/ATDD is how **spec-kit-bdd** applies that here: acceptance criteria become executable Gherkin scenarios *before* implementation starts, and step definitions fail (RED) until the code they describe actually satisfies them (GREEN). 

Ambiguity in a spec surfaces as a failing scenario before any code is written, instead of as a bug report or a misaligned feature after the fact — the same reduction in waste from rework and overproduction that Deming's approach targets.

### How this differs from writing tests the usual way

| | spec-kit-bdd | Cucumber/Behave/SpecFlow standalone | spec-kit without BDD |
|---|---|---|---|
| Spec → scenario traceability | Generated automatically from the spec-kit spec, verified by `/speckit.bdd.verify` | Hand-written and maintained separately from the spec | None — spec and tests aren't connected |
| When acceptance tests exist | Before implementation, as part of the spec-kit lifecycle (`/speckit.bdd.scaffold` runs pre-implement) | Whenever the team gets around to it | Not enforced at all |
| Setup footprint | A YAML manifest + Markdown prompt files — no new runtime or language dependency | Full framework install and config, per language | N/A |
| Coverage gaps | Surfaced automatically in `features/TRACEABILITY.md` | Manual auditing | No mechanism |
| Workflow integration | Native hooks (`after_specify`, `before_implement`), optional and skippable | Bolted on outside the spec workflow | N/A |

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
specify extension add bdd --from https://github.com/RSginer/spec-kit-bdd/archive/refs/tags/v1.0.2.zip
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

## Examples

| Example | Stack | Status |
|---------|-------|--------|
| [examples/vitest-react-todo](examples/vitest-react-todo) | React 19 + Vite + Vitest + `@amiceli/vitest-cucumber` | ✅ Available |
| `examples/jest-react-todo` | React + Jest + Cucumber | 🚧 TODO |
| `examples/nestjs-jest-todo` | NestJS + Jest + Cucumber | 🚧 TODO |
| `examples/express-jest-todo` | Express + Jest + Cucumber | 🚧 TODO |

## Requirements

- spec-kit `>=0.2.0`
- Any AI coding agent supported by spec-kit (Claude, Copilot, Cursor, etc.)

## Contributing

See [docs/usage.md](docs/usage.md) for full usage details and examples.
