# Research: Weekly Todo CRUD

## Decision: Use application-scoped in-memory storage

- **Decision**: Store todos in an in-memory collection owned by each `createApp()`
  instance.
- **Rationale**: The project is a small Express/Cucumber example with no
  persistence dependency or multi-user requirement. Application-scoped state
  isolates scenarios when each test creates a fresh app and keeps the feature
  focused on the REST contract.
- **Alternatives considered**: A database would add setup, migrations, and
  dependencies without supporting a stated requirement. A module-global store
  would leak state between app instances and violate the application boundary.

## Decision: Expose conventional REST operations

- **Decision**: Use `POST /todos`, `GET /todos`, `PUT /todos/:id`,
  `PATCH /todos/:id`, and `DELETE /todos/:id`.
- **Rationale**: These operations match the existing Gherkin scenarios and make
  each CRUD behavior directly observable through HTTP integration tests.
- **Alternatives considered**: A single action endpoint would reduce route
  count but obscure the public contract and make the example less representative
  of a CRUD API.

## Decision: Validate the weekly range in the service

- **Decision**: Compute the current local week as Monday through Sunday and
  accept planned dates only within that inclusive range.
- **Rationale**: The week rule is shared by creation, listing, and update, so it
  belongs in one domain service rather than being repeated across route handlers.
  A current-date function is passed into the service so acceptance tests can set
  a deterministic local date.
- **Alternatives considered**: Filtering only in the route would duplicate the
  rule for creation and update. Using UTC unconditionally could move a todo
  across a week boundary for users in another local timezone.

## Decision: Return stable JSON errors and explicit status codes

- **Decision**: Return `400` for validation failures, `404` for unknown IDs,
  `201` for creation, `200` for successful reads and updates, and `204` for
  successful deletion. Error responses use `{ "error": "..." }`.
- **Rationale**: Explicit status codes and stable response shapes are required by
  the project constitution and are easy to assert through Cucumber and
  SuperTest.
- **Alternatives considered**: Returning `200` for all outcomes would weaken
  the API contract and make client error handling ambiguous.
