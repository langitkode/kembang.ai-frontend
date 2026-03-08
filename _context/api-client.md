# API Client

All frontend apps must use the centralized API client.

Location: `packages/api-client`

Responsibilities:

- handle API requests with standard prefix `/api/v1`
- attach JWT auth headers for Dashboard/Admin
- attach `X-API-Key` headers for Widget
- handle `X-Tenant-ID` for admin cross-tenant context
- handle errors (401, 403, 404, etc.)

Example usage:

- `chatApi.sendMessage()`
- `tenantApi.getTenants()`
- `kbApi.uploadDocument()`
- `analyticsApi.getUsage()`

Headers (Dashboard/Admin):

- `Authorization: Bearer <jwt_token>`
- `X-Tenant-ID: <tenant_id>` (optional, defaults to user's tenant)

Headers (Widget):

- `X-API-Key: <kw_live_...>`
- `X-Tenant-ID` is NOT used by widget (identified by API Key)
