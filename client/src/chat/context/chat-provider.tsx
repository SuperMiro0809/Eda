'use client';

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';

import { useAuth } from '@/auth/hooks/use-auth';

import {
  getSessionsAction,
  getSessionAction,
  createSessionAction,
  updateSessionAction,
  deleteSessionAction,
  createMessageAction,
  updateMessageAction,
} from '@/actions/chat';

import { ChatContext } from './chat-context';
import type { ChatSession, Message } from '../types';

// ----------------------------------------------------------------------

const DEFAULT_TITLE = 'New conversation';
const GUEST_SESSION_KEY = 'eda-guest-chat';

function generateId(): string {
  return `chat-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function generateTitle(messages: Message[]): string {
  const firstUserMessage = messages.find((m) => m.role === 'user');
  if (firstUserMessage) {
    const content = firstUserMessage.content;
    return content.length > 30 ? `${content.slice(0, 30)}...` : content;
  }
  return DEFAULT_TITLE;
}

// Transform API session to local format
function transformApiSession(apiSession: any): ChatSession {
  return {
    id: apiSession.id,
    title: apiSession.title,
    messages: (apiSession.messages || []).map((m: any) => ({
      id: m.id,
      role: m.role,
      content: m.content,
      timestamp: new Date(m.created_at),
    })),
    createdAt: apiSession.created_at,
    updatedAt: apiSession.updated_at,
  };
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
  const loadedSessionsRef = useRef<Set<string>>(new Set());

  // Load sessions from API (authenticated) or sessionStorage (guest)
  useEffect(() => {
    if (authLoading) return;

    const loadSessions = async () => {
      if (isAuthenticated) {
        try {
          // Clear loaded sessions cache on refresh
          loadedSessionsRef.current.clear();

          const res = await getSessionsAction();
          if (res.data?.sessions) {
            const transformedSessions = res.data.sessions.map(transformApiSession);
            setSessions(transformedSessions);
          }
        } catch (error) {
          console.error('Failed to load chat sessions:', error);
        }
      } else {
        // Guest: restore from sessionStorage
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
    };

    loadSessions();
  }, [isAuthenticated, authLoading]);

  // Save guest session to sessionStorage
  useEffect(() => {
    if (isLoading || authLoading || isAuthenticated) return;

    try {
      if (sessions.length > 0) {
        sessionStorage.setItem(GUEST_SESSION_KEY, JSON.stringify(sessions[0]));
      } else {
        sessionStorage.removeItem(GUEST_SESSION_KEY);
      }
    } catch (error) {
      console.error('Failed to save guest session:', error);
    }
  }, [sessions, isLoading, isAuthenticated, authLoading]);

  const currentSession = useMemo(
    () => sessions.find((s) => s.id === currentSessionId) ?? null,
    [sessions, currentSessionId]
  );

  // Load full session with messages when currentSessionId changes
  useEffect(() => {
    if (!isAuthenticated || !currentSessionId) return;

    // Skip if already loaded
    if (loadedSessionsRef.current.has(currentSessionId)) return;

    const loadSessionMessages = async () => {
      // Mark as loading to prevent duplicate requests
      loadedSessionsRef.current.add(currentSessionId);

      const res = await getSessionAction(currentSessionId);
      if (res.data?.session) {
        const fullSession = transformApiSession(res.data.session);
        setSessions((prev) =>
          prev.map((s) => (s.id === currentSessionId ? fullSession : s))
        );
      }
    };

    loadSessionMessages();
  }, [currentSessionId, isAuthenticated]);

  const createSession = useCallback(async () => {
    if (isAuthenticated) {
      const res = await createSessionAction({ title: DEFAULT_TITLE });

      if (res.data?.session) {
        const newSession = transformApiSession(res.data.session);
        // Mark as loaded to prevent re-fetching (which would overwrite local title updates)
        loadedSessionsRef.current.add(newSession.id);
        setSessions((prev) => [newSession, ...prev]);
        setCurrentSessionId(newSession.id);
        return newSession.id;
      }

      // Fallback to local ID if API fails
      const fallbackId = generateId();
      setCurrentSessionId(fallbackId);
      return fallbackId;
    }

    // Guest session
    const newId = generateId();
    const now = new Date().toISOString();
    const newSession: ChatSession = {
      id: newId,
      title: DEFAULT_TITLE,
      messages: [],
      createdAt: now,
      updatedAt: now,
    };
    setSessions([newSession]);
    setCurrentSessionId(newId);
    return newId;
  }, [isAuthenticated]);

  const deleteSessionHandler = useCallback(
    async (id: string) => {
      if (isAuthenticated) {
        await deleteSessionAction(id);
      }

      setSessions((prev) => prev.filter((s) => s.id !== id));
      setCurrentSessionId((current) => (current === id ? null : current));
    },
    [isAuthenticated]
  );

  const setCurrentSession = useCallback((id: string | null) => {
    setCurrentSessionId(id);
  }, []);

  const addMessage = useCallback(
    async (sessionId: string, message: Message): Promise<string> => {
      // These will be set inside setSessions callback (which runs synchronously)
      let shouldUpdateTitle = false;
      let newTitle = '';

      // Immediately update local state for responsive UI
      // Use functional updater to access ACTUAL current state (not stale closure)
      setSessions((prev) => {
        const session = prev.find((s) => s.id === sessionId);
        if (!session) return prev;

        // Check if this is the first user message
        if (session.messages.length === 0 && message.role === 'user') {
          shouldUpdateTitle = true;
          newTitle = generateTitle([message]);
        }

        return prev.map((s) => {
          if (s.id !== sessionId) return s;

          return {
            ...s,
            messages: [...s.messages, message],
            title: shouldUpdateTitle ? newTitle : s.title,
            updatedAt: new Date().toISOString(),
          };
        });
      });

      let serverMessageId = message.id;

      // Persist to API for authenticated users
      if (isAuthenticated) {
        const res = await createMessageAction(sessionId, {
          role: message.role,
          content: message.content,
        });

        // Update message with server ID if available
        if (res.data?.message) {
          serverMessageId = res.data.message.id;
          setSessions((prev) =>
            prev.map((session) => {
              if (session.id !== sessionId) return session;

              return {
                ...session,
                messages: session.messages.map((m) =>
                  m.id === message.id ? { ...m, id: serverMessageId } : m
                ),
              };
            })
          );
        }

        // Update session title in API if it changed
        if (shouldUpdateTitle && newTitle) {
          await updateSessionAction(sessionId, { title: newTitle });
        }
      }

      return serverMessageId;
    },
    [isAuthenticated]
  );

  const updateMessage = useCallback((sessionId: string, messageId: string, content: string) => {
    setSessions((prev) =>
      prev.map((session) => {
        if (session.id !== sessionId) return session;

        return {
          ...session,
          messages: session.messages.map((msg) =>
            msg.id === messageId ? { ...msg, content } : msg
          ),
          updatedAt: new Date().toISOString(),
        };
      })
    );
  }, []);

  // Save final message content to database (call after streaming completes)
  const saveMessageContent = useCallback(
    async (sessionId: string, messageId: string, content: string) => {
      if (isAuthenticated) {
        await updateMessageAction(sessionId, messageId, content);
      }
    },
    [isAuthenticated]
  );

  const updateSessionTitle = useCallback(
    async (sessionId: string, title: string) => {
      // Update local state immediately
      setSessions((prev) =>
        prev.map((session) =>
          session.id === sessionId
            ? { ...session, title, updatedAt: new Date().toISOString() }
            : session
        )
      );

      // Sync with API for authenticated users
      if (isAuthenticated) {
        await updateSessionAction(sessionId, { title });
      }
    },
    [isAuthenticated]
  );

  const clearHistory = useCallback(async () => {
    // Delete all sessions from API
    if (isAuthenticated) {
      await Promise.all(sessions.map((s) => deleteSessionAction(s.id)));
    }

    setSessions([]);
    setCurrentSessionId(null);
  }, [isAuthenticated, sessions]);

  const value = useMemo(
    () => ({
      sessions,
      currentSessionId,
      currentSession,
      isLoading,
      isAuthenticated,
      createSession,
      deleteSession: deleteSessionHandler,
      setCurrentSession,
      addMessage,
      updateMessage,
      saveMessageContent,
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
      deleteSessionHandler,
      setCurrentSession,
      addMessage,
      updateMessage,
      saveMessageContent,
      updateSessionTitle,
      clearHistory,
    ]
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}
