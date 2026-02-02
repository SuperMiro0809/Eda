'use client';

import { useState, useCallback, useEffect } from 'react';

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

// ----------------------------------------------------------------------

const mockResponses = [
  "Bulgarian universities typically require:\n\n- **Secondary school diploma** (or equivalent)\n- **Entrance exams** for certain programs\n- **Language proficiency** (Bulgarian or English)\n- **Application documents** including transcripts and ID\n\nWould you like details about a specific university?",
  "The application deadlines vary by university:\n\n1. **Winter semester**: July-August\n2. **Summer semester**: January-February\n\nI recommend checking the specific university's website for exact dates. Which university interests you?",
  "Popular programs for international students include:\n\n- **Medicine & Dentistry** (English-taught)\n- **Engineering** at Technical University of Sofia\n- **Business & Economics** at UNWE\n- **IT & Computer Science** at Sofia University\n\nWhat field are you interested in?",
];

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
  } = useChat();

  const router = useRouter();

  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Set current session based on sessionId prop
  // Only run when sessionId changes, not when sessions array updates
  useEffect(() => {
    if (sessionId) {
      // Load existing session
      setCurrentSession(sessionId);
    } else {
      // New chat page - clear current session to show welcome
      setCurrentSession(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  const messages = currentSession?.messages ?? [];

  const sendMessage = useCallback(
    (content: string) => {
      if (!content.trim()) return;

      let activeSessionId = currentSessionId;
      const isNewSession = !activeSessionId;

      if (!activeSessionId) {
        activeSessionId = createSession();
      }

      const userMessage: Message = {
        id: generateId(),
        role: 'user',
        content: content.trim(),
        timestamp: new Date(),
      };

      addMessage(activeSessionId, userMessage);
      setInputValue('');
      setIsTyping(true);

      // Simulate bot response (replace with actual AI call)
      setTimeout(() => {
        const responseIndex = Math.floor(Math.random() * mockResponses.length);
        const botMessage: Message = {
          id: generateId(),
          role: 'assistant',
          content: mockResponses[responseIndex],
          timestamp: new Date(),
        };
        addMessage(activeSessionId!, botMessage);
        setIsTyping(false);

        if (isNewSession) {
          router.replace(paths.chat.details(activeSessionId));
        }
      }, 1200);
    },
    [currentSessionId, createSession, addMessage, router]
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
