// Browser polyfill for Node.js process
(window as any).process = { env: {} };

import { useChatStore } from "@kembang/chat-sdk";

export const WIDGET_VERSION = "1.0.0";

export interface WidgetConfig {
  apiKey: string;
  userIdentifier?: string;
  containerId?: string;
  accentColor?: string;
  title?: string;
}

class KembangWidget {
  private config: WidgetConfig;
  private container: HTMLElement | null = null;
  public version: string = WIDGET_VERSION;

  constructor(config: WidgetConfig) {
    this.config = config;
    this.init();
  }

  public getVersion(): string {
    return this.version;
  }

  private init() {
    console.log(`🌸 Kembang AI Widget v${this.version} Initializing...`);

    // Initialize the store
    const store = useChatStore.getState();
    store.init(this.config.apiKey, this.config.userIdentifier);

    // Subscribe to state changes
    useChatStore.subscribe((state) => {
      this.updateMessages(state.messages, state.isThinking);
    });

    this.render();
  }

  private render() {
    this.container = document.getElementById(
      this.config.containerId || "kembang-chat-widget",
    );
    if (!this.container) {
      this.container = document.createElement("div");
      this.container.id = "kembang-chat-widget";
      document.body.appendChild(this.container);
    }

    const accent = this.config.accentColor || "#6366F1";

    this.container.innerHTML = `
      <style>
        .kbw-wrapper {
          position: fixed; bottom: 20px; right: 20px;
          width: 360px; height: 500px;
          background: #000; color: #fff;
          border: 1px solid #262626; border-radius: 4px;
          display: flex; flex-direction: column;
          font-family: 'Inter', system-ui, sans-serif;
          box-shadow: 0 10px 25px rgba(0,0,0,0.5);
          overflow: hidden; z-index: 9999;
          transition: all 0.2s ease;
        }
        .kbw-header {
          padding: 16px; border-bottom: 1px solid #262626;
          display: flex; justify-content: space-between; align-items: center;
        }
        .kbw-title { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: ${accent}; }
        .kbw-status { font-size: 10px; color: #525252; font-family: monospace; }
        .kbw-chat { flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 16px; scrollbar-width: none; }
        .kbw-chat::-webkit-scrollbar { display: none; }
        .kbw-msg { max-width: 85%; padding: 10px 12px; font-size: 13px; line-height: 1.5; border-radius: 2px; }
        .kbw-msg-user { align-self: flex-end; background: #171717; border: 1px solid #262626; color: #fff; }
        .kbw-msg-ai { align-self: flex-start; background: #fff; color: #000; }
        .kbw-sources { margin-top: 8px; font-size: 10px; font-family: monospace; opacity: 0.6; display: flex; gap: 4px; flex-wrap: wrap; }
        .kbw-source-tag { background: rgba(0,0,0,0.1); padding: 2px 4px; border-radius: 2px; }
        .kbw-footer { padding: 16px; border-top: 1px solid #262626; }
        .kbw-input-group { display: flex; gap: 8px; }
        .kbw-input { 
          flex: 1; background: #171717; border: 1px solid #262626; color: #fff;
          padding: 8px 12px; font-size: 13px; border-radius: 2px; outline: none;
        }
        .kbw-input:focus { border-color: ${accent}; }
        .kbw-btn {
          background: ${accent}; color: #fff; border: none; padding: 0 16px;
          font-size: 12px; font-weight: 600; border-radius: 2px; cursor: pointer;
        }
        .kbw-thinking { font-style: italic; opacity: 0.5; font-size: 11px; margin-top: 4px; }
      </style>
      <div class="kbw-wrapper">
        <div class="kbw-header">
          <div class="kbw-title">${this.config.title || "Kembang AI"}</div>
          <div class="kbw-status">SECURE_CHANNEL://READY</div>
        </div>
        <div class="kbw-chat" id="kbw-chat-body">
          <div class="kbw-msg kbw-msg-ai">Hello! How can I assist you today?</div>
        </div>
        <div class="kbw-footer">
          <form id="kbw-form" class="kbw-input-group">
            <input type="text" id="kbw-input" class="kbw-input" placeholder="Enter query..." autocomplete="off" />
            <button type="submit" class="kbw-btn">SEND</button>
          </form>
          <div id="kbw-thinking" class="kbw-thinking" style="display: none;">Thinking...</div>
        </div>
      </div>
    `;

    const form = document.getElementById("kbw-form");
    const input = document.getElementById("kbw-input") as HTMLInputElement;

    form?.addEventListener("submit", (e) => {
      e.preventDefault();
      const text = input.value.trim();
      if (text) {
        useChatStore.getState().sendMessage(text);
        input.value = "";
      }
    });
  }

  private updateMessages(messages: any[], isThinking: boolean) {
    const body = document.getElementById("kbw-chat-body");
    const thinking = document.getElementById("kbw-thinking");
    if (!body) return;

    if (thinking) thinking.style.display = isThinking ? "block" : "none";

    body.innerHTML = messages
      .map(
        (m) => `
      <div class="kbw-msg ${m.role === "user" ? "kbw-msg-user" : "kbw-msg-ai"}">
        ${m.content}
        ${
          m.sources && m.sources.length > 0
            ? `
          <div class="kbw-sources">
            ${m.sources.map((s: string) => `<span class="kbw-source-tag">${s}</span>`).join("")}
          </div>
        `
            : ""
        }
      </div>
    `,
      )
      .join("");

    body.scrollTop = body.scrollHeight;
  }
}

// Global exposure
(window as any).KembangAI = {
  init: (config: WidgetConfig) => new KembangWidget(config),
  version: WIDGET_VERSION,
  getVersion: () => WIDGET_VERSION,
};

// Auto-initialize if KembangConfig exists
if ((window as any).KembangConfig) {
  console.log('🌸 Auto-initializing widget from KembangConfig...');
  setTimeout(() => {
    (window as any).KembangAI.init((window as any).KembangConfig);
  }, 100);
}
