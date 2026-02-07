# Eda Architecture

Chatbot to help candidates apply to Bulgarian universities.

## Overview

```
┌─────────────────┐
│    Next.js      │
│   (Frontend)    │
└───┬─────────┬───┘
    │         │
  REST       SSE
 (auth)    (chat)
    │         │
    ▼         ▼
┌───────┐  ┌──────────┐     ┌────────────┐
│Laravel│  │  Python  │────►│  Vector DB │
│  API  │  │ FastAPI  │     └────────────┘
└───┬───┘  └────┬─────┘
    │           │
    ▼           ▼
┌───────┐  ┌────────┐
│ MySQL │  │ LLaMA  │
└───────┘  └────────┘
```

## Services

### Next.js (Frontend) - `/client`
- React 19 + Next.js 16
- MUI 7 for components
- Chat interface with streaming
- Auth state management

### Laravel API - `/api`
- User authentication (JWT)
- User profile management
- Chat session CRUD
- Message history persistence
- Endpoints:
  - `POST /auth/register`
  - `POST /auth/login`
  - `POST /auth/logout`
  - `GET /auth/me`
  - `GET /chat/sessions`
  - `POST /chat/sessions`
  - `GET /chat/sessions/{id}`
  - `DELETE /chat/sessions/{id}`
  - `GET /chat/sessions/{id}/messages`
  - `POST /chat/sessions/{id}/messages`

### Python FastAPI - `/ai`
- RAG pipeline
- Document embeddings
- LLM inference (LLaMA via Ollama)
- JWT validation (shared secret with Laravel)
- SSE streaming for chat responses
- Endpoints:
  - `POST /chat` (SSE stream)
  - `POST /embed` (for adding documents)

### MySQL
- Users table
- Chat sessions table
- Messages table

### Vector Database (Qdrant or pgvector)
- Document chunks
- Embeddings for retrieval

## Auth Flow

1. User logs in → Laravel validates → returns JWT
2. Frontend stores JWT
3. Chat request → Frontend sends JWT to Python
4. Python validates JWT (shared secret with Laravel)
5. Python streams response
6. Python saves message via Laravel API or directly to MySQL