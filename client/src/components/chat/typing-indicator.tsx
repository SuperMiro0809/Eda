'use client';

import { motion } from 'framer-motion';

import { MessageRow, BubbleContainer, TypingContainer } from './styles';

// ----------------------------------------------------------------------

export function TypingIndicator() {
  return (
    <MessageRow isUser={false}>
      <BubbleContainer isUser={false}>
        <TypingContainer>
          {[0, 1, 2].map((index) => (
            <motion.span
              key={index}
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: 'currentColor',
                opacity: 0.5,
              }}
              animate={{
                y: [0, -4, 0],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: index * 0.15,
                ease: 'easeInOut',
              }}
            />
          ))}
        </TypingContainer>
      </BubbleContainer>
    </MessageRow>
  );
}
