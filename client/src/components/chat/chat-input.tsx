'use client';

import { useState, useCallback, useEffect, useRef } from 'react';

import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';

import { Iconify } from '@/components/iconify';

import { InputArea, InputCard } from './styles';
import type { ChatInputProps } from './types';

// ----------------------------------------------------------------------

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onend: (() => void) | null;
  onerror: ((event: Event) => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognition;
    webkitSpeechRecognition?: new () => SpeechRecognition;
  }
}

// ----------------------------------------------------------------------

export function ChatInput({ value, onChange, onSend, disabled }: ChatInputProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    const SpeechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    setSpeechSupported(!!SpeechRecognitionAPI);

    if (SpeechRecognitionAPI) {
      recognitionRef.current = new SpeechRecognitionAPI();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'bg-BG'; // Bulgarian as default

      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        onChange(value ? `${value} ${transcript}` : transcript);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current.onerror = () => {
        setIsRecording(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.onresult = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.onerror = null;
      }
    };
  }, [onChange, value]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        if (value.trim()) {
          onSend();
        }
      }
    },
    [onSend, value]
  );

  const toggleRecording = useCallback(() => {
    if (!recognitionRef.current) return;

    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
      setIsRecording(true);
    }
  }, [isRecording]);

  return (
    <InputArea>
      <InputCard>
        <TextField
          fullWidth
          multiline
          maxRows={4}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything about Bulgarian universities..."
          disabled={disabled}
          variant="standard"
          slotProps={{
            input: {
              disableUnderline: true,
              sx: {
                fontSize: '0.9375rem',
                py: 0.5,
              },
            },
          }}
        />
        {speechSupported && (
          <IconButton
            onClick={toggleRecording}
            disabled={disabled}
            size="small"
            sx={{
              color: isRecording ? 'error.main' : 'text.secondary',
              '&:hover': {
                bgcolor: 'action.hover',
              },
            }}
          >
            <Iconify
              icon={isRecording ? 'solar:microphone-bold' : 'solar:microphone-outline'}
              width={22}
            />
          </IconButton>
        )}
        <IconButton
          onClick={onSend}
          disabled={disabled || !value.trim()}
          size="small"
          sx={{
            bgcolor: value.trim() ? 'grey.900' : 'grey.300',
            color: value.trim() ? '#fff' : 'grey.500',
            '&:hover': {
              bgcolor: 'grey.800',
            },
            '&:disabled': {
              bgcolor: 'grey.200',
              color: 'grey.400',
            },
            transition: 'all 0.2s',
          }}
        >
          <Iconify icon="solar:arrow-up-linear" width={20} />
        </IconButton>
      </InputCard>
    </InputArea>
  );
}
