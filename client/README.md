# Eda Client

Next.js 16 frontend application for the Eda AI chatbot - a Bulgarian university application assistant.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI Library**: MUI (Material-UI) v7
- **State Management**: React Context
- **Forms**: React Hook Form + Yup validation
- **Internationalization**: i18next (Bulgarian/English)
- **Styling**: Emotion (CSS-in-JS)
- **HTTP Client**: Axios

## Project Structure

```
client/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (auth)/             # Auth pages (login, register)
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (dashboard)/        # Protected pages
│   │   │   ├── chat/           # Chat interface
│   │   │   │   └── [id]/       # Session-specific chat
│   │   │   └── user/
│   │   │       └── profile/    # User profile settings
│   │   └── page.tsx            # Root redirect
│   │
│   ├── auth/                   # Authentication module
│   │   ├── context/            # AuthContext & AuthProvider
│   │   ├── hooks/              # useAuth hook
│   │   ├── actions/            # Server actions (login, register, etc.)
│   │   └── guards/             # AuthGuard, GuestGuard
│   │
│   ├── chat/                   # Chat module
│   │   ├── context/            # ChatContext & ChatProvider
│   │   ├── hooks/              # useChat hook
│   │   └── types.ts            # ChatSession, Message types
│   │
│   ├── components/             # Reusable components
│   │   ├── chat/               # Chat UI components
│   │   │   ├── chat-input.tsx      # Message input with speech-to-text
│   │   │   ├── message-list.tsx    # Message display
│   │   │   ├── message-bubble.tsx  # Individual message
│   │   │   ├── typing-indicator.tsx
│   │   │   └── chat-nav-options.tsx # Session rename/delete
│   │   ├── hook-form/          # Form components (RHFTextField, etc.)
│   │   ├── settings/           # Theme settings drawer
│   │   ├── nav-section/        # Navigation components
│   │   └── ...
│   │
│   ├── layouts/                # Page layouts
│   │   ├── main/               # Dashboard layout with sidebar
│   │   ├── auth/               # Auth pages layout
│   │   └── components/         # Layout components
│   │
│   ├── sections/               # Page-specific sections
│   │   ├── auth/               # Login/Register forms
│   │   ├── chat/               # Chat view
│   │   └── user/               # Profile settings
│   │
│   ├── locales/                # i18n translations
│   │   └── langs/
│   │       ├── en/             # English translations
│   │       └── bg/             # Bulgarian translations
│   │
│   ├── routes/                 # Route definitions
│   │   └── paths.ts
│   │
│   ├── utils/                  # Utilities
│   │   ├── axios.ts            # Axios instance with interceptors
│   │   └── chat-stream.ts      # SSE streaming for AI responses
│   │
│   └── global-config.ts        # App configuration
│
├── public/
│   └── assets/                 # Static assets
│
└── package.json
```

## Key Features

### Authentication
- JWT-based authentication via Laravel Sanctum
- Persistent sessions with token refresh
- Protected routes with AuthGuard
- Guest-only routes with GuestGuard

### Chat Interface
- Real-time AI responses via Server-Sent Events (SSE)
- Speech-to-text input (Web Speech API)
- Stop generation button
- Session management (create, rename, delete)
- Message history persistence

### Internationalization
- Bulgarian (default) and English support
- Namespace-based translations (auth, chat, common, etc.)

### Theme
- Light/Dark mode toggle
- RTL support
- Customizable color schemes

## Environment Variables

Create `.env.local`:

```env
# Laravel API URL
NEXT_PUBLIC_SERVER_URL=http://localhost:8000/api

# Python AI Service URL
NEXT_PUBLIC_AI_SERVER_URL=http://localhost:8000
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## API Integration

### Laravel API (REST)
- Authentication endpoints
- User profile management
- Chat session CRUD
- Message persistence

### Python AI Service (SSE)
- `/chat` - Stream AI responses
- `/health` - Service health check
- `/search` - RAG search (debug)

## Pages

| Route | Description | Auth Required |
|-------|-------------|---------------|
| `/` | Redirect to `/chat` | No |
| `/login` | Login page | Guest only |
| `/register` | Registration page | Guest only |
| `/chat` | New chat session | Yes |
| `/chat/[id]` | Existing chat session | Yes |
| `/user/profile` | User profile settings | Yes |

## Components

### Chat Components
- `ChatInput` - Text input with speech-to-text and send/stop buttons
- `MessageList` - Scrollable message container
- `MessageBubble` - Individual message with markdown rendering
- `TypingIndicator` - Animated dots during AI response
- `ChatNavOptions` - Rename/delete session menu

### Form Components
- `RHFTextField` - React Hook Form text field
- `FormProvider` - Form context wrapper

## State Management

### AuthContext
```typescript
{
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  // Actions
  login(email, password): Promise<void>;
  register(data): Promise<void>;
  logout(): Promise<void>;
}
```

### ChatContext
```typescript
{
  sessions: ChatSession[];
  currentSession: ChatSession | null;
  isLoading: boolean;
  // Actions
  createSession(): Promise<string>;
  deleteSession(id): Promise<void>;
  updateSessionTitle(id, title): Promise<void>;
  addMessage(sessionId, message): Promise<string>;
}
```

## Styling

Uses MUI with Emotion for styling. Key patterns:

```tsx
// sx prop for quick styles
<Box sx={{ p: 2, bgcolor: 'background.paper' }}>

// styled components for complex styles
const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2,
}));
```

## Development

### Code Style
- TypeScript strict mode
- ESLint + Prettier
- Path aliases (`@/components`, `@/utils`, etc.)

### Adding Translations
1. Add keys to `src/locales/langs/en/*.json`
2. Add Bulgarian translations to `src/locales/langs/bg/*.json`
3. Use with `useTranslate()` hook:
   ```tsx
   const { t } = useTranslate();
   t('key', { ns: 'namespace' });
   ```
