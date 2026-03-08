# Chat State Management

Chat state is managed via Zustand.

## State Model

- `conversationId`: uuid string
- `userIdentifier`: string (e.g., fingerprint, email, or "anonymous")
- `messages`: Message[]
- `isLoading`: boolean

## Message Structure

```typescript
{
  id: string;        // uuid
  role: "user" | "assistant";
  content: string;   // Maps to 'reply' from backend for assistant
  sources?: string[]; // chunk_ids returned by backend
  timestamp: string;
}
```

## Chat Actions

- `initChat(user_id)`: Initialize user context
- `sendMessage(text)`: Call `/api/v1/widget/chat`
- `receiveMessage(data)`: Process `ChatResponse` (reply, conversation_id, sources)
- `resetConversation()`: Clear local state

## Flow

1. User sends message
2. Optimistic UI update (append user message)
3. API request to backend (includes `user_identifier`, `message`, `conversation_id`)
4. Receive `ChatResponse` (`reply`, `conversation_id`, `sources`)
5. Update state (append assistant message, sync `conversation_id`)
