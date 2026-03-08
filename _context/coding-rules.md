# Frontend Coding Rules

## General Principles

- **KISS**: Prefer simple, focused components over "God components".
- **SOC**: Keep API logic (`api-client`), state management (`zustand`), and UI (`components`) strictly separated.
- **Tenant Context**: Always be aware of the active tenant. Ensure headers (`X-Tenant-ID` or `X-API-Key`) are present in all requests.

## Architecture & Structure

- **Component size**: Max 250 lines. If larger, refactor into smaller sub-components.
- **Folder structure**:
  - `/components`: Reusable UI elements.
  - `/hooks`: Shared data fetching or logic (e.g., `useChat`).
  - `/stores`: Zustand store definitions.
  - `/lib`: Utility functions and centralized `api-client`.

## State & Data

- **Global State**: Use Zustand for UI state (sidebar toggle, user session, active conversation).
- **Server State**: Use TanStack Query (React Query) for all API data fetching.
- **Type Safety**: No `any`. Use TypeScript interfaces generated/aligned with backend Pydantic models (e.g., `ChatResponse`, `TenantOut`).

## RAG & Chat UI Patterns

- **Typing Indicators**: Mandatory "Assistant is thinking..." state for all chat interactions.
- **Source Citations**: Assistant bubbles must render a list of sources if `sources` are present in the response.
- **Markdown Support**: Use `react-markdown` to render formatted LLM responses.

## API Rules

- **No direct fetch**: Never call `fetch` or `axios` directly in a component. Always use the `api-client` package.
- **Error Boundaries**: Wrap major UI sections in Error Boundaries to handle API failures gracefully.

## Styling Rules

- **Tailwind Only**: Use TailwindCSS for all styling.
- **Avoid Inline Styles**: Use classes for consistency.
- **shadcn/ui**: Use shadcn components as the base for all complex UI elements (Modals, Selects, etc.).

## Error Handling

- **User Friendly**: Show actionable errors (e.g., "Gagal mengunggah PDF, format tidak didukung") rather than raw technical error codes.
- **Validation**: Use `Zod` for client-side form validation before sending data to the backend.
