"use client"

import { useState } from "react"
import { Key, AlertTriangle, Brain } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface ApiKeySetupProps {
  onSubmit: (key: string) => void
}

export function ApiKeySetup({ onSubmit }: ApiKeySetupProps) {
  const [keyInput, setKeyInput] = useState("")
  const [error, setError] = useState<string | null>(null)

  function handleSubmit() {
    const trimmed = keyInput.trim()
    if (!trimmed.startsWith("sk-")) {
      setError("API key should start with 'sk-'")
      return
    }
    onSubmit(trimmed)
  }

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
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
          {error && (
            <p className="text-xs text-loss flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              {error}
            </p>
          )}
          <Button onClick={handleSubmit} className="w-full bg-brand hover:bg-brand-dark text-white">
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
