import axios, { endpoints } from '@/utils/axios';
import { extractErrorMessage } from '@/utils/api-error';

// ----------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------

export type MessageRole = 'user' | 'assistant';

export type ApiMessage = {
  id: string;
  chat_session_id: string;
  role: MessageRole;
  content: string;
  created_at: string;
  updated_at: string;
};

export type ApiChatSession = {
  id: string;
  user_id: string;
  title: string;
  messages?: ApiMessage[];
  created_at: string;
  updated_at: string;
};

export type CreateSessionData = {
  title?: string;
};

export type UpdateSessionData = {
  title: string;
};

export type CreateMessageData = {
  role: MessageRole;
  content: string;
};

type SessionResponse = {
  status?: number;
  data?: { session: ApiChatSession };
  error?: string;
};

type SessionsResponse = {
  status?: number;
  data?: { sessions: ApiChatSession[] };
  error?: string;
};

type MessageResponse = {
  status?: number;
  data?: { message: ApiMessage };
  error?: string;
};

type MessagesResponse = {
  status?: number;
  data?: { messages: ApiMessage[] };
  error?: string;
};

type DeleteResponse = {
  status?: number;
  data?: { message: string };
  error?: string;
};

// ----------------------------------------------------------------------
// Chat Sessions API
// ----------------------------------------------------------------------

export async function getSessions(): Promise<SessionsResponse> {
  try {
    const res = await axios.get(endpoints.chat.sessions.list);
    return { status: res.status, data: res.data };
  } catch (error) {
    return { error: extractErrorMessage(error) };
  }
}

export async function getSession(id: string): Promise<SessionResponse> {
  try {
    const res = await axios.get(endpoints.chat.sessions.show(id));
    return { status: res.status, data: res.data };
  } catch (error) {
    return { error: extractErrorMessage(error) };
  }
}

export async function createSession(data?: CreateSessionData): Promise<SessionResponse> {
  try {
    const res = await axios.post(endpoints.chat.sessions.create, data || {});
    return { status: res.status, data: res.data };
  } catch (error) {
    return { error: extractErrorMessage(error) };
  }
}

export async function updateSession(id: string, data: UpdateSessionData): Promise<SessionResponse> {
  try {
    const res = await axios.put(endpoints.chat.sessions.update(id), data);
    return { status: res.status, data: res.data };
  } catch (error) {
    return { error: extractErrorMessage(error) };
  }
}

export async function deleteSession(id: string): Promise<DeleteResponse> {
  try {
    const res = await axios.delete(endpoints.chat.sessions.delete(id));
    return { status: res.status, data: res.data };
  } catch (error) {
    return { error: extractErrorMessage(error) };
  }
}

// ----------------------------------------------------------------------
// Messages API
// ----------------------------------------------------------------------

export async function getMessages(sessionId: string): Promise<MessagesResponse> {
  try {
    const res = await axios.get(endpoints.chat.messages.list(sessionId));
    return { status: res.status, data: res.data };
  } catch (error) {
    return { error: extractErrorMessage(error) };
  }
}

export async function createMessage(
  sessionId: string,
  data: CreateMessageData
): Promise<MessageResponse> {
  try {
    const res = await axios.post(endpoints.chat.messages.create(sessionId), data);
    return { status: res.status, data: res.data };
  } catch (error) {
    return { error: extractErrorMessage(error) };
  }
}

export async function updateMessage(
  sessionId: string,
  messageId: string,
  content: string
): Promise<MessageResponse> {
  try {
    const res = await axios.put(endpoints.chat.messages.update(sessionId, messageId), { content });
    return { status: res.status, data: res.data };
  } catch (error) {
    return { error: extractErrorMessage(error) };
  }
}
