# CortexAI — Architecture

## Overview

CortexAI is a **microservices** backend behind a single **API gateway**, with a React frontend. The frontend only ever talks to the gateway; the gateway authenticates requests and proxies them to the correct internal service.

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Browser (React)                          │
│                    http://localhost:5173                        │
└──────────────────────────────┬──────────────────────────────────────┘
                             │  HTTP (axios, withCredentials)
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     GATEWAY (port 8000)                       │
│  express + cors + cookieParser + morgan                          │
│  /api/auth  → proxy to AUTH_SERVICE                            │
│  /api/chat  → protect → proxyWithHeader(CHAT_SERVICE)           │
│  /api/agent → protect → proxyWithHeader(AGENT_SERVICE)          │
│  /api/me    → protect → getCurrentUser (local handler)           │
└───────┬───────────────┬───────────────┬─────────────────────────┘
        │               │               │
        ▼               ▼               ▼
   AUTH (8001)     CHAT (8002)    AGENT (8003)
   Firebase        MongoDB          LangGraph + LLM
   Redis          (Atlas)         (Groq)
```

## Services & ports

| Service  | Port | Responsibility                                    |
| -------- | ---- | ------------------------------------------------- |
| Gateway  | 8000 | Entry point, auth middleware, reverse proxy       |
| Auth     | 8001 | Firebase token verify, user upsert, Redis session |
| Chat     | 8002 | Conversation & message CRUD (MongoDB)             |
| Agent    | 8003 | LangGraph router + chat agent + LLM               |
| Frontend | 5173 | React UI (Vite dev server)                        |
| Redis    | 6379 | Session store + memory cache (Docker)             |

## Data stores

- **MongoDB Atlas** — three databases: `auth` (users), `chat` (conversations, messages), `agent` (unused so far)
- **Redis** — `session-<id>` keys (7-day TTL) and `messages-<conversationId>` cache
- **Firebase** — verifies Google ID tokens

## How the gateway protects routes

The gateway uses a `protect` middleware that:

1. Reads the `session` cookie from the request.
2. Looks up `session-<id>` in Redis.
3. If found, parses the JSON and attaches it as `req.user`.
4. Calls `next()` so the request continues to the proxy.

The `proxyWithHeader(serviceUrl)` helper forwards the request to the target service and injects `x-user-id` from `req.user.userId`. This is how the chat/agent services know which user is calling.

## Frontend structure

```
src/
  main.jsx          → Redux Provider + App
  App.jsx          → loads current user, renders Home
  pages/Home.jsx   → 3-pane layout (SideBar, ChatArea, Artifact) + login overlay
  components/
    SideBar        → conversation list, new chat, user card, logout
    ChatArea      → Nav + MessageList + ChatInput
    Nav          → selected conversation title + message count
    MessageList  → empty state or messages + bubbles
    MessageBubble→ markdown/code/images rendering
    ChatInput    → agent pills, file, mic, textarea, send
    Artifact     → placeholder (empty)
    BillingDrawer→ placeholder (empty)
  features/       → API calls (axios)
  redux/         → user, conversation, message slices
  utils/         → axios instance, firebase config
```

## Key environment variables

- **Gateway** `.env`: `PORT`, `AUTH_SERVICE`, `CHAT_SERVICE`, `AGENT_SERVICE`, `FRONTEND_URL`, `REDIS_URL`
- **Auth** `.env`: `PORT`, `MONGODB_URI`, `REDIS_URL`
- **Chat** `.env`: `PORT`, `MONGODB_URI`
- **Agent** `.env`: `PORT`, `MONGODB_URI`, `GROQ_API_KEY`, `GOOGLE_API_KEY`, `CHAT_SERVICE`, `AUTH_SERVICE`, `REDIS_URL`
- **Frontend** `.env`: `VITE_SERVER_URL`, `VITE_FIREBASE_API_KEY`
