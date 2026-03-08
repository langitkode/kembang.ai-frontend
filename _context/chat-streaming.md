# Streaming Chat Responses

Purpose: Improve UX by streaming tokens from LLM.

Status: **Not currently implemented in backend**. Current implementation uses standard JSON responses. Planned for `Phase 7`.

Future Transport options:

- Server Sent Events (SSE) (Preferred)
- WebSocket

Planned Flow:

1. user message
2. POST `/api/v1/widget/chat`
3. backend starts generation
4. tokens streamed via SSE
5. frontend appends chunks progressively

Current Flow (Standard):

1. user message sent to `/api/v1/widget/chat`
2. backend generates full response
3. full JSON returned (including sources)
4. frontend displays full message
5. display typing indicator while waiting
