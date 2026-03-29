"use client"

import { useRef } from "react"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ChatInputProps {
  value: string
  onChange: (value: string) => void
  onSend: () => void
  disabled?: boolean
}

export function ChatInput({ value, onChange, onSend, disabled }: ChatInputProps) {
  const ref = useRef<HTMLTextAreaElement>(null)

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      onSend()
    }
  }

  return (
    <div className="flex gap-2">
      <textarea
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask about Nigerian stocks, dividends, sectors..."
        rows={1}
        className="flex-1 resize-none rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 max-h-32"
        disabled={disabled}
      />
      <Button
        onClick={onSend}
        disabled={!value.trim() || disabled}
        className="bg-brand hover:bg-brand-dark text-white rounded-xl px-4 self-end"
      >
        <Send className="w-4 h-4" />
      </Button>
    </div>
  )
}
