# Changelog

All notable changes to spec-kit-bdd will be documented in this file.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

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
