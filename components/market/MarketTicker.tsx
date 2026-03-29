"use client"

import { ArrowUpRight, ArrowDownRight } from "lucide-react"

interface TickerItem {
  ticker: string
  price: number
  changePercent: number
}

interface MarketTickerProps {
  items: TickerItem[]
}

export function MarketTicker({ items }: MarketTickerProps) {
  if (items.length === 0) return null

  // Duplicate for seamless scroll
  const doubled = [...items, ...items]

  return (
    <div className="overflow-hidden bg-secondary/50 border-y border-border">
      <div className="flex animate-[scroll_30s_linear_infinite] hover:[animation-play-state:paused]">
        {doubled.map((item, i) => {
          const isUp = item.changePercent >= 0
          return (
            <div
              key={`${item.ticker}-${i}`}
              className="flex items-center gap-2 px-4 py-2 shrink-0"
            >
              <span className="font-mono text-xs font-semibold">{item.ticker}</span>
              <span className="font-mono text-xs">₦{item.price.toLocaleString()}</span>
              <span className={`flex items-center gap-0.5 text-xs font-mono ${isUp ? "text-gain" : "text-loss"}`}>
                {isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {isUp ? "+" : ""}{item.changePercent.toFixed(2)}%
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
