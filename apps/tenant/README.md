# Kembang AI Tenant Console

Tenant dashboard for managing your chatbot instance on the Kembang AI platform.

## Features

- **Dashboard**: Overview of your tenant's usage statistics and quick actions
- **Knowledge Base**: Upload and manage documents for your chatbot
- **Conversations**: View chat history and user interactions
- **API Keys**: Generate and manage your tenant API key
- **Team Settings**: Manage team members and their roles
- **Integrations**: Get widget embed code for your website
- **System Config**: Configure tenant-specific settings

## Getting Started

### Development

```bash
# From the root of the monorepo
npm run dev:tenant
```

The tenant console will be available at `http://localhost:3001` (or the next available port).

### Build

```bash
npm run build:tenant
```

### Production

```bash
npm run start:tenant
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
│   ├── console/    # Superadmin dashboard
│   ├── tenant/     # Tenant dashboard (this app)
│   └── widget/     # Chat widget SDK
└── packages/
    ├── api-client/ # Shared API client
    └── ui/         # Shared UI components
```

## Authentication

- Uses JWT tokens stored in localStorage
- Token is automatically attached to API requests
- Session persists across page refreshes

## API Integration

All API calls go through the shared `@kembang/api-client` package which provides:

- Automatic token attachment
- Error handling
- Request/response interceptors for logging

## Deployment

This app can be deployed independently from the superadmin console:

```bash
# Deploy to Vercel
vercel --project kembang-tenant

# Deploy to another platform
npm run build:tenant
```

Recommended domains:
- `app.kembang.ai` - Main tenant dashboard
- `tenant.kembang.ai` - Alternative

## License

ISC
