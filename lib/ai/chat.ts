import { NGX_MASTER_SYSTEM_PROMPT } from "./master-prompt"

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: number
}

/**
 * Sends a chat message directly from the browser to the Anthropic API.
 * The user's API key is never sent to our server — all calls go browser → Anthropic.
 */
export async function sendMessage(
  messages: ChatMessage[],
  userApiKey: string,
  model: string = "claude-sonnet-4-5"
): Promise<ReadableStream> {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": userApiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model,
      max_tokens: 1024,
      system: NGX_MASTER_SYSTEM_PROMPT,
      stream: true,
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error?.message ?? "API request failed")
  }

  return response.body!
}

/**
 * Parses the SSE stream from the Anthropic API, yielding text deltas.
 */
export async function* parseSSEStream(stream: ReadableStream): AsyncGenerator<string> {
  const reader = stream.getReader()
  const decoder = new TextDecoder()
  let buffer = ""

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split("\n")
    buffer = lines.pop() ?? ""

    for (const line of lines) {
      if (!line.startsWith("data: ")) continue
      const data = line.slice(6)
      if (data === "[DONE]") return
      try {
        const parsed = JSON.parse(data)
        if (parsed.type === "content_block_delta") {
          yield parsed.delta.text ?? ""
        }
      } catch {}
    }
  }
}
