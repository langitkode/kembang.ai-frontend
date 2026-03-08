# Chat Widget Architecture

Purpose: Allow UMKM to embed the AI chatbot into their websites with zero-effort.

## Example Embed Code

```html
<script src="https://cdn.saas.com/widget.js"></script>
<script>
  ChatWidget.init({
    apiKey: "kw_live_abc123", // Shared key for the tenant's widget
    apiBase: "https://api.kembang.ai",
  });
</script>
```

## Internal Components

- **ChatLauncher**: Floating button to open/close chat.
- **ChatWindow**: Main container for the conversation.
- **MessageList**: Scrollable list of user/assistant messages.
- **MessageInput**: Input area with enter-to-send logic.

## Logic Flow

1. User clicks launcher.
2. `ChatWindow` toggles visibility.
3. User sends message → optimistic update in `MessageList`.
4. Message sent to `POST /api/v1/widget/chat` with `X-API-Key` header.
5. Receive `ChatResponse` → append assistant reply and sources.

## Constraints

- Bundle size < 80kb (via `tsup` or `rollup`).
- Pure JS/TS implementation without heavy framework requirements (or using Preact).
- Persist `conversation_id` in `localStorage` to survive page reloads.
