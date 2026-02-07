'use client';

import { useState, useCallback, useEffect, useRef } from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

import { paths } from '@/routes/paths';
import { useRouter } from '@/routes/hooks';

import { useChat } from '@/chat';
import { Iconify } from '@/components/iconify';

import { MessageList, ChatInput } from '@/components/chat';
import { ChatContainer, WelcomeSection, SuggestionChip } from '@/components/chat/styles';
import type { Message } from '@/components/chat/types';
import { streamChat, type ChatMessage } from '@/utils/chat-stream';

// ----------------------------------------------------------------------

const suggestions = [
  { text: 'What are the admission requirements?', icon: 'solar:document-text-linear' },
  { text: 'Application deadlines', icon: 'solar:calendar-linear' },
  { text: 'Popular programs', icon: 'solar:square-academic-cap-linear' },
  { text: 'Tuition fees', icon: 'solar:wallet-linear' },
];

function generateId(): string {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

// ----------------------------------------------------------------------

interface ChatViewProps {
  sessionId?: string;
}

export function ChatView({ sessionId }: ChatViewProps) {
  const {
    currentSession,
    currentSessionId,
    createSession,
    setCurrentSession,
    addMessage,
    updateMessage,
    saveMessageContent,
  } = useChat();

  const router = useRouter();

  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Track streaming content and message ID
  const streamContentRef = useRef('');
  const assistantMessageIdRef = useRef<string>('');
  const abortControllerRef = useRef<AbortController | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  // Set current session based on sessionId prop
  useEffect(() => {
    if (sessionId) {
      setCurrentSession(sessionId);
    } else {
      setCurrentSession(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  const messages = currentSession?.messages ?? [];

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) return;

      let activeSessionId = currentSessionId;
      const isNewSession = !activeSessionId;

      if (!activeSessionId) {
        activeSessionId = await createSession();
      }

      const userMessage: Message = {
        id: generateId(),
        role: 'user',
        content: content.trim(),
        timestamp: new Date(),
      };

      await addMessage(activeSessionId, userMessage);
      setInputValue('');
      setIsTyping(true);

      // Create assistant message placeholder
      const localAssistantMessageId = generateId();
      const assistantMessage: Message = {
        id: localAssistantMessageId,
        role: 'assistant',
        content: '',
        timestamp: new Date(),
      };

      // Add message and get server ID
      const serverMessageId = await addMessage(activeSessionId, assistantMessage);
      assistantMessageIdRef.current = serverMessageId;

      // Reset stream content
      streamContentRef.current = '';

      // Build message history for context
      const chatMessages: ChatMessage[] = [
        ...messages.map((m) => ({ role: m.role, content: m.content })),
        { role: 'user' as const, content: content.trim() },
      ];

      // Start streaming
      const finalSessionId = activeSessionId;
      abortControllerRef.current = streamChat(chatMessages, {
        onChunk: (chunk) => {
          streamContentRef.current += chunk;
          updateMessage(finalSessionId, serverMessageId, streamContentRef.current);
        },
        onDone: async () => {
          setIsTyping(false);
          // Save the final streamed content to database
          if (streamContentRef.current) {
            await saveMessageContent(
              finalSessionId,
              assistantMessageIdRef.current,
              streamContentRef.current
            );
          }
          if (isNewSession) {
            router.replace(paths.chat.details(finalSessionId));
          }
        },
        onError: (error) => {
          console.error('Chat stream error:', error);
          updateMessage(
            finalSessionId,
            serverMessageId,
            'Sorry, I encountered an error. Please try again.'
          );
          setIsTyping(false);
        },
      });
    },
    [currentSessionId, createSession, addMessage, updateMessage, saveMessageContent, messages, router]
  );

  const handleSend = useCallback(() => {
    sendMessage(inputValue);
  }, [inputValue, sendMessage]);

  const handleSuggestionClick = useCallback(
    (text: string) => {
      sendMessage(text);
    },
    [sendMessage]
  );

  const showWelcome = messages.length === 0;

  return (
    <ChatContainer>
      {showWelcome ? (
        <WelcomeSection>
          <Box
            sx={{
              width: 72,
              height: 72,
              borderRadius: 2,
              bgcolor: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 3,
            }}
          >
            <Iconify icon="solar:chat-round-dots-bold" width={36} sx={{ color: 'white' }} />
          </Box>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            How can I help you today?
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 480 }}>
            I'm Eda, your guide to Bulgarian university applications. Ask me anything about
            admissions, programs, or the application process.
          </Typography>
          <Stack direction="row" flexWrap="wrap" justifyContent="center" gap={1.5}>
            {suggestions.map((suggestion) => (
              <SuggestionChip
                key={suggestion.text}
                onClick={() => handleSuggestionClick(suggestion.text)}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Iconify icon={suggestion.icon} width={18} />
                  {suggestion.text}
                </Box>
              </SuggestionChip>
            ))}
          </Stack>
        </WelcomeSection>
      ) : (
        <MessageList messages={messages} isTyping={isTyping} />
      )}
      <ChatInput
        value={inputValue}
        onChange={setInputValue}
        onSend={handleSend}
        disabled={isTyping}
      />
    </ChatContainer>
  );
}
