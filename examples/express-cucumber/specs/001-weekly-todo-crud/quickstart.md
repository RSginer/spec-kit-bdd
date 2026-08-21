# Quickstart: Weekly Todo CRUD

## Prerequisites

- Node.js compatible with the repository toolchain
- Dependencies installed with `npm install`

## Validate the feature

1. Build the TypeScript project:

   ```bash
   npm run build
   ```

2. Run the Cucumber acceptance suite:

   ```bash
   npm test
   ```

3. Start the service for manual REST checks when needed:

   ```bash
   npm start
   ```

## REST smoke checks

With the service running, create and list a current-week todo:

```bash
curl -i -X POST http://localhost:3000/todos \
  -H 'content-type: application/json' \
  -d '{"title":"Send project update","plannedDate":"2026-08-21"}'

curl -i http://localhost:3000/todos
```

Expected outcomes are defined in [contracts/todos-api.md](contracts/todos-api.md).
The acceptance scenarios cover update, completion-state changes, deletion,
validation failures, unknown IDs, and weekly filtering.
