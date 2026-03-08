# Frontend Project Overview

## Project

**Kembang AI** — Developer Console & SaaS Engine for UMKM.

## Purpose

Provide a high-performance **Developer Console** to manage and orchestrate the multi-tenant RAG ecosystem:

1. **Developer Console (Admin)**: The primary command center for the Agency Owner (You) to manage all tenants.
2. **Tenant Lifecycle**: On-boarding new UMKM clients and provisioning unique **X-API-Key** credentials.
3. **Knowledge Base (KB)**: A technical management interface for ingestion (PDF) and local embedding status.
4. **Usage Analytics**: Real-time monitoring of Groq tokens, request volumes, and system performance.
5. **Widget SDK**: A standalone, high-performance embeddable client for UMKM merchant websites.
6. **SaaS Ready**: Built with a multi-tenant architecture that allows future tenant-level dashboard access.

## Architecture Goals

- **Multi-Tenant Aware**: Deep integration with backend tenant isolation.
- **RAG Optimized**: Native support for source citations and thinking states.
- **Embeddable & Lightweight**: A performance-first widget SDK (<80kb).
- **Omnichannel ready**: Shared components that can be reused for WhatsApp/Telegram web previews.
- **Compatible with FastAPI**: Standardized communication with the `/api/v1` backend.

## Frontend Apps

1. **`apps/dashboard`**: Next.js (App Router) admin suite using Shadcn/UI.
2. **`apps/widget`**: Standalone JS/TS SDK for website embedding.
3. **`apps/chat-portal`**: (Optional) Full-screen chat page for direct sharing.

## Design Priorities

1. **Visual Excellence**: Premium, modern UI tailored for UMKM professionals.
2. **Reusable Packages**: Shared `ui`, `api-client`, and `chat-sdk` packages.
3. **Zero Configuration**: Focus on "upload once, chat anywhere" simplicity.
4. **Fast Feedback**: Optimistic updates and streaming-ready state management.
