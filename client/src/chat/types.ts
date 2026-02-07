import type { Message } from '@/components/chat/types';

// Re-export Message for convenience
export type { Message };

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string; // ISO string for serialization
  updatedAt: string;
}

export interface ChatContextValue {
  sessions: ChatSession[];
  currentSessionId: string | null;
  currentSession: ChatSession | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  // Actions
  createSession: () => string;
  deleteSession: (id: string) => void;
  setCurrentSession: (id: string | null) => void;
  addMessage: (sessionId: string, message: Message) => void;
  updateMessage: (sessionId: string, messageId: string, content: string) => void;
  updateSessionTitle: (sessionId: string, title: string) => void;
  clearHistory: () => void;
}
