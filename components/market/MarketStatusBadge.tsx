"use client"

import { useEffect, useState } from "react"
import { isMarketOpen, getMarketCountdown } from "@/lib/market-hours"

export function MarketStatusBadge() {
  const [open, setOpen] = useState(false)
  const [countdown, setCountdown] = useState({ label: "", minutes: 0 })

  useEffect(() => {
    function update() {
      setOpen(isMarketOpen())
      setCountdown(getMarketCountdown())
    }
    update()
    const interval = setInterval(update, 60_000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div
      className={`inline-flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-full border ${
        open
          ? "bg-gain/10 border-gain/30 text-gain"
          : "bg-muted border-border text-muted-foreground"
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${open ? "bg-gain animate-pulse" : "bg-muted-foreground"}`} />
      {open ? "MARKET OPEN" : "MARKET CLOSED"}
      {countdown.minutes > 0 && (
        <span className="text-[10px] opacity-70">
          ({countdown.label} {countdown.minutes}m)
        </span>
      )}
    </div>
  )
}
