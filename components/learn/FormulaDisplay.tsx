import { Card } from "@/components/ui/card"

interface FormulaDisplayProps {
  formula: string
  label?: string
}

export function FormulaDisplay({ formula, label = "Formula" }: FormulaDisplayProps) {
  return (
    <Card className="p-4 bg-brand/5 border-brand/20 not-prose">
      <p className="text-xs font-mono text-muted-foreground mb-1">{label}</p>
      <p className="font-mono text-sm font-semibold">{formula}</p>
    </Card>
  )
}
