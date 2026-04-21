# API Reference

Base URL: `http://localhost:3000/api`

---

## Users

### `GET /users`
Returns all users. Passwords are never included in any user response.

**Response** `200`
```json
[{ "id": 1, "firstName": "Demo", "lastName": "Writer", "username": "demo", "email": "demo@example.com" }]
```

### `GET /users/:id`
**Response** `200` — user object, or `404` if not found.

### `POST /users`
**Body**
```json
{
  "firstName": "string",
  "lastName": "string",
  "username": "string",
  "email": "string (optional)",
  "password": "string"
}
```
**Response** `201` — created user object. Password is hashed before storage.

### `PUT /users/:id`
**Body** — any subset of `firstName`, `lastName`, `username`, `email`.

**Response** `200` — updated user object.

### `DELETE /users/:id`
**Response** `204 No Content`

---

## Tournaments

### `GET /tournaments`
Returns all tournaments (summary fields only, no nested relations).

### `GET /tournaments/:id`
Returns the tournament with nested `packets`, `roles` (with user info), and `distributionConstraints`.

### `POST /tournaments`
**Body**
```json
{
  "name": "string",
  "metadata": "object (optional)",
  "dueDate": "ISO 8601 date string (optional)",
  "numberOfPackets": "number (optional)",
  "questionsPerPacket": "number (optional)",
  "distribution": "object (optional)"
}
```
The `distribution` field is a free-form JSON object intended to store the category breakdown (e.g. `{ "Literature": ["American Literature", "British Literature", ...] }`).

**Response** `201` — created tournament object.

### `PUT /tournaments/:id`
**Body** — any subset of the `POST` fields.

**Response** `200` — updated tournament object.

### `DELETE /tournaments/:id`
**Response** `204 No Content`

---

## Questions

### `GET /questions`
Returns all questions with nested `tossup` or `bonus`, `author` (id + username), and `category`.

**Query parameters**

| Param | Type | Description |
|---|---|---|
| `tournamentId` | number | Filter by tournament |
| `authorId` | number | Filter by author |
| `questionType` | `tossup` \| `bonus` | Filter by type |
| `status` | `written` \| `edited` \| `proofread` | Filter by status |

### `GET /questions/:id`
**Response** `200` — question with nested tossup/bonus, author, and category. `404` if not found.

### `POST /questions`

Creates a question and its associated tossup or bonus.

**Body**
```json
{
  "authorId": "number",
  "categoryId": "number",
  "questionType": "tossup | bonus",
  "tournamentId": "number",
  "status": "written | edited | proofread (optional, default: written)",
  "tossup": {
    "questionText": "string",
    "answer": "string"
  },
  "bonus": {
    "part1Text": "string",
    "part1Answer": "string",
    "part2Text": "string",
    "part2Answer": "string",
    "part3Text": "string",
    "part3Answer": "string"
  }
}
```

Provide either `tossup` or `bonus` depending on `questionType`.

**Validation rules (enforced on create and update)**

- Tossup `questionText`: the last line must begin with `"For 10 points, "`.
- All answer fields (tossup `answer`; bonus `part1Answer`, `part2Answer`, `part3Answer`):
  - The main answer (before any `[`) must contain at least one underlined section: `_Answer_`.
  - Alternate answers inside `[...]` are separated by semicolons.
  - Each alternate answer must also contain at least one underlined section.
  - Prompt instructions must be written in quotes and begin with `"prompt`: e.g. `"prompt on partial description"`.
  - Reject instructions must be written in quotes and begin with `"reject"`: e.g. `"reject wrong answer"`.
  - Ordering within brackets must be: accept alternates → prompt instructions → reject instructions.

**Example valid answer:** `_amino acids_ [_AAs_; _polypeptides_; "prompt on amines"; "reject proteins"]`

**Response** `201` — created question with nested tossup or bonus. `400` with `{ "errors": { "fieldName": "message" } }` on validation failure.

### `PUT /questions/:id`
**Body** — any subset of the `POST` fields. Nested `tossup` or `bonus` fields are updated in place.

Validation rules apply to any answer fields included in the request.

**Response** `200` — updated question. `400` on validation failure.

### `DELETE /questions/:id`
**Response** `204 No Content`

---

## Packets

### `GET /packets`
Returns all packets with their nested `packetQuestions` (each including the full question, tossup/bonus).

**Query parameters**

| Param | Type | Description |
|---|---|---|
| `tournamentId` | number | Filter by tournament |

Results are ordered by `packetNumber` ascending.

### `GET /packets/:id`
Returns the packet with `packetQuestions` ordered by `questionNumber`, each including the full question (tossup/bonus, author, category).

**Response** `200` — packet object, or `404` if not found.

### `POST /packets`
**Body**
```json
{
  "packetNumber": "number",
  "tournamentId": "number"
}
```
**Response** `201` — created packet.

### `PUT /packets/:id`
**Body**
```json
{ "packetNumber": "number (optional)" }
```
**Response** `200` — updated packet.

### `DELETE /packets/:id`
**Response** `204 No Content`

### `POST /packets/:id/packetize`

Automatically assigns unassigned questions from the packet's tournament into this packet's slots based on the tournament's `PacketDistributionConstraints`.

- Clears any existing question assignments for this packet.
- For each constraint (question type + category + count), pulls that many unassigned questions of the matching type from the tournament's question pool (questions with any status are eligible).
- Questions already assigned to other packets in the same tournament are skipped.

**Response** `200` — the packet with its newly assigned `packetQuestions`.
