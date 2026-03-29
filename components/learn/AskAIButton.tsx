"use client"

import Link from "next/link"
import { Brain } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AskAIButtonProps {
  topic: string
}

export function AskAIButton({ topic }: AskAIButtonProps) {
  return (
    <Link href="/dashboard/chat" className="block not-prose my-4">
      <Button variant="outline" className="w-full gap-2">
        <Brain className="w-4 h-4" />
        Ask AI about &quot;{topic}&quot;
      </Button>
    </Link>
  )
}
