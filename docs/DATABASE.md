# CortexAI — Database (MongoDB Atlas)

CortexAI uses **MongoDB Atlas** with separate databases per service. This keeps services decoupled.

## Databases

| Database | Used by       | Collections                 |
| -------- | ------------- | --------------------------- |
| `auth`   | Auth service  | `users`                     |
| `chat`   | Chat service  | `conversations`, `messages` |
| `agent`  | Agent service | (none yet)                  |

---

## `auth.users`

Stores application users. Created/updated during Google login.

```js
{
  _id: ObjectId("6a777e2a1c31d3c4cec88252"),
  firebaseUid: "AReJ8EEpZsYQp4rlwztpoKpe4d03",  // unique, from Firebase
  name: "Vinay",
  email: "vinaykv956@gmail.com",
  avatar: "https://lh3.googleusercontent.com/...",
  createdAt: ISODate("2026-08-08T19:06:18.883Z"),
  updatedAt: ISODate("2026-08-08T19:06:18.883Z"),
  __v: 0
}
```

**Fields:**

- `firebaseUid` — unique identifier from Firebase (the `uid` in the verified ID token).
- `name`, `email`, `avatar` — populated from the Google profile.
- `timestamps` — `createdAt`, `updatedAt`.

> Note: `plan`, `credits`, `totalCredits`, `planExpiresAt` are commented out in the auth controller — a future billing feature.

---

## `chat.conversations`

Represents a chat thread. Belongs to a user.

```js
{
  _id: ObjectId("6a7dead10efd7cf2c61e2a0c"),
  title: "New Chat",                    // default; updated later
  userId: "6a777e2a1c31d3c4cec88252", // from x-user-id header
  createdAt: ISODate("2026-08-13T16:03:29.576Z"),
  updatedAt: ISODate("2026-08-13T16:03:29.576Z"),
  __v: 0
}
```

**Fields:**

- `title` — defaults to `"New Chat"`. The frontend updates it locally via `setConvTitle`; the backend `updateConversation` endpoint exists but the frontend currently doesn't call it (feature not fully wired).
- `userId` — the owner (from the gateway's `x-user-id` header).

---

## `chat.messages`

Individual messages inside a conversation.

```js
{
  _id: ObjectId("6a801b1fe0eeca564e8a2131"),
  conversationId: ObjectId("6a801b0ae0eeca564e8a212e"), // ref: Conversation
  role: "user",                        // "user" | "assistant"
  content: "what is redis",
  images: [],                          // array of image URLs
  artifacts: [],                       // array of artifact objects
  createdAt: ISODate("2026-08-15T07:54:07.039Z"),
  updatedAt: ISODate("2026-08-15T07:54:07.039Z"),
  __v: 0
}
```

**Fields:**

- `conversationId` — which conversation this belongs to (ObjectId ref).
- `role` — `"user"` or `"assistant"`.
- `content` — the text.
- `images` — array of image URLs (for vision agent output).
- `artifacts` — array of artifact objects (for coding/ppt/pdf output).

**Artifact sub-schema:**

```js
{
  id: Number,
  type: String,        // e.g. "code", "pdf", "ppt"
  title: String,
  files: [ { name: String, content: String } ]
}
```

---

## How data flows into the DB

1. **User** — created in `auth.users` during login.
2. **Conversation** — created in `chat.conversations` when the user starts a new chat.
3. **Messages** — the agent service calls `POST /api/chat/save-message` twice per exchange:
   - once for the `user` message,
   - once for the `assistant` message.
     Both are stored in `chat.messages`.

---

## Redis (separate from MongoDB)

Redis is used for **sessions** and **memory cache**:

- `session-<sessionId>` → user JSON, TTL 7 days (auth sessions).
- `messages-<conversationId>` → cached message history (agent memory; currently the memory module is a stub and not wired into the chat agent).

Redis runs via Docker (`docker compose up -d redis`).
