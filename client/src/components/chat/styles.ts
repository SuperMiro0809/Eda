'use client';

import { styled, alpha } from '@mui/material/styles';

// Main container - wider, full height
export const ChatContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: 'calc(100vh - 80px)',
  maxWidth: 1200,
  width: '100%',
  margin: '0 auto',
  position: 'relative',
}));

// Messages scrollable area
export const MessagesArea = styled('div')(({ theme }) => ({
  flex: 1,
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
}));

// Input wrapper
export const InputArea = styled('div')(({ theme }) => ({
  padding: theme.spacing(1.5, 2, 2),
  backgroundColor: theme.vars.palette.background.default,
}));

export const InputCard = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-end',
  gap: theme.spacing(1),
  padding: theme.spacing(1, 1.5),
  backgroundColor: theme.vars.palette.background.paper,
  borderRadius: theme.spacing(2),
  border: `1px solid ${theme.vars.palette.divider}`,
  transition: theme.transitions.create(['border-color', 'box-shadow']),
  '&:focus-within': {
    borderColor: theme.vars.palette.primary.main,
    boxShadow: `0 0 0 1px ${theme.vars.palette.primary.main}`,
  },
}));

// Message row container
export const MessageRow = styled('div', {
  shouldForwardProp: (prop) => prop !== 'isUser',
})<{ isUser: boolean }>(({ theme, isUser }) => ({
  display: 'flex',
  justifyContent: isUser ? 'flex-end' : 'flex-start',
  padding: theme.spacing(0.75, 2),
}));

// Bubble wrapper for max-width
export const BubbleContainer = styled('div', {
  shouldForwardProp: (prop) => prop !== 'isUser',
})<{ isUser: boolean }>(({ theme, isUser }) => ({
  maxWidth: isUser ? '70%' : '85%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: isUser ? 'flex-end' : 'flex-start',
}));

// Message bubble
export const Bubble = styled('div', {
  shouldForwardProp: (prop) => prop !== 'isUser',
})<{ isUser: boolean }>(({ theme, isUser }) => ({
  padding: theme.spacing(1.25, 2),
  borderRadius: theme.spacing(2),
  fontSize: '0.9375rem',
  lineHeight: 1.5,
  wordBreak: 'break-word',
  ...(isUser
    ? {
        backgroundColor: theme.vars.palette.primary.main,
        color: theme.vars.palette.primary.contrastText,
        borderBottomRightRadius: theme.spacing(0.5),
      }
    : {
        backgroundColor: alpha(theme.palette.grey[500], 0.08),
        color: theme.vars.palette.text.primary,
        borderBottomLeftRadius: theme.spacing(0.5),
        ...theme.applyStyles('dark', {
          backgroundColor: alpha(theme.palette.grey[500], 0.16),
        }),
      }),
  // Markdown styles
  '& p': {
    margin: 0,
    '&:not(:last-child)': {
      marginBottom: theme.spacing(1),
    },
  },
  '& ul, & ol': {
    margin: theme.spacing(0.5, 0),
    paddingLeft: theme.spacing(2),
    '& li': {
      marginBottom: theme.spacing(0.25),
    },
  },
  '& strong': {
    fontWeight: 600,
  },
  '& code': {
    backgroundColor: alpha(theme.palette.grey[500], 0.16),
    padding: theme.spacing(0.25, 0.5),
    borderRadius: theme.spacing(0.5),
    fontSize: '0.85em',
    fontFamily: 'monospace',
  },
  '& pre': {
    backgroundColor: alpha(theme.palette.grey[500], 0.12),
    padding: theme.spacing(1.5),
    borderRadius: theme.spacing(1),
    overflow: 'auto',
    margin: theme.spacing(1, 0),
    '& code': {
      backgroundColor: 'transparent',
      padding: 0,
    },
  },
  '& a': {
    color: isUser ? 'inherit' : theme.vars.palette.primary.main,
    textDecoration: 'underline',
  },
}));

// Timestamp
export const Timestamp = styled('span', {
  shouldForwardProp: (prop) => prop !== 'isUser',
})<{ isUser: boolean }>(({ theme, isUser }) => ({
  display: 'block',
  fontSize: '0.6875rem',
  color: theme.vars.palette.text.disabled,
  marginTop: theme.spacing(0.5),
  paddingLeft: isUser ? 0 : theme.spacing(0.5),
  paddingRight: isUser ? theme.spacing(0.5) : 0,
}));

// Typing indicator container
export const TypingContainer = styled('div')(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  padding: theme.spacing(1.25, 2),
  backgroundColor: alpha(theme.palette.grey[500], 0.08),
  borderRadius: theme.spacing(2),
  borderBottomLeftRadius: theme.spacing(0.5),
  ...theme.applyStyles('dark', {
    backgroundColor: alpha(theme.palette.grey[500], 0.16),
  }),
}));

// Welcome section
export const WelcomeSection = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(4, 2),
  textAlign: 'center',
  flex: 1,
}));

export const SuggestionChip = styled('button')(({ theme }) => ({
  padding: theme.spacing(1, 2),
  backgroundColor: theme.vars.palette.background.paper,
  border: `1px solid ${theme.vars.palette.divider}`,
  borderRadius: theme.spacing(3),
  fontSize: '0.875rem',
  color: theme.vars.palette.text.secondary,
  cursor: 'pointer',
  transition: theme.transitions.create(['background-color', 'border-color', 'color']),
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
    borderColor: theme.vars.palette.primary.main,
    color: theme.vars.palette.primary.main,
  },
}));
