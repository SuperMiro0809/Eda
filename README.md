# Eda

AI-powered chatbot assistant for Bulgarian university applications (ЕСКИЗ - Единна система за кандидатстване и информационно обслужване на записването).

## Overview

Eda is a full-stack application that helps foreign students navigate the Bulgarian university application process. It uses RAG (Retrieval-Augmented Generation) to provide accurate, documentation-based answers about ЕСКИЗ.

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              Eda Application                             │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   ┌─────────────┐      ┌─────────────┐      ┌─────────────────────┐    │
│   │   Client    │      │     API     │      │    AI Service       │    │
│   │  (Next.js)  │◄────►│  (Laravel)  │      │    (FastAPI)        │    │
│   │             │      │             │      │                     │    │
│   │  - Chat UI  │      │  - Auth     │      │  - RAG Pipeline     │    │
│   │  - Auth     │      │  - Sessions │      │  - Ollama LLM       │    │
│   │  - i18n     │      │  - Messages │      │  - ChromaDB         │    │
│   └─────────────┘      └─────────────┘      └─────────────────────┘    │
│         │                                            │                  │
│         │              SSE Streaming                 │                  │
│         └────────────────────────────────────────────┘                  │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

## Tech Stack

| Component | Technology |
|-----------|------------|
| **Frontend** | Next.js 16, MUI v7, React Context, i18next |
| **Backend API** | Laravel 12, Sanctum, MySQL |
| **AI Service** | FastAPI, Ollama, ChromaDB, LangChain |
| **LLM Model** | qwen2.5:7b (configurable) |
| **Embeddings** | nomic-embed-text |

## Project Structure

```
Eda/
├── client/          # Next.js frontend application
│   ├── src/
│   │   ├── app/         # Pages (App Router)
│   │   ├── auth/        # Authentication module
│   │   ├── chat/        # Chat state management
│   │   ├── components/  # Reusable components
│   │   ├── layouts/     # Page layouts
│   │   └── locales/     # i18n translations
│   └── README.md
│
├── api/             # Laravel REST API
│   ├── app/
│   │   ├── Http/Controllers/Api/
│   │   └── Models/
│   ├── routes/api.php
│   └── README.md
│
├── ai/              # Python AI service with RAG
│   ├── app/
│   │   ├── main.py      # FastAPI application
│   │   ├── ollama.py    # LLM client
│   │   └── rag/         # RAG pipeline
│   ├── data/
│   │   └── documents/   # Knowledge base documents
│   └── README.md
│
└── README.md        # This file
```

## Features

- **AI Chat**: Real-time streaming responses using RAG
- **Multi-language**: Bulgarian and English support
- **Authentication**: JWT-based auth with Laravel Sanctum
- **Chat History**: Persistent sessions with rename/delete
- **Speech-to-Text**: Voice input support (Bulgarian)
- **Theme**: Light/Dark mode with customizable colors

## Quick Start

### Prerequisites

- Node.js 18+
- PHP 8.2+ with Composer
- Python 3.11+
- MySQL/PostgreSQL
- Ollama

### 1. Clone & Setup

```bash
git clone <repository-url>
cd Eda
```

### 2. Start Ollama & Pull Models

```bash
# Start Ollama service
ollama serve

# Pull required models
ollama pull qwen2.5:7b
ollama pull nomic-embed-text
```

### 3. Setup API (Laravel)

```bash
cd api

# Install dependencies
composer install

# Configure environment
cp .env.example .env
php artisan key:generate

# Setup database
php artisan migrate

# Start server
php artisan serve --port=8000
```

### 4. Setup AI Service (Python)

```bash
cd ai

# Create virtual environment
python -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Ingest documents (first time)
python scripts/ingest.py --reset

# Start server
python -m app.main
```

### 5. Setup Client (Next.js)

```bash
cd client

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with API URLs

# Start development server
npm run dev
```

### 6. Access Application

Open http://localhost:3000 in your browser.

## Environment Variables

### Client (.env.local)
```env
NEXT_PUBLIC_SERVER_URL=http://localhost:8000/api
NEXT_PUBLIC_AI_SERVER_URL=http://localhost:8001
```

### API (.env)
```env
APP_URL=http://localhost:8000
DB_DATABASE=eda
SANCTUM_STATEFUL_DOMAINS=localhost:3000
```

### AI Service (.env)
```env
OLLAMA_HOST=http://localhost:11434
OLLAMA_MODEL=qwen2.5:7b
```

## API Endpoints

### Laravel API (Port 8000)

| Endpoint | Description |
|----------|-------------|
| `POST /api/auth/login` | User login |
| `POST /api/auth/register` | User registration |
| `GET /api/chat/sessions` | List chat sessions |
| `POST /api/chat/sessions` | Create session |
| `POST /api/chat/sessions/{id}/messages` | Add message |

### AI Service (Port 8001)

| Endpoint | Description |
|----------|-------------|
| `POST /chat` | Stream AI response (SSE) |
| `GET /health` | Service health check |
| `GET /knowledge` | Vector store stats |
| `GET /search?query=...` | Test RAG search |

## Adding Documents

Place PDF, DOCX, TXT, or MD files in `ai/data/documents/`, then:

```bash
cd ai
python scripts/ingest.py --reset
```

## Development

### Running All Services

Terminal 1 (API):
```bash
cd api && php artisan serve --port=8000
```

Terminal 2 (AI):
```bash
cd ai && source venv/bin/activate && python -m app.main
```

Terminal 3 (Client):
```bash
cd client && npm run dev
```

### Code Style

- **Client**: ESLint + Prettier
- **API**: Laravel Pint
- **AI**: Black + isort

## Troubleshooting

### AI not responding
- Check Ollama is running: `curl http://localhost:11434/api/tags`
- Verify documents are ingested: `curl http://localhost:8001/knowledge`

### Auth issues
- Clear browser localStorage
- Check CORS settings in Laravel
- Verify Sanctum configuration

### Slow responses
- Use smaller model (e.g., `qwen2.5:7b`)
- Reduce `num_ctx` in `ai/app/ollama.py`

## License

MIT
