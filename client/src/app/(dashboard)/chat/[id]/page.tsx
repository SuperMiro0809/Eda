import type { Metadata } from 'next';

import { ChatView } from '@/sections/chat/views';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Chat | Eda',
  description: 'Chat with Eda - Your Bulgarian university application assistant',
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ChatSessionPage({ params }: PageProps) {
  const { id } = await params;

  return <ChatView sessionId={id} />;
}
