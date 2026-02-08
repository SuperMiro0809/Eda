'use client';

import { useState, useCallback, useEffect, useRef } from 'react';

import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';

import { useTranslate } from '@/locales';

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

export function ChatInput({ value, onChange, onSend, onStop, disabled, isGenerating }: ChatInputProps) {
  const { t } = useTranslate();

  const [isRecording, setIsRecording] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const onChangeRef = useRef(onChange);
  const valueRef = useRef(value);

  // Keep refs updated
  useEffect(() => {
    onChangeRef.current = onChange;
    valueRef.current = value;
  }, [onChange, value]);

  // Initialize speech recognition once
  useEffect(() => {
    const SpeechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    setSpeechSupported(!!SpeechRecognitionAPI);

    if (SpeechRecognitionAPI) {
      const recognition = new SpeechRecognitionAPI();
      recognition.continuous = true; // Keep listening
      recognition.interimResults = true; // Show interim results
      recognition.lang = 'bg-BG'; // Bulgarian as default

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            finalTranscript += result[0].transcript;
          } else {
            interimTranscript += result[0].transcript;
          }
        }

        // Only update with final results to avoid duplicates
        if (finalTranscript) {
          const currentValue = valueRef.current;
          onChangeRef.current(currentValue ? `${currentValue} ${finalTranscript}` : finalTranscript);
        }
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event);
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current.onresult = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.onerror = null;
      }
    };
  }, []);

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

  const handleSendButtonClick = useCallback(
    () => {
      if (isRecording && recognitionRef.current) {
        recognitionRef.current.stop();
        setIsRecording(false);
      }

      onSend();
    },
    [onSend, isRecording]
  );

  const toggleRecording = useCallback(() => {
    if (!recognitionRef.current) return;

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (error) {
        // Recognition might already be running
        console.error('Failed to start speech recognition:', error);
      }
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
          placeholder={`${t('ask-about-anything', { ns: 'chat' })}...`}
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
        {isGenerating ? (
          <IconButton
            onClick={onStop}
            size="small"
            sx={{
              bgcolor: 'error.main',
              color: '#fff',
              '&:hover': {
                bgcolor: 'error.dark',
              },
              transition: 'all 0.2s',
            }}
          >
            <Iconify icon="solar:stop-bold" width={20} />
          </IconButton>
        ) : (
          <IconButton
            onClick={handleSendButtonClick}
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
        )}
      </InputCard>
    </InputArea>
  );
}
