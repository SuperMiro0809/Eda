# Eda API

Laravel 12 REST API backend for the Eda AI chatbot application.

## Tech Stack

- **Framework**: Laravel 12
- **Authentication**: Laravel Sanctum (JWT tokens)
- **Database**: MySQL/PostgreSQL
- **PHP**: 8.2+

## Project Structure

```
api/
├── app/
│   ├── Http/
│   │   └── Controllers/
│   │       └── Api/
│   │           ├── AuthController.php      # Authentication endpoints
│   │           ├── UserController.php      # User profile management
│   │           ├── ChatSessionController.php # Chat sessions CRUD
│   │           └── MessageController.php   # Chat messages
│   │
│   ├── Models/
│   │   ├── User.php          # User model
│   │   ├── ChatSession.php   # Chat session model
│   │   └── Message.php       # Message model
│   │
│   └── Providers/
│
├── config/
│   ├── sanctum.php           # Sanctum configuration
│   └── cors.php              # CORS settings
│
├── database/
│   ├── migrations/           # Database migrations
│   └── seeders/              # Database seeders
│
├── routes/
│   └── api.php               # API route definitions
│
└── composer.json
```

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| POST | `/api/auth/logout` | Logout user | Yes |
| GET | `/api/auth/me` | Get current user | Yes |

### User Profile

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| PUT | `/api/user/profile` | Update profile | Yes |
| POST | `/api/user/avatar` | Upload avatar | Yes |
| PUT | `/api/user/password` | Change password | Yes |
| DELETE | `/api/user` | Delete account | Yes |

### Chat Sessions

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/chat/sessions` | List user's sessions | Yes |
| POST | `/api/chat/sessions` | Create new session | Yes |
| GET | `/api/chat/sessions/{id}` | Get session with messages | Yes |
| PUT | `/api/chat/sessions/{id}` | Update session (title) | Yes |
| DELETE | `/api/chat/sessions/{id}` | Delete session | Yes |

### Messages

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/chat/sessions/{id}/messages` | List session messages | Yes |
| POST | `/api/chat/sessions/{id}/messages` | Create message | Yes |
| PUT | `/api/chat/sessions/{id}/messages/{msgId}` | Update message | Yes |

## Models

### User
```php
- id: bigint (primary key)
- name: string
- email: string (unique)
- email_verified_at: timestamp (nullable)
- password: string (hashed)
- avatar: string (nullable)
- created_at: timestamp
- updated_at: timestamp

// Relationships
- chatSessions(): HasMany
```

### ChatSession
```php
- id: uuid (primary key)
- user_id: bigint (foreign key)
- title: string (default: "New conversation")
- created_at: timestamp
- updated_at: timestamp

// Relationships
- user(): BelongsTo
- messages(): HasMany
```

### Message
```php
- id: uuid (primary key)
- chat_session_id: uuid (foreign key)
- role: enum ['user', 'assistant']
- content: text
- created_at: timestamp
- updated_at: timestamp

// Relationships
- chatSession(): BelongsTo
```

## Authentication

Uses Laravel Sanctum for API token authentication.

### Login Response
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  },
  "token": "1|abc123..."
}
```

### Request Headers
```
Authorization: Bearer {token}
Accept: application/json
Content-Type: application/json
```

## Environment Variables

```env
APP_NAME=Eda
APP_ENV=local
APP_KEY=base64:...
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=eda
DB_USERNAME=root
DB_PASSWORD=

SANCTUM_STATEFUL_DOMAINS=localhost:3000
SESSION_DOMAIN=localhost

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

## Getting Started

### Prerequisites

- PHP 8.2+
- Composer
- MySQL/PostgreSQL

### Installation

```bash
# Install dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Run migrations
php artisan migrate

# Start development server
php artisan serve
```

### Database Setup

```bash
# Create database
mysql -u root -p -e "CREATE DATABASE eda;"

# Run migrations
php artisan migrate

# Seed with test data (optional)
php artisan db:seed
```

## Request/Response Examples

### Register User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "password_confirmation": "password123"
}
```

### Create Chat Session
```bash
POST /api/chat/sessions
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "My first chat"
}
```

Response:
```json
{
  "session": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "My first chat",
    "created_at": "2024-01-15T10:30:00.000000Z",
    "updated_at": "2024-01-15T10:30:00.000000Z"
  }
}
```

### Add Message
```bash
POST /api/chat/sessions/{sessionId}/messages
Authorization: Bearer {token}
Content-Type: application/json

{
  "role": "user",
  "content": "Hello, how can I apply to a Bulgarian university?"
}
```

Response:
```json
{
  "message": {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "role": "user",
    "content": "Hello, how can I apply to a Bulgarian university?",
    "created_at": "2024-01-15T10:31:00.000000Z"
  }
}
```

## Error Responses

### Validation Error (422)
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "email": ["The email field is required."]
  }
}
```

### Unauthorized (401)
```json
{
  "message": "Unauthenticated."
}
```

### Not Found (404)
```json
{
  "message": "Session not found."
}
```

## Development

### Running Tests
```bash
php artisan test
```

### Code Style
```bash
# Format code with Pint
./vendor/bin/pint
```

### Clear Cache
```bash
php artisan config:clear
php artisan cache:clear
php artisan route:clear
```

## CORS Configuration

The API is configured to allow requests from the Next.js frontend. Update `config/cors.php`:

```php
'allowed_origins' => [env('CORS_ALLOWED_ORIGINS', 'http://localhost:3000')],
'supports_credentials' => true,
```

## Sanctum Configuration

For SPA authentication, ensure proper domain configuration in `config/sanctum.php`:

```php
'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', 'localhost:3000')),
```
