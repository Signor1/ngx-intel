import { Card } from "@/components/ui/card"
import { Lightbulb } from "lucide-react"

interface KeyTakeawayProps {
  children: React.ReactNode
}

export function KeyTakeaway({ children }: KeyTakeawayProps) {
  return (
    <Card className="p-4 bg-yellow-500/5 border-yellow-500/20 not-prose my-4">
      <div className="flex gap-3">
        <Lightbulb className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
        <div className="text-sm">{children}</div>
      </div>
    </Card>
  )
}
