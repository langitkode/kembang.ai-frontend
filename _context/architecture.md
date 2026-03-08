# Frontend Architecture

Architecture type:
Monorepo

Structure:

frontend/

apps/
dashboard
widget
chat-page

packages/
ui
api-client
chat-sdk

apps/dashboard
Admin interface for agencies and tenants.

Functions:

- manage tenants
- upload knowledge base
- view analytics
- inspect conversations
- monitor usage

apps/widget
Embeddable chatbot widget.

Goals:

- small bundle
- fast loading
- minimal dependencies

packages/ui

Reusable components.
Example:
Button
Card
Modal
ChatBubble

packages/api-client
Centralized API communication.
All apps must use this package.
packages/chat-sdk
Shared chat logic.

Includes:
conversation handling
message formatting
chat state utilities
