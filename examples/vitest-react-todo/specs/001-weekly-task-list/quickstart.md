# Quickstart: Weekly Task List

## Setup

```bash
npm install
```

## Run the app

```bash
npm run dev
```

Opens the Vite dev server (no backend to start — everything is client-side, in-memory state).

## Run the BDD suite

```bash
npm test
```

Runs `vitest run` over `features/step_definitions/**/*.steps.{ts,tsx}` (the `vitest-cucumber`
scenarios). Before implementation, all steps fail with `Pending: ...` errors — this is the
expected Red state per constitution Principle II. As `src/task.ts` and `src/TodoApp.tsx` are
implemented against `data-model.md` and `contracts/ui-contract.md`, replace each `throw` with
real interaction/assertions and re-run until green.

```bash
npm run test:watch   # re-run on save while implementing
```

## Type-check and build

```bash
npm run build   # tsc --noEmit && vite build
```

Must pass with `strict`, `noUnusedLocals`, and `noUnusedParameters` all enabled (constitution
Principle III) — do not weaken `tsconfig.json` to make this pass.

## Definition of done for this feature

Per the constitution's Development Workflow: `npm test` and `npm run build` both green, and
`speckit.bdd.verify` confirms full scenario-to-requirement traceability (see the FR → scenario
mapping in `plan.md`'s Constitution Check section) with no orphan scenarios or requirements.
