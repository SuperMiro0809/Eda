# Eda AI Service

AI-powered chat service for ЕСКИЗ (Bulgarian university application system) using RAG (Retrieval-Augmented Generation).

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Request                          │
│                    POST /chat { messages }                      │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                          main.py                                │
│                      FastAPI Application                        │
│  1. Extract user question from messages                         │
│  2. Query RAG retriever for relevant context                    │
│  3. Build system prompt with context                            │
│  4. Stream response from Ollama LLM                             │
└─────────────────────────────────────────────────────────────────┘
                                │
                ┌───────────────┴───────────────┐
                ▼                               ▼
┌───────────────────────────┐   ┌───────────────────────────────┐
│      RAG Retriever        │   │         Ollama LLM            │
│  (Vector Search)          │   │    (qwen2.5:7b model)         │
│                           │   │                               │
│  Query → Embeddings →     │   │  System Prompt + Context +    │
│  ChromaDB → Top-K docs    │   │  User Messages → Response     │
└───────────────────────────┘   └───────────────────────────────┘
```

## RAG Pipeline

RAG (Retrieval-Augmented Generation) ensures the AI responds with accurate information from your documents instead of hallucinating.

### How It Works

```
┌──────────────────────────────────────────────────────────────────────────┐
│                        INGESTION PIPELINE (Offline)                       │
│                                                                          │
│  PDF/DOCX/TXT  →  Loader  →  Chunker  →  Embeddings  →  ChromaDB         │
│                                                                          │
│  1. Load documents from data/documents/                                  │
│  2. Split into 1000-char chunks with 200-char overlap                    │
│  3. Generate embeddings using nomic-embed-text                           │
│  4. Store vectors in ChromaDB for similarity search                      │
└──────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│                        RETRIEVAL PIPELINE (Runtime)                      │
│                                                                          │
│  User Question  →  Embedding  →  ChromaDB Search  →  Top-K Chunks        │
│                                                                          │
│  1. User asks: "What is ЕСКИЗ?"                                          │
│  2. Convert question to embedding vector                                 │
│  3. Find 5 most similar document chunks                                  │
│  4. Include chunks as context in LLM prompt                              │
│  5. LLM generates answer based ONLY on provided context                  │
└──────────────────────────────────────────────────────────────────────────┘
```

## Project Structure

```
ai/
├── app/
│   ├── __init__.py
│   ├── main.py          # FastAPI app, endpoints, system prompt
│   ├── config.py        # Settings (model, chunk size, etc.)
│   ├── schemas.py       # Pydantic models for API requests
│   ├── auth.py          # JWT token verification
│   ├── ollama.py        # Ollama API client (streaming)
│   └── rag/
│       ├── __init__.py
│       ├── loader.py      # Document loading (PDF, DOCX, TXT, MD)
│       ├── chunker.py     # Text splitting into chunks
│       ├── embeddings.py  # Ollama embeddings generation
│       ├── vectorstore.py # ChromaDB operations
│       └── retriever.py   # Context retrieval for queries
├── data/
│   ├── documents/       # Source documents (PDF, DOCX, etc.)
│   └── chroma_db/       # ChromaDB persistence directory
├── scripts/
│   └── ingest.py        # Document ingestion script
├── requirements.txt
└── README.md
```

## File Descriptions

### Core Application

| File | Purpose |
|------|---------|
| `main.py` | FastAPI application with `/chat`, `/health`, `/knowledge`, `/search` endpoints. Orchestrates RAG retrieval and LLM streaming. |
| `config.py` | Configuration via environment variables. Model settings, chunk sizes, ChromaDB paths. |
| `schemas.py` | Pydantic models: `Message` (role, content) and `ChatRequest` (messages list). |
| `auth.py` | JWT token verification for protected endpoints (optional). |
| `ollama.py` | Async client for Ollama API. `chat_stream()` for streaming, `chat_complete()` for full responses. |

### RAG Module

| File | Purpose |
|------|---------|
| `loader.py` | `DocumentLoader` class. Loads PDF, DOCX, TXT, MD files using LangChain loaders. Adds source metadata. |
| `chunker.py` | `TextChunker` class. Splits documents into smaller chunks using `RecursiveCharacterTextSplitter`. Preserves metadata and adds chunk indices. |
| `embeddings.py` | `OllamaEmbeddingFunction` class. Generates vector embeddings using Ollama's `nomic-embed-text` model. Implements ChromaDB's embedding interface. |
| `vectorstore.py` | `VectorStore` class. ChromaDB wrapper for storing and searching document embeddings. Handles persistence and batch operations. |
| `retriever.py` | `Retriever` class. High-level interface for querying the vector store. Returns formatted context strings for the LLM prompt. |

## Configuration

Settings in `app/config.py` (can be overridden via `.env`):

```python
# LLM Model
ollama_host: str = "http://localhost:11434"
ollama_model: str = "qwen2.5:7b"      # Fast multilingual model
embedding_model: str = "nomic-embed-text"

# Document Processing
chunk_size: int = 800                  # Characters per chunk
chunk_overlap: int = 150               # Overlap between chunks

# Retrieval
top_k_results: int = 5                 # Number of chunks to retrieve
similarity_threshold: float = 0.2     # Minimum similarity score
```

## Usage

### 1. Install Dependencies

```bash
cd ai
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 2. Start Ollama

```bash
# Pull required models
ollama pull qwen2.5:7b
ollama pull nomic-embed-text

# Ollama should be running on localhost:11434
```

### 3. Ingest Documents

Place your documents in `data/documents/`, then run:

```bash
# First time or after adding new documents
python scripts/ingest.py --reset

# View statistics
python scripts/ingest.py --stats

# List indexed documents
python scripts/ingest.py --list
```

### 4. Start the Server

```bash
python -m app.main
# or
uvicorn app.main:app --reload --port 8000
```

### 5. Test the API

```bash
# Health check
curl http://localhost:8000/health

# Chat
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"messages": [{"role": "user", "content": "Какво е ЕСКИЗ?"}]}'

# Search (debug)
curl "http://localhost:8000/search?query=ЕСКИЗ&top_k=3"

# Knowledge base info
curl http://localhost:8000/knowledge
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check with vector store stats |
| `/chat` | POST | Stream chat response with RAG context |
| `/knowledge` | GET | Show indexed documents and stats |
| `/search` | GET | Test search query (debug endpoint) |

### Chat Request Format

```json
{
  "messages": [
    {"role": "user", "content": "What is ЕСКИЗ?"},
    {"role": "assistant", "content": "ЕСКИЗ is..."},
    {"role": "user", "content": "How do I apply?"}
  ],
  "session_id": "optional-session-id"
}
```

### Chat Response (SSE Stream)

```
event: message
data: {"content": "ЕСКИЗ"}

event: message
data: {"content": " е Единна"}

event: message
data: {"content": " система..."}

event: done
data: {}
```

## Supported Document Formats

| Format | Extension | Loader |
|--------|-----------|--------|
| PDF | `.pdf` | PyPDFLoader |
| Word | `.docx` | Docx2txtLoader |
| Text | `.txt` | TextLoader |
| Markdown | `.md` | UnstructuredMarkdownLoader |

## Troubleshooting

### "No context found" in responses

```bash
# Check if documents are indexed
python scripts/ingest.py --stats

# Re-ingest if needed
python scripts/ingest.py --reset
```

### Slow responses

- Switch to a smaller model in `config.py`
- Reduce `num_ctx` in `ollama.py` if not needed
- Use `qwen2.5:7b` instead of larger models

### Incorrect/hallucinated answers

- Lower `temperature` in `ollama.py` (currently 0.1)
- Check if relevant documents are indexed
- Use `/search` endpoint to verify retrieval quality

## Dependencies

- **FastAPI** - Web framework
- **Ollama** - Local LLM inference
- **ChromaDB** - Vector database
- **LangChain** - Document loading and text splitting
- **httpx** - Async HTTP client
- **SSE-Starlette** - Server-Sent Events for streaming