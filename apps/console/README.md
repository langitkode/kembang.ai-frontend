# Kembang AI Superadmin Console

Platform-wide administration dashboard for managing all tenants, users, and system health on the Kembang AI platform.

## Features

- **Platform Overview**: View system-wide metrics and statistics
- **Tenant Management**: Create and manage chatbot instances for clients
- **Global Users**: Manage platform-wide user access and roles
- **Knowledge Base**: Centralized document management for all tenants
- **Conversations**: Audit system-wide chat logs
- **Infrastructure**: Monitor system health and performance metrics
- **System Config**: Configure platform-wide settings

## Getting Started

### Development

```bash
# From the root of the monorepo
npm run dev:console
```

The superadmin console will be available at `http://localhost:3000`.

### Build

```bash
npm run build:console
```

### Production

```bash
npm run start:console
```

## Environment Variables

Create a `.env.local` file in the root of this app:

```env
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000/api/v1
```

## Architecture

This app is part of a monorepo structure:

```
frontend/
├── apps/
│   ├── console/    # Superadmin dashboard (this app)
│   ├── tenant/     # Tenant dashboard
│   └── widget/     # Chat widget SDK
└── packages/
    ├── api-client/ # Shared API client
    └── ui/         # Shared UI components
```

## Authentication

- Uses JWT tokens stored in localStorage
- Requires `superadmin` role for access
- Token is automatically attached to API requests
- Session persists across page refreshes

## API Integration

All API calls go through the shared `@kembang/api-client` package which provides:

- Automatic token attachment
- Error handling
- Request/response interceptors for logging

### Superadmin Endpoints

- `GET /superadmin/stats` - Platform statistics
- `GET /superadmin/tenants` - List all tenants
- `POST /superadmin/tenants` - Create new tenant
- `GET /superadmin/users` - List all users
- `GET /superadmin/usage` - Platform-wide usage
- `GET /superadmin/conversations` - All conversations
- `GET /health` - System health check
- `GET /metrics` - System metrics

## Deployment

This app can be deployed independently from the tenant dashboard:

```bash
# Deploy to Vercel
vercel --project kembang-console

# Deploy to another platform
npm run build:console
```

Recommended domains:
- `console.kembang.ai` - Superadmin dashboard
- `admin.kembang.ai` - Alternative

## Role-Based Access

This console is **exclusively for superadmins**. Tenant users should access the separate tenant dashboard at `apps/tenant/`.

| Feature | Superadmin | Tenant Admin |
|---------|-----------|--------------|
| Create tenants | ✅ | ❌ |
| Manage all users | ✅ | ❌ |
| View platform stats | ✅ | ❌ |
| System monitoring | ✅ | ❌ |
| Manage own tenant | ✅ | ✅ |
| API Keys | ❌ | ✅ |
| Team management | ❌ | ✅ |

## License

ISC
