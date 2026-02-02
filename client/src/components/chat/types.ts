export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
}

export interface MessageBubbleProps {
  message: Message;
}

export interface MessageListProps {
  messages: Message[];
  isTyping: boolean;
}
