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
specify extension add https://github.com/RSginer/spec-kit-bdd/archive/refs/tags/v1.0.0.zip
```

Or clone and install locally for development:

```bash
git clone https://github.com/RSginer/spec-kit-bdd
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
