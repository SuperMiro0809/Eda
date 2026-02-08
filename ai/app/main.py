"""
Eda AI Service - RAG-powered chat for ЕСКИЗ.
Uses vector search to retrieve relevant documentation.
"""

import json

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sse_starlette.sse import EventSourceResponse

from app.config import settings
from app.schemas import ChatRequest
from app.ollama import chat_stream
from app.rag import Retriever

# ----------------------------------------------------------------------

app = FastAPI(
    title="Eda AI Service",
    description="AI chat service for Bulgarian university applications",
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize RAG retriever
retriever = Retriever()

# ----------------------------------------------------------------------
# System Prompt
# ----------------------------------------------------------------------

SYSTEM_PROMPT_TEMPLATE = """Ти си Еда - AI асистент за системата ЕСКИЗ.

ЕСКИЗ = Единна система за кандидатстване и информационно обслужване на записването.
Това е официалната платформа на Министерството на образованието и науката (МОН) за кандидатстване на чуждестранни студенти в български университети.

ОФИЦИАЛНА ИНФОРМАЦИЯ:
- Уебсайт: eskis.mon.bg
- Регистрация: eskis-can.mon.bg
- Имейл за поддръжка: eskis.helpdesk@math.bas.bg

---
КОНТЕКСТ ОТ ДОКУМЕНТАЦИЯТА:

{context}

---

ПРАВИЛА:
1. Отговаряй САМО с информация от контекста по-горе.
2. За адреси, имейли и дати - използвай ТОЧНО това, което пише в документацията.
3. Ако нещо не е в контекста, кажи "Нямам тази информация в документацията."
4. Отговаряй на езика на потребителя (български или английски).
5. НЕ измисляй информация. НЕ гадай."""


# ----------------------------------------------------------------------
# Endpoints
# ----------------------------------------------------------------------

@app.get("/health")
async def health_check():
    """Health check."""
    stats = retriever.vectorstore.get_stats()
    return {
        "status": "healthy",
        "vectorstore": stats,
    }


@app.post("/chat")
async def chat(request: ChatRequest):
    """Stream chat response with RAG context."""

    # Get the user's question
    user_message = request.messages[-1].content if request.messages else ""

    # Retrieve relevant context from vector store
    context = retriever.get_context(user_message)

    if not context:
        context = "Няма намерена релевантна информация в документацията."

    # Build system prompt with context
    system_prompt = SYSTEM_PROMPT_TEMPLATE.format(context=context)

    # Build message history
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "assistant", "content": "Разбирам. Ще отговарям само с информация от документацията за ЕСКИЗ."},
    ]

    for msg in request.messages:
        messages.append({"role": msg.role, "content": msg.content})

    # Debug logging
    print(f"\n[Chat] User: {user_message[:100]}...")
    print(f"[Chat] Context length: {len(context)} chars")

    async def event_generator():
        try:
            async for chunk in chat_stream(messages):
                yield {
                    "event": "message",
                    "data": json.dumps({"content": chunk}),
                }
            yield {"event": "done", "data": json.dumps({})}
        except Exception as e:
            print(f"[Chat] Error: {e}")
            yield {"event": "error", "data": json.dumps({"error": str(e)})}

    return EventSourceResponse(event_generator())


@app.get("/knowledge")
async def get_knowledge():
    """Show vector store statistics."""
    stats = retriever.vectorstore.get_stats()
    sources = retriever.vectorstore.list_documents()
    return {
        "stats": stats,
        "sources": sources,
    }


@app.get("/search")
async def search(query: str, top_k: int = 5):
    """Test search endpoint for debugging."""
    results = retriever.get_context_with_sources(query, top_k=top_k)
    return results


# ----------------------------------------------------------------------

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.host,
        port=settings.port,
        reload=True,
    )