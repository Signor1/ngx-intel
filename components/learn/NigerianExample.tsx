import { Card } from "@/components/ui/card"

interface NigerianExampleProps {
  children: React.ReactNode
}

export function NigerianExample({ children }: NigerianExampleProps) {
  return (
    <Card className="p-4 bg-secondary border-brand/10 not-prose my-4">
      <p className="text-xs font-mono text-brand mb-1">Nigerian Example</p>
      <div className="text-sm text-foreground">{children}</div>
    </Card>
  )
}
