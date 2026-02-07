# Chat Streaming Data Flow

This document describes how chat messages flow from the LLM (Ollama) to the frontend client.

## Architecture Overview

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Ollama     │────▶│  ollama.py   │────▶│   main.py    │────▶│   Frontend   │
│   (LLM)      │     │  (Extract)   │     │    (SSE)     │     │   (Parse)    │
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
```

## Step-by-Step Flow

### 1. Ollama API Response

Ollama's `/api/chat` endpoint returns NDJSON (newline-delimited JSON) when streaming:

```json
{"model":"llama3:70b","message":{"role":"assistant","content":" Hello"},"done":false}
{"model":"llama3:70b","message":{"role":"assistant","content":"!"},"done":false}
{"model":"llama3:70b","message":{"role":"assistant","content":" I'm"},"done":false}
{"model":"llama3:70b","message":{"role":"assistant","content":" Eda"},"done":false}
{"model":"llama3:70b","message":{"role":"assistant","content":"."},"done":false}
{"model":"llama3:70b","message":{"role":"assistant","content":""},"done":true}
```

**Note:** Spaces are part of the tokens (e.g., `" Hello"`, `" I'm"`). This is how LLM tokenization works.

### 2. ollama.py - Content Extraction

`app/ollama.py` - `chat_stream()` function:

```python
async for line in response.aiter_lines():
    if line:
        data = json.loads(line)
        if "message" in data and "content" in data["message"]:
            yield data["message"]["content"]  # Yields: " Hello", "!", " I'm", etc.
```

**Output:** Raw text chunks preserving spaces: `" Hello"`, `"!"`, `" I'm"`, `" Eda"`, `"."`

### 3. main.py - SSE Formatting

`app/main.py` - `event_generator()` function:

```python
async for chunk in chat_stream(messages):
    yield {
        "event": "message",
        "data": json.dumps({"content": chunk}),  # JSON-encode to preserve spaces
    }
```

**Output:** SSE events sent to client:
```
event: message
data: {"content": " Hello"}

event: message
data: {"content": "!"}

event: message
data: {"content": " I'm"}

event: done
data: {}
```

**Why JSON encoding?** SSE's `data:` field format can strip leading/trailing spaces. JSON encoding preserves them.

### 4. Frontend - SSE Parsing

`client/src/utils/chat-stream.ts`:

```typescript
// Parse SSE lines
if (line.startsWith('data:')) {
    const rawData = line.slice(5).trimStart();
    const parsed = JSON.parse(rawData);
    if (parsed.content !== undefined) {
        callbacks.onChunk(parsed.content);  // " Hello", "!", " I'm", etc.
    }
}
```

**Output:** Chunks accumulated into full response: `" Hello" + "!" + " I'm" + " Eda" + "."` = `" Hello! I'm Eda."`

### 5. React State Update

`client/src/sections/chat/views/chat-view.tsx`:

```typescript
streamContentRef.current += chunk;  // Accumulate chunks
updateMessage(sessionId, messageId, streamContentRef.current);  // Update UI
```

## Event Types

| Event | Description | Data Format |
|-------|-------------|-------------|
| `message` | Text chunk from LLM | `{"content": "text"}` |
| `done` | Stream completed | `{}` |
| `error` | Error occurred | `{"error": "message"}` |

## Debugging

### Check Ollama Output
```bash
curl http://localhost:11434/api/chat -d '{
  "model": "llama3:70b",
  "messages": [{"role": "user", "content": "Hi"}],
  "stream": true
}'
```

### Check FastAPI Output
Add logging in `main.py`:
```python
async for chunk in chat_stream(messages):
    print(f"Chunk: {repr(chunk)}")  # Shows spaces clearly
    yield {"event": "message", "data": json.dumps({"content": chunk})}
```

### Check Frontend
Console logs in `chat-stream.ts` show received SSE lines and parsed JSON.

## Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| No spaces between words | Spaces stripped during SSE parsing | Use JSON encoding for data |
| Response not streaming | `stream: false` in Ollama request | Ensure `stream: True` |
| CORS errors | Frontend URL not in allowed origins | Update `FRONTEND_URL` in `.env` |