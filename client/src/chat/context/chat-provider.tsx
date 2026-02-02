'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';

import { ChatContext } from './chat-context';
import type { ChatSession, Message } from '../types';

// ----------------------------------------------------------------------

const STORAGE_KEY = 'eda-chat-sessions';

function generateId(): string {
  return `chat-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function generateTitle(messages: Message[]): string {
  const firstUserMessage = messages.find((m) => m.role === 'user');
  if (firstUserMessage) {
    // Truncate to ~30 chars
    const content = firstUserMessage.content;
    return content.length > 30 ? `${content.slice(0, 30)}...` : content;
  }
  return 'New conversation';
}

// ----------------------------------------------------------------------

interface ChatProviderProps {
  children: React.ReactNode;
}

export function ChatProvider({ children }: ChatProviderProps) {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load sessions from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as ChatSession[];
        setSessions(parsed);
      }
    } catch (error) {
      console.error('Failed to load chat sessions:', error);
    }
    setIsLoading(false);
  }, []);

  // Save sessions to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
      } catch (error) {
        console.error('Failed to save chat sessions:', error);
      }
    }
  }, [sessions, isLoading]);

  const currentSession = useMemo(
    () => sessions.find((s) => s.id === currentSessionId) ?? null,
    [sessions, currentSessionId]
  );

  const createSession = useCallback(() => {
    const id = generateId();
    const now = new Date().toISOString();
    const newSession: ChatSession = {
      id,
      title: 'New conversation',
      messages: [],
      createdAt: now,
      updatedAt: now,
    };
    setSessions((prev) => [newSession, ...prev]);
    setCurrentSessionId(id);
    return id;
  }, []);

  const deleteSession = useCallback((id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
    setCurrentSessionId((current) => (current === id ? null : current));
  }, []);

  const setCurrentSession = useCallback((id: string | null) => {
    setCurrentSessionId(id);
  }, []);

  const addMessage = useCallback((sessionId: string, message: Message) => {
    setSessions((prev) =>
      prev.map((session) => {
        if (session.id !== sessionId) return session;

        const updatedMessages = [...session.messages, message];
        const title =
          session.messages.length === 0 && message.role === 'user'
            ? generateTitle([message])
            : session.title;

        return {
          ...session,
          messages: updatedMessages,
          title,
          updatedAt: new Date().toISOString(),
        };
      })
    );
  }, []);

  const updateSessionTitle = useCallback((sessionId: string, title: string) => {
    setSessions((prev) =>
      prev.map((session) =>
        session.id === sessionId
          ? { ...session, title, updatedAt: new Date().toISOString() }
          : session
      )
    );
  }, []);

  const clearHistory = useCallback(() => {
    setSessions([]);
    setCurrentSessionId(null);
  }, []);

  const value = useMemo(
    () => ({
      sessions,
      currentSessionId,
      currentSession,
      isLoading,
      createSession,
      deleteSession,
      setCurrentSession,
      addMessage,
      updateSessionTitle,
      clearHistory,
    }),
    [
      sessions,
      currentSessionId,
      currentSession,
      isLoading,
      createSession,
      deleteSession,
      setCurrentSession,
      addMessage,
      updateSessionTitle,
      clearHistory,
    ]
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}
