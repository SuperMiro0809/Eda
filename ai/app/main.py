import json

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sse_starlette.sse import EventSourceResponse

from app.config import settings
from app.schemas import ChatRequest
from app.ollama import chat_stream
from app.auth import verify_token

app = FastAPI(
    title="Eda AI Service",
    description="AI chat service for Bulgarian university applications",
    version="1.0.0",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# System prompt for Eda
SYSTEM_PROMPT = """You are Eda, a helpful AI assistant specialized in helping international students apply to Bulgarian universities.

You have knowledge about:
- Bulgarian university application processes
- Required documents and deadlines
- Tuition fees and scholarship opportunities
- Student visa requirements for Bulgaria
- Popular programs for international students
- Bulgarian language requirements and preparatory courses

Be helpful, accurate, and encouraging. If you're unsure about specific details, recommend the student contact the university directly.

Respond in the same language the user writes to you (Bulgarian or English)."""


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}


@app.post("/chat")
async def chat(
    request: ChatRequest,
    # user: dict = Depends(verify_token),  # Uncomment to enable auth
):
    """
    Stream chat responses using Server-Sent Events (SSE).

    The response is streamed as SSE events with the following format:
    - event: message, data: <text chunk>
    - event: done, data: {}
    """

    # Build messages with system prompt
    messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    for msg in request.messages:
        messages.append({"role": msg.role, "content": msg.content})

    async def event_generator():
        try:
            async for chunk in chat_stream(messages):
                # JSON encode to preserve spaces and special characters
                yield {
                    "event": "message",
                    "data": json.dumps({"content": chunk}),
                }
            yield {
                "event": "done",
                "data": json.dumps({}),
            }
        except Exception as e:
            yield {
                "event": "error",
                "data": json.dumps({"error": str(e)}),
            }

    return EventSourceResponse(event_generator())


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.host,
        port=settings.port,
        reload=True,
    )