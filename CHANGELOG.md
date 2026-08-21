# Changelog

All notable changes to spec-kit-bdd will be documented in this file.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [1.0.3] - 2026-08-21

### Added
- `speckit.bdd.scenarios` now detects the project's consumer type (REST API, GraphQL, another API shape, CLI, library/SDK, or a human UI end user) before generating Gherkin, and reframes the spec's generic "the user does X" wording into that actor's phrasing instead of copying it verbatim — e.g. "As a REST API client" / "the API client POSTs `/todos`..." for a backend-only project.
- New example: [`examples/express-cucumber`](examples/express-cucumber) — an Express 5 + TypeScript backend wired with the official `@cucumber/cucumber`, with a full weekly-todo CRUD feature (REST routes, service layer, Gherkin scenarios, step definitions, and a traceability matrix) built end-to-end through the real spec-kit + `bdd` workflow.
- Completed [`examples/vitest-react-todo`](examples/vitest-react-todo): the weekly task list feature (view, add, and mark tasks complete) with Gherkin scenarios, step definitions, and a traceability matrix.
- Project website deployed to GitHub Pages at <https://rsginer.github.io/spec-kit-bdd/>, built and published via a new `.github/workflows/pages.yml` Actions workflow.

### Changed
- README: added status badges, a hero banner image, an expanded "Why" section, an Examples table, and local website preview instructions; its ATDD workflow summary now matches the step-by-step ordering used in `docs/usage.md` and the website.
- The packaged extension archive now excludes website files (`index.md`, `_layouts/`, `assets/`, `.github/`, `Gemfile*`) and the `examples/` directory via `.extensionignore`, keeping the installable zip scoped to the extension itself.

### Fixed
- The extension installation command in the README was missing the archive source URL.
- A stale `spec.md` reference in the usage guide was corrected to match how Spec Kit actually resolves the active feature's spec.

## [1.0.2] - 2026-07-15

### Fixed
- `speckit.bdd.scenarios` and `speckit.bdd.verify` now resolve the active feature's `spec.md` via `SPECIFY_FEATURE_DIRECTORY` or `.specify/feature.json`, matching how current Spec Kit actually writes specs (`<feature-directory>/spec.md`, e.g. `specs/003-user-auth/spec.md`). Previously both commands only looked for `.specify/specify.md` or root `specify.md`, which Spec Kit never creates, so both commands always reported "No specification found" in a standard project. The old paths remain as a last-resort fallback.

## [1.0.0] - 2026-07-14

### Added
- `speckit.bdd.scenarios` — converts spec-kit specifications into Gherkin feature files
- `speckit.bdd.scaffold` — generates step definition stubs for Python, JavaScript, Ruby, Java, and C#
- `speckit.bdd.verify` — produces a traceability matrix and coverage report
- `after_specify` hook — optionally triggers scenario generation after `/speckit.specify`
- `before_implement` hook — optionally scaffolds step stubs before `/speckit.implement`
