# Widget SDK Design

Purpose

Define the architecture and API of the embeddable chatbot widget.
Goals:

- easy integration
- minimal setup
- small bundle size
- tenant-aware
- extensible
  The widget must work by adding a single script to any website.

1. Integration Model
Widget must support script embed integration.
Example usage:
<script src="https://cdn.saas.com/chat-widget.js"></script>

<script>
ChatWidget.init({
  apiKey: "kw_live_...",
  apiBase: "https://api.saas.com"
})
</script>

Requirements:
no build step required
no framework dependency
works in plain HTML

2. Widget Global API
   The widget exposes a global object.
   window.ChatWidget
   Public API:
   init(config)
   open()
   close()
   toggle()
   sendMessage(message)
   reset()
   Example:
   ChatWidget.open()
   ChatWidget.sendMessage("hello")

3. Widget Configuration
   Initialization config:
   ChatWidget.init({
   apiKey: string,
   apiBase: string,
   userIdentifier?: string,
   theme?: "light" | "dark",
   position?: "bottom-right" | "bottom-left",
   welcomeMessage?: string
   })
   Example:
   ChatWidget.init({
   apiKey: "kw_live_abc123",
   apiBase: "https://api.mysaas.com",
   theme: "light",
   position: "bottom-right"
   })

4. Widget Internal Architecture
   Internal modules:
   widget-core
   chat-client
   ui-renderer
   state-manager
   event-system

Responsibilities:
widget-core → lifecycle
chat-client → API communication
ui-renderer → DOM rendering
state-manager → chat state
event-system → widget events

5. Widget Lifecycle
   Lifecycle stages:
   script load
   ↓
   init(config)
   ↓
   load CSS
   ↓
   mount DOM container
   ↓
   render launcher
   ↓
   user interaction

DOM structure:

<div id="chat-widget-root">
  chat launcher
  chat window
</div>

6. Chat Communication
   Widget communicates with backend API.
   Endpoint:
   POST /api/v1/widget/chat
   Request:
   {
   conversation_id,
   message,
   user_identifier
   }
   Response:
   {
   conversation_id,
   reply,
   sources
   }
   Conversation ID stored locally.
   Storage:
   localStorage

7. Widget State
   State stored in memory.
   State fields:
   conversationId
   messages[]
   isOpen
   isLoading
   Message format:
   {
   id
   role
   content
   timestamp
   }

8. Streaming Support
   Widget should support streaming responses.
   Transport:
   Server Sent Events
   Flow:
   send message
   ↓
   open SSE connection
   ↓
   append tokens
   ↓
   finalize response

Fallback:
non-stream response

9. Event System
   Widget exposes events.
   Example events:
   chat_opened
   chat_closed
   message_sent
   message_received
   Example usage:
   ChatWidget.on("message_sent", handler)

10. Theming System
    Widget supports basic themes.
    Theme options:
    light
    dark
    custom
    Custom theme example:
    ChatWidget.init({
    theme: {
    primaryColor: "#4f46e5",
    backgroundColor: "#ffffff"
    }
    })

11. Security
    Widget must include the unique API Key.
    Each request includes:
    Headers example:
    X-API-Key: <kw*live*...>
    Optional domain restriction:
    allowed_domains (configured in dashboard)

12. Performance Constraints
    Target metrics:
    bundle size < 80kb
    first render < 500ms
    API latency < 1s

Optimization:
lazy load chat window
minimal dependencies

13. Build System
    Widget built as standalone JS bundle.
    Tools:
    tsup
    rollup
    vite library mode

Output:
chat-widget.js
chat-widget.css

Hosted on CDN.
Example:
cdn.saas.com/widget.js

14. Future Extensions
    Future SDK features:
    live agent handoff
    multi-language UI
    voice input
    file uploads

Widget architecture must remain extensible.
