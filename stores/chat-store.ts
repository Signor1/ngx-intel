import { create } from "zustand"
import type { ChatMessage } from "@/lib/ai/chat"

interface ChatStore {
  apiKey: string | null
  messages: ChatMessage[]
  isStreaming: boolean
  model: string
  setApiKey: (key: string) => void
  clearApiKey: () => void
  addMessage: (msg: ChatMessage) => void
  updateLastMessage: (content: string) => void
  clearConversation: () => void
  setStreaming: (val: boolean) => void
  setModel: (model: string) => void
}

/**
 * Zustand store for the AI chat page.
 * API key lives in memory only — never persisted to localStorage or any server.
 */
export const useChatStore = create<ChatStore>((set) => ({
  apiKey: null,
  messages: [],
  isStreaming: false,
  model: "claude-sonnet-4-5",

  setApiKey: (key) => set({ apiKey: key }),
  clearApiKey: () => set({ apiKey: null }),

  addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),

  updateLastMessage: (content) =>
    set((state) => {
      const messages = [...state.messages]
      if (messages.length > 0) {
        messages[messages.length - 1] = { ...messages[messages.length - 1], content }
      }
      return { messages }
    }),

  clearConversation: () => set({ messages: [] }),
  setStreaming: (val) => set({ isStreaming: val }),
  setModel: (model) => set({ model }),
}))
