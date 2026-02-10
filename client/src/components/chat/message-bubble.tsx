'use client';

import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';

import { Iconify } from '@/components/iconify';
import { useSpeechSynthesis } from '@/hooks/use-speech-synthesis';

import { MessageRow, BubbleContainer, Bubble, Timestamp } from './styles';
import type { MessageBubbleProps } from './types';

// ----------------------------------------------------------------------

function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('bg-BG', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: false,
  }).format(date);
}

// ----------------------------------------------------------------------

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const { speak, stop, isSpeaking, isSupported } = useSpeechSynthesis();

  const handleSpeechToggle = () => {
    if (isSpeaking) {
      stop();
    } else {
      speak(message.content);
    }
  };

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
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            mt: 0.5,
            px: isUser ? 0 : 0.5,
          }}
        >
          <Timestamp isUser={isUser} style={{ marginTop: 0 }}>
            {formatTime(new Date(message.timestamp))}
          </Timestamp>
          {!isUser && isSupported && message.content && (
            <IconButton
              size="small"
              onClick={handleSpeechToggle}
              sx={{
                width: 20,
                height: 20,
                color: 'text.disabled',
                '&:hover': {
                  color: 'primary.main',
                },
              }}
            >
              <Iconify
                icon={isSpeaking ? 'solar:stop-bold' : 'solar:volume-loud-linear'}
                width={14}
              />
            </IconButton>
          )}
        </Box>
      </BubbleContainer>
    </MessageRow>
  );
}
