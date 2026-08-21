# Todo REST Contract

Base path: `/todos`

All responses use JSON except successful deletion, which has no response body.
Dates use `YYYY-MM-DD` calendar-date strings.

## Create Todo

`POST /todos`

Request body:

```json
{
  "title": "Send project update",
  "plannedDate": "2026-08-21"
}
```

Success: `201 Created`

```json
{
  "id": "todo-1",
  "title": "Send project update",
  "plannedDate": "2026-08-21",
  "completionState": "incomplete"
}
```

Validation failure: `400 Bad Request`

```json
{
  "error": "Invalid todo title"
}
```

The API returns the corresponding validation error for an invalid planned date.

## List Current-Week Todos

`GET /todos`

Success: `200 OK`

```json
[
  {
    "id": "todo-1",
    "title": "Send project update",
    "plannedDate": "2026-08-21",
    "completionState": "incomplete"
  }
]
```

The response contains only todos whose planned date is in the current local
Monday-Sunday week. An empty collection is returned when none match.

## Update Todo Details

`PUT /todos/:id`

Request body:

```json
{
  "title": "Prepare client meeting agenda",
  "plannedDate": "2026-08-22"
}
```

Success: `200 OK`, returning the updated todo. Invalid title or planned date
returns `400 Bad Request` with an `error` field. An unknown ID returns `404 Not
Found` with `{ "error": "Todo not found" }`.

## Update Completion State

`PATCH /todos/:id`

Request body:

```json
{
  "completionState": "complete"
}
```

Success: `200 OK`, returning the updated todo. The state must be either
`incomplete` or `complete`; an unknown ID returns `404 Not Found`.

## Delete Todo

`DELETE /todos/:id`

Success: `204 No Content`.

An unknown ID returns `404 Not Found` with `{ "error": "Todo not found" }`.
