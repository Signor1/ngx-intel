"use client"

import { useRef, useEffect } from "react"
import { ChatMessage } from "./ChatMessage"
import { TypingIndicator } from "./TypingIndicator"
import type { ChatMessage as ChatMessageType } from "@/lib/ai/chat"

interface ChatWindowProps {
  messages: ChatMessageType[]
  isStreaming: boolean
}

export function ChatWindow({ messages, isStreaming }: ChatWindowProps) {
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <div className="flex-1 overflow-y-auto space-y-4">
      {messages.map((msg) => (
        <ChatMessage key={msg.id} message={msg} />
      ))}
      {isStreaming && messages[messages.length - 1]?.content === "" && (
        <TypingIndicator />
      )}
      <div ref={endRef} />
    </div>
  )
}
