'use server';

import {
  getSessions,
  getSession,
  createSession,
  updateSession,
  deleteSession,
  getMessages,
  createMessage,
  updateMessage,
  type CreateSessionData,
  type UpdateSessionData,
  type CreateMessageData,
} from '@/api/chat';

// ----------------------------------------------------------------------
// Chat Sessions Actions
// ----------------------------------------------------------------------

export async function getSessionsAction() {
  return await getSessions();
}

export async function getSessionAction(id: string) {
  return await getSession(id);
}

export async function createSessionAction(data?: CreateSessionData) {
  return await createSession(data);
}

export async function updateSessionAction(id: string, data: UpdateSessionData) {
  return await updateSession(id, data);
}

export async function deleteSessionAction(id: string) {
  return await deleteSession(id);
}

// ----------------------------------------------------------------------
// Messages Actions
// ----------------------------------------------------------------------

export async function getMessagesAction(sessionId: string) {
  return await getMessages(sessionId);
}

export async function createMessageAction(sessionId: string, data: CreateMessageData) {
  return await createMessage(sessionId, data);
}

export async function updateMessageAction(sessionId: string, messageId: string, content: string) {
  return await updateMessage(sessionId, messageId, content);
}
