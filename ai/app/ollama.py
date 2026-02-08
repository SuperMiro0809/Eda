import httpx
from typing import AsyncGenerator

from app.config import settings


async def chat_stream(
    messages: list[dict],
    model: str | None = None,
) -> AsyncGenerator[str, None]:
    """
    Stream chat responses from Ollama API.

    Args:
        messages: List of message dicts with 'role' and 'content'
        model: Optional model override, defaults to settings.ollama_model

    Yields:
        Text chunks from the LLM response
    """
    model = model or settings.ollama_model

    payload = {
        "model": model,
        "messages": messages,
        "stream": True,
        "options": {
            "temperature": 0.1,  # Very low temperature for factual responses
            "top_p": 0.9,
            "num_ctx": 32768,  # Large context window
        },
    }

    async with httpx.AsyncClient(timeout=300.0) as client:
        async with client.stream(
            "POST",
            f"{settings.ollama_host}/api/chat",
            json=payload,
        ) as response:
            response.raise_for_status()

            async for line in response.aiter_lines():
                if line:
                    import json
                    data = json.loads(line)
                    if "message" in data and "content" in data["message"]:
                        yield data["message"]["content"]

                    if data.get("done", False):
                        break


async def chat_complete(
    messages: list[dict],
    model: str | None = None,
) -> str:
    """
    Get complete chat response from Ollama API (non-streaming).

    Args:
        messages: List of message dicts with 'role' and 'content'
        model: Optional model override

    Returns:
        Complete response text
    """
    model = model or settings.ollama_model

    payload = {
        "model": model,
        "messages": messages,
        "stream": False,
    }

    async with httpx.AsyncClient(timeout=300.0) as client:
        response = await client.post(
            f"{settings.ollama_host}/api/chat",
            json=payload,
        )
        response.raise_for_status()
        data = response.json()
        return data["message"]["content"]