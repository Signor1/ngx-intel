import Link from "next/link"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface StockCardProps {
  ticker: string
  name: string
  sector: string
  price: number
  changePercent: number
  compact?: boolean
}

export function StockCard({ ticker, name, sector, price, changePercent, compact }: StockCardProps) {
  const isUp = changePercent >= 0

  if (compact) {
    return (
      <Link href={`/dashboard/stocks/${ticker}`} className="inline-block">
        <span className="inline-flex items-center gap-1.5 bg-secondary/50 rounded-lg px-3 py-1.5 hover:bg-secondary transition-colors">
          <span className="font-mono text-xs font-semibold text-brand">{ticker}</span>
          <span className="font-mono text-xs">₦{price.toLocaleString()}</span>
          <span className={`font-mono text-xs ${isUp ? "text-gain" : "text-loss"}`}>
            {isUp ? "+" : ""}{changePercent.toFixed(2)}%
          </span>
        </span>
      </Link>
    )
  }

  return (
    <Link href={`/dashboard/stocks/${ticker}`}>
      <Card className="p-4 hover:border-brand/50 transition-colors">
        <div className="flex items-start justify-between mb-2">
          <div>
            <p className="font-mono font-semibold text-sm text-brand">{ticker}</p>
            <p className="text-xs text-muted-foreground truncate max-w-[160px]">{name}</p>
          </div>
          <Badge variant="secondary" className="text-[9px] font-mono">{sector}</Badge>
        </div>
        <div className="flex items-end justify-between">
          <p className="font-mono text-lg font-semibold">
            ₦{price.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
          </p>
          <div className="flex items-center gap-0.5">
            {isUp ? (
              <ArrowUpRight className="w-3.5 h-3.5 text-gain" />
            ) : (
              <ArrowDownRight className="w-3.5 h-3.5 text-loss" />
            )}
            <span className={`font-mono text-sm font-semibold ${isUp ? "text-gain" : "text-loss"}`}>
              {isUp ? "+" : ""}{changePercent.toFixed(2)}%
            </span>
          </div>
        </div>
      </Card>
    </Link>
  )
}
