import { Info, AlertTriangle, CheckCircle } from "lucide-react"
import { Card } from "@/components/ui/card"

interface CalloutProps {
  type?: "info" | "warning" | "tip"
  children: React.ReactNode
}

const STYLES = {
  info: {
    bg: "bg-blue-500/5 border-blue-500/20",
    icon: Info,
    iconColor: "text-blue-500",
  },
  warning: {
    bg: "bg-yellow-500/5 border-yellow-500/20",
    icon: AlertTriangle,
    iconColor: "text-yellow-600",
  },
  tip: {
    bg: "bg-green-500/5 border-green-500/20",
    icon: CheckCircle,
    iconColor: "text-green-600",
  },
}

export function Callout({ type = "info", children }: CalloutProps) {
  const style = STYLES[type]
  const Icon = style.icon

  return (
    <Card className={`p-4 ${style.bg} not-prose my-4`}>
      <div className="flex gap-3">
        <Icon className={`w-5 h-5 ${style.iconColor} shrink-0 mt-0.5`} />
        <div className="text-sm">{children}</div>
      </div>
    </Card>
  )
}
