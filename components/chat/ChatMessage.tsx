"use client"

import { useState } from "react"
import { Copy, Check } from "lucide-react"
import type { ChatMessage as ChatMessageType } from "@/lib/ai/chat"

interface ChatMessageProps {
  message: ChatMessageType
}

export function ChatMessage({ message }: ChatMessageProps) {
  const [copied, setCopied] = useState(false)
  const isUser = message.role === "user"

  function handleCopy() {
    navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          isUser ? "bg-brand text-white" : "bg-secondary"
        }`}
      >
        <div className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</div>
        {!isUser && message.content && (
          <button
            onClick={handleCopy}
            className="mt-2 text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
          >
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            {copied ? "Copied" : "Copy"}
          </button>
        )}
      </div>
    </div>
  )
}
