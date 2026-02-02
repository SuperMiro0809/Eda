'use client';

import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { MessageRow, BubbleContainer, Bubble, Timestamp } from './styles';
import type { MessageBubbleProps } from './types';

// ----------------------------------------------------------------------

function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date);
}

// ----------------------------------------------------------------------

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <MessageRow isUser={isUser}>
      <BubbleContainer isUser={isUser}>
        <Bubble isUser={isUser}>
          {isUser ? (
            message.content
          ) : (
            <Markdown remarkPlugins={[remarkGfm]}>{message.content}</Markdown>
          )}
        </Bubble>
        <Timestamp isUser={isUser}>{formatTime(new Date(message.timestamp))}</Timestamp>
      </BubbleContainer>
    </MessageRow>
  );
}
