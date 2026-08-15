# CortexAI — Project Documentation

This folder contains documentation explaining how the CortexAI project works end-to-end.

## Contents

- [README.md](./README.md) — this file, quick overview
- [ARCHITECTURE.md](./ARCHITECTURE.md) — system architecture, services, ports, data flow
- [FLOW.md](./FLOW.md) — detailed end-to-end request flows (auth, chat, agent)
- [DATABASE.md](./DATABASE.md) — MongoDB Atlas collections and schemas

## What has been achieved so far

A full-stack **MERN + AI** application ("CortexAI") with:

- **Frontend** — React + Vite + Redux Toolkit + Tailwind CSS
- **Backend** — microservices architecture behind a single API gateway
  - **Gateway** (port 8000) — single entry point, auth-protects routes, proxies to services
  - **Auth service** (port 8001) — Firebase Google login, session management via Redis
  - **Chat service** (port 8002) — conversations & messages persistence (MongoDB)
  - **Agent service** (port 8003) — LangGraph agent router + LLM chat agent
- **Data stores**
  - **MongoDB Atlas** — users, conversations, messages
  - **Redis** (Docker) — session store + message memory cache
  - **Firebase** — Google authentication (ID token verification)

### Working features

- Google login (Firebase) → creates/loads user → sets session cookie + Redis session
- Session-protected routes via gateway middleware
- Create / list conversations
- Send a message → agent service routes it → chat agent → LLM (Groq) → response saved & displayed
- Markdown rendering with code highlighting in the chat UI
- Voice input (Web Speech API) and file attach (UI only, agent file handling partial)

### Not yet built (placeholders / stubs)

- Credits / billing / agent usage limits
- Search, coding, PDF, PPT, vision agents (currently echo stubs)
- Artifact panel (empty component)
- Billing drawer (empty component)
- Conversation title auto-update on backend (frontend updates locally only)
