import { create } from "zustand";
import api, { ChatResponse } from "@kembang/api-client";

interface Message {
  role: "user" | "assistant";
  content: string;
  sources?: string[];
  timestamp: number;
}

interface ChatState {
  messages: Message[];
  isThinking: boolean;
  conversationId: string | null;
  userIdentifier: string | null;
  error: string | null;

  // Actions
  init: (apiKey: string, userIdentifier?: string) => void;
  sendMessage: (text: string) => Promise<void>;
  reset: () => void;
}

const safeLocalStorage = {
  getItem: (key: string) => {
    if (
      typeof window !== "undefined" &&
      window.localStorage &&
      typeof window.localStorage.getItem === "function"
    ) {
      return window.localStorage.getItem(key);
    }
    return null;
  },
  setItem: (key: string, value: string) => {
    if (
      typeof window !== "undefined" &&
      window.localStorage &&
      typeof window.localStorage.setItem === "function"
    ) {
      window.localStorage.setItem(key, value);
    }
  },
};

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  isThinking: false,
  conversationId: null,
  userIdentifier: null,
  error: null,

  init: (apiKey, userIdentifier) => {
    api.setApiKey(apiKey);
    set({ userIdentifier: userIdentifier || null });
    // Load conversationId from localStorage if available
    const savedId = safeLocalStorage.getItem(`chat_cid_${apiKey}`);
    if (savedId) set({ conversationId: savedId });
  },

  sendMessage: async (text: string) => {
    const { conversationId, userIdentifier, messages } = get();

    const userMsg: Message = {
      role: "user",
      content: text,
      timestamp: Date.now(),
    };

    set({
      messages: [...messages, userMsg],
      isThinking: true,
      error: null,
    });

    try {
      const response: ChatResponse = await api.sendMessage({
        message: text,
        conversation_id: conversationId || undefined,
        user_identifier: userIdentifier || undefined,
      });

      const assistantMsg: Message = {
        role: "assistant",
        content: response.reply,
        sources: response.sources,
        timestamp: Date.now(),
      };

      set((state) => ({
        messages: [...state.messages, assistantMsg],
        isThinking: false,
        conversationId: response.conversation_id,
      }));

      // Save session
      if (response.conversation_id) {
        safeLocalStorage.setItem(`chat_cid_active`, response.conversation_id);
      }
    } catch (err: any) {
      set({
        isThinking: false,
        error: err.response?.data?.detail || "Failed to send message",
      });
    }
  },

  reset: () => set({ messages: [], conversationId: null, error: null }),
}));
