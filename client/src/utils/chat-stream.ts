import { CONFIG } from '@/global-config';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface StreamCallbacks {
  onChunk: (chunk: string) => void;
  onDone: () => void;
  onError: (error: Error) => void;
}

/**
 * Stream chat responses from the AI service using Server-Sent Events.
 *
 * @param messages - Array of chat messages to send
 * @param callbacks - Callbacks for handling stream events
 * @param sessionId - Optional session ID for context
 * @returns AbortController to cancel the request
 */
export function streamChat(
  messages: ChatMessage[],
  callbacks: StreamCallbacks,
  sessionId?: string
): AbortController {
  const controller = new AbortController();

  const fetchStream = async () => {
    try {
      const response = await fetch(`${CONFIG.aiServerUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add auth header if needed
          // 'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          messages,
          session_id: sessionId,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          callbacks.onDone();
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        let currentEvent = '';

        console.log(lines);

        for (const line of lines) {
          if (line.startsWith('event:')) {
            currentEvent = line.slice(6).trim();
            continue;
          }

          if (line.startsWith('data:')) {
            // SSE format is "data: content" - slice after "data:" and the space
            const rawData = line.slice(5).trimStart();

            if (currentEvent === 'done') {
              callbacks.onDone();
              return;
            }

            if (currentEvent === 'error') {
              try {
                const parsed = JSON.parse(rawData);
                callbacks.onError(new Error(parsed.error || 'Unknown error'));
              } catch {
                callbacks.onError(new Error(rawData || 'Unknown error'));
              }
              return;
            }

            if (currentEvent === 'message' && rawData) {
              try {
                const parsed = JSON.parse(rawData);
                console.log(parsed);
                if (parsed.content !== undefined) {
                  callbacks.onChunk(parsed.content);
                }
              } catch {
                // Fallback: use raw data if not valid JSON
                callbacks.onChunk(rawData);
              }
            }
          }
        }
      }
    } catch (error) {
      if ((error as Error).name === 'AbortError') {
        return;
      }
      callbacks.onError(error as Error);
    }
  };

  fetchStream();

  return controller;
}