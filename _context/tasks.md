# Frontend Implementation Tasks

## Phase 1: Environment & Project Scaffolding

- [ ] Initialize Next.js project with App Router.
- [ ] Configure TailwindCSS and Design Tokens.
- [ ] Install and initialize shadcn/ui.
- [ ] Setup Turborepo or simple monorepo structure.

## Phase 2: Centralized API Client (packages/api-client)

- [ ] Implement Axios/Fetch wrapper with standard `/api/v1` prefix.
- [ ] Handle `X-API-Key` for Widget and `Bearer` token for Dashboard.
- [ ] Map backend schemas (Zod/TypeScript types).

## Phase 3: Embeddable Chat Widget (apps/widget)

- [ ] Implement `ChatLauncher` and `ChatWindow`.
- [ ] Setup `MessageList` and `MessageInput`.
- [ ] Handle persistent `conversation_id` in `localStorage`.
- [ ] **Challenge**: Bundle size < 80kb.

## Phase 4: Chat State Management (packages/chat-sdk)

- [ ] Implement Zustand store for message history.
- [ ] Handle user identification (`user_identifier`).
- [ ] Integrate with RAG backend via `api-client`.

## Phase 5: Agency Dashboard (apps/dashboard)

- [ ] Tenant CRUD and API Key generation.
- [ ] PDF Upload for Knowledge Base (KB).
- [ ] Conversation history inspector.

## Phase 6: Analytics & Monitoring

- [ ] Implement usage charts (Recharts).
- [ ] Display tokens, requests, and cost estimates.

## Phase 7: Advanced UX (Streaming)

- [ ] Implement SSE support in `api-client`.
- [ ] Update frontend to handle streaming chunks progressively.
