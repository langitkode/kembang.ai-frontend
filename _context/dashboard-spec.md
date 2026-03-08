# Developer Console (Admin Dashboard)

## Purpose

The **Developer Console** serves as the primary command center for the **Agency Owner / Developer (You)** to manage and orchestrate the multi-tenant SaaS ecosystem (UMKMs).

## Core Sections

1. **Global Overview**: Aggregated metrics across all managed UMKM tenants.
2. **Tenant Registry**: CRUD for UMKM entities, subscription status, and **API Key generation**.
3. **Knowledge Base (KB) Orchestrator**: Uploading and managing documents _on behalf of_ tenants.
4. **Conversation Auditor**: Inspecting chat history across different tenants for quality assurance.
5. **Infrastructure Analytics**: Monitoring Groq token usage, request latency, and local embedding performance.
6. **System Settings**: Admin profile, security, and global API configurations.

## API Integration Map

### Base Prefix: `/api/v1`

| Feature  | Endpoint                      | Method    | Auth Required |
| -------- | ----------------------------- | --------- | ------------- |
| Auth     | `/auth/login`, `/auth/me`     | POST, GET | JWT           |
| Tenants  | `/admin/tenants`              | GET, POST | JWT (Admin)   |
| API Keys | `/admin/generate-api-key`     | POST      | JWT (Admin)   |
| KB       | `/kb/documents`, `/kb/upload` | GET, POST | JWT           |
| Chat     | `/chat/history/{id}`          | GET       | JWT           |
| Usage    | `/admin/usage`                | GET       | JWT (Admin)   |

## Key Widgets

- **Total Requests**: 24h/7d request volume.
- **Token Efficiency**: Visualization of input vs output tokens.
- **Knowledge Coverage**: Percentage of queries answered by KB vs fallback.
- **Top Tenants**: Resource consumption per UMKM.
