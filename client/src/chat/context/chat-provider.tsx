'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';

import { useAuth } from '@/auth/hooks/use-auth';

import { ChatContext } from './chat-context';
import type { ChatSession, Message } from '../types';

// ----------------------------------------------------------------------

const STORAGE_KEY = 'eda-chat-sessions';
const GUEST_SESSION_KEY = 'eda-guest-chat';

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
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load sessions based on auth status
  useEffect(() => {
    if (authLoading) return;

    if (isAuthenticated) {
      // Authenticated: load from localStorage (TODO: load from backend API)
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as ChatSession[];
          setSessions(parsed);
        }
      } catch (error) {
        console.error('Failed to load chat sessions:', error);
      }
    } else {
      // Guest: start with empty session or restore temporary guest session
      try {
        const guestSession = sessionStorage.getItem(GUEST_SESSION_KEY);
        if (guestSession) {
          const parsed = JSON.parse(guestSession) as ChatSession;
          setSessions([parsed]);
          setCurrentSessionId(parsed.id);
        }
      } catch (error) {
        console.error('Failed to load guest session:', error);
      }
    }
    setIsLoading(false);
  }, [isAuthenticated, authLoading]);

  // Save sessions based on auth status
  useEffect(() => {
    if (isLoading || authLoading) return;

    if (isAuthenticated) {
      // Authenticated: save to localStorage (TODO: sync with backend API)
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
      } catch (error) {
        console.error('Failed to save chat sessions:', error);
      }
    } else {
      // Guest: save single session to sessionStorage (cleared on browser close)
      try {
        if (sessions.length > 0) {
          sessionStorage.setItem(GUEST_SESSION_KEY, JSON.stringify(sessions[0]));
        } else {
          sessionStorage.removeItem(GUEST_SESSION_KEY);
        }
      } catch (error) {
        console.error('Failed to save guest session:', error);
      }
    }
  }, [sessions, isLoading, isAuthenticated, authLoading]);

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

    if (isAuthenticated) {
      // Authenticated users can have multiple sessions
      setSessions((prev) => [newSession, ...prev]);
    } else {
      // Guests can only have one session - replace existing
      setSessions([newSession]);
    }

    setCurrentSessionId(id);
    return id;
  }, [isAuthenticated]);

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
      isAuthenticated,
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
      isAuthenticated,
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
