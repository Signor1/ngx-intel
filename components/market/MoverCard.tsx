import Link from "next/link"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"

interface MoverCardProps {
  ticker: string
  name: string
  price: number
  change: number
  changePercent: number
}

export function MoverCard({ ticker, name, price, change, changePercent }: MoverCardProps) {
  const isUp = change >= 0

  return (
    <Link
      href={`/dashboard/stocks/${ticker}`}
      className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-secondary/50 transition-colors"
    >
      <div className="min-w-0">
        <p className="font-mono font-semibold text-xs">{ticker}</p>
        <p className="text-xs text-muted-foreground truncate max-w-[140px]">{name}</p>
      </div>
      <div className="text-right shrink-0">
        <p className="font-mono text-sm">₦{price.toLocaleString("en-NG", { minimumFractionDigits: 2 })}</p>
        <div className="flex items-center justify-end gap-0.5">
          {isUp ? (
            <ArrowUpRight className="w-3 h-3 text-gain" />
          ) : (
            <ArrowDownRight className="w-3 h-3 text-loss" />
          )}
          <span className={`text-xs font-mono font-semibold ${isUp ? "text-gain" : "text-loss"}`}>
            {changePercent > 0 ? "+" : ""}{changePercent.toFixed(2)}%
          </span>
        </div>
      </div>
    </Link>
  )
}
