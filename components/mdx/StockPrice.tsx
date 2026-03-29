"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"

interface StockPriceProps {
  ticker: string
}

export function StockPrice({ ticker }: StockPriceProps) {
  const [data, setData] = useState<{ price: number; changePercent: number } | null>(null)

  useEffect(() => {
    fetch(`/api/stocks/${ticker}`)
      .then((r) => r.ok ? r.json() : null)
      .then((d) => d && setData({ price: d.price, changePercent: d.priceChangePercent }))
      .catch(() => {})
  }, [ticker])

  if (!data) {
    return (
      <Link href={`/dashboard/stocks/${ticker}`} className="font-mono text-brand hover:underline">
        {ticker}
      </Link>
    )
  }

  const isUp = data.changePercent >= 0

  return (
    <Link
      href={`/dashboard/stocks/${ticker}`}
      className="inline-flex items-center gap-1.5 bg-secondary/50 rounded px-2 py-0.5 hover:bg-secondary transition-colors not-prose"
    >
      <span className="font-mono text-xs font-semibold text-brand">{ticker}</span>
      <span className="font-mono text-xs">₦{data.price.toLocaleString()}</span>
      <span className={`inline-flex items-center gap-0.5 font-mono text-xs ${isUp ? "text-gain" : "text-loss"}`}>
        {isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
        {isUp ? "+" : ""}{data.changePercent.toFixed(2)}%
      </span>
    </Link>
  )
}
