"use client"

import { Loader2 } from "lucide-react"

export function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="bg-secondary rounded-2xl px-4 py-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin" />
          Thinking...
        </div>
      </div>
    </div>
  )
}
