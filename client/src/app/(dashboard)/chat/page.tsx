import type { Metadata } from 'next';

import { ChatView } from '@/sections/chat/views';

export const metadata: Metadata = {
  title: 'Chat | Eda',
  description: 'Chat with Eda - Your Bulgarian university application assistant',
};

export default function ChatPage() {
  return <ChatView />;
}
