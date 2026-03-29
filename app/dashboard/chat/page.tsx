"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Trash2, Key, AlertTriangle, Copy, Check, Brain, Loader2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useChatStore } from "@/stores/chat-store"
import { sendMessage, parseSSEStream } from "@/lib/ai/chat"
import type { ChatMessage } from "@/lib/ai/chat"

const SUGGESTED_PROMPTS = [
  {
    category: "Getting Started",
    prompts: [
      "How do I buy my first Nigerian stock?",
      "What is a CSCS account and how do I get one?",
      "How much money do I need to start investing on NGX?",
    ],
  },
  {
    category: "Dividends",
    prompts: [
      "Which NGX stocks have the highest dividend yield right now?",
      "What is an ex-dividend date?",
      "Explain Zenith Bank's dividend history",
    ],
  },
  {
    category: "Analysis",
    prompts: [
      "Compare Zenith Bank and GTCO — which is better?",
      "Is Dangote Cement overvalued?",
      "What are the best blue chip stocks on NGX?",
    ],
  },
  {
    category: "Sectors",
    prompts: [
      "Which NGX sector performed best in 2025?",
      "What drives the banking sector on the NGX?",
      "Is the oil & gas sector a good investment now?",
    ],
  },
]

const MODELS = [
  { id: "claude-sonnet-4-5", label: "Sonnet 4.5", description: "Fast & capable" },
  { id: "claude-haiku-4-5-20251001", label: "Haiku 4.5", description: "Fastest & cheapest" },
]

export default function ChatPage() {
  const {
    apiKey, messages, isStreaming, model,
    setApiKey, addMessage, updateLastMessage, clearConversation, setStreaming, setModel,
  } = useChatStore()

  const [keyInput, setKeyInput] = useState("")
  const [inputValue, setInputValue] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  function handleSetKey() {
    const trimmed = keyInput.trim()
    if (!trimmed.startsWith("sk-")) {
      setError("API key should start with 'sk-'")
      return
    }
    setApiKey(trimmed)
    setKeyInput("")
    setError(null)
  }

  async function handleSend(text?: string) {
    const content = text || inputValue.trim()
    if (!content || isStreaming || !apiKey) return

    setInputValue("")
    setError(null)

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content,
      timestamp: Date.now(),
    }
    addMessage(userMsg)

    const assistantMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: "",
      timestamp: Date.now(),
    }
    addMessage(assistantMsg)
    setStreaming(true)

    try {
      const allMessages = [...messages, userMsg]
      const stream = await sendMessage(allMessages, apiKey, model)
      let fullContent = ""

      for await (const chunk of parseSSEStream(stream)) {
        fullContent += chunk
        updateLastMessage(fullContent)
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "Failed to get response"
      setError(errMsg)
      updateLastMessage("Sorry, I encountered an error. Please try again.")
    } finally {
      setStreaming(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  function copyMessage(id: string, content: string) {
    navigator.clipboard.writeText(content)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  // API Key Setup Screen
  if (!apiKey) {
    return (
      <div className="max-w-lg mx-auto py-12 space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-brand/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Brain className="w-8 h-8 text-brand" />
          </div>
          <h1 className="text-2xl font-semibold mb-2">NGX Intel AI</h1>
          <p className="text-sm text-muted-foreground">
            Your AI assistant for the Nigerian stock market
          </p>
        </div>

        <Card className="p-6 space-y-4">
          <div>
            <h2 className="font-semibold text-sm mb-1">Enter your Claude API key</h2>
            <p className="text-xs text-muted-foreground">
              Your key is stored only in your browser session — we never store it on our servers.
            </p>
          </div>

          <div className="space-y-3">
            <Input
              type="password"
              placeholder="sk-ant-..."
              value={keyInput}
              onChange={(e) => { setKeyInput(e.target.value); setError(null) }}
              onKeyDown={(e) => e.key === "Enter" && handleSetKey()}
            />
            {error && (
              <p className="text-xs text-loss flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                {error}
              </p>
            )}
            <Button onClick={handleSetKey} className="w-full bg-brand hover:bg-brand-dark text-white">
              <Key className="w-4 h-4 mr-2" />
              Start Chatting
            </Button>
          </div>

          <div className="pt-3 border-t border-border">
            <a
              href="https://console.anthropic.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-brand hover:underline"
            >
              Get your API key at console.anthropic.com →
            </a>
          </div>

          <div className="bg-secondary/50 rounded-lg p-3">
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              <strong>Privacy:</strong> Your API key is used directly between your browser and Anthropic.
              It is never sent to our servers, never saved to localStorage, and is cleared when you close this tab.
            </p>
          </div>
        </Card>
      </div>
    )
  }

  // Chat Interface
  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-4xl mx-auto">
      {/* Disclaimer */}
      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg px-4 py-2 mb-4 flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-yellow-600 shrink-0" />
        <p className="text-xs text-yellow-700 dark:text-yellow-400">
          NGX Intel AI provides educational information only. Not financial advice. Verify with a licensed stockbroker.
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.length === 0 ? (
          <div className="space-y-6 py-8">
            <div className="text-center">
              <Brain className="w-10 h-10 text-brand mx-auto mb-3" />
              <h2 className="font-semibold mb-1">Ask me anything about Nigerian stocks</h2>
              <p className="text-sm text-muted-foreground">Pick a suggestion below or type your own question</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {SUGGESTED_PROMPTS.map((group) => (
                <Card key={group.category} className="p-4">
                  <p className="text-xs font-mono text-muted-foreground mb-2">{group.category}</p>
                  <div className="space-y-1.5">
                    {group.prompts.map((prompt) => (
                      <button
                        key={prompt}
                        onClick={() => handleSend(prompt)}
                        className="block w-full text-left text-sm text-foreground hover:text-brand transition-colors py-1"
                      >
                        &quot;{prompt}&quot;
                      </button>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  msg.role === "user"
                    ? "bg-brand text-white"
                    : "bg-secondary"
                }`}
              >
                <div className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</div>
                {msg.role === "assistant" && msg.content && (
                  <button
                    onClick={() => copyMessage(msg.id, msg.content)}
                    className="mt-2 text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
                  >
                    {copiedId === msg.id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {copiedId === msg.id ? "Copied" : "Copy"}
                  </button>
                )}
              </div>
            </div>
          ))
        )}

        {isStreaming && messages[messages.length - 1]?.content === "" && (
          <div className="flex justify-start">
            <div className="bg-secondary rounded-2xl px-4 py-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                Thinking...
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      <div className="border-t border-border pt-4">
        <div className="flex items-center gap-2 mb-2">
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="h-7 rounded-md border border-input bg-background px-2 text-[10px] font-mono"
          >
            {MODELS.map((m) => (
              <option key={m.id} value={m.id}>{m.label} — {m.description}</option>
            ))}
          </select>
          <button
            onClick={clearConversation}
            className="text-xs text-muted-foreground hover:text-loss flex items-center gap-1 ml-auto"
          >
            <Trash2 className="w-3 h-3" />
            Clear
          </button>
        </div>
        <div className="flex gap-2">
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about Nigerian stocks, dividends, sectors..."
            rows={1}
            className="flex-1 resize-none rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 max-h-32"
            disabled={isStreaming}
          />
          <Button
            onClick={() => handleSend()}
            disabled={!inputValue.trim() || isStreaming}
            className="bg-brand hover:bg-brand-dark text-white rounded-xl px-4 self-end"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        {error && (
          <p className="text-xs text-loss mt-2 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            {error}
          </p>
        )}
      </div>
    </div>
  )
}
