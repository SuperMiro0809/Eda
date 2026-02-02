'use client';

import { useRef, useEffect } from 'react';

import Box from '@mui/material/Box';

import { Scrollbar } from '@/components/scrollbar';

import { MessageBubble } from './message-bubble';
import { TypingIndicator } from './typing-indicator';
import { MessagesArea } from './styles';
import type { MessageListProps } from './types';

// ----------------------------------------------------------------------

export function MessageList({ messages, isTyping }: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  return (
    <MessagesArea>
      <Scrollbar
        ref={scrollRef}
        slotProps={{
          contentSx: {
            py: 2,
          },
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          {isTyping && <TypingIndicator />}
        </Box>
      </Scrollbar>
    </MessagesArea>
  );
}
