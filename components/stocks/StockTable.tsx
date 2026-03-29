"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import type { Stock } from "@/types/market"

interface StockTableProps {
  stocks: Stock[]
  showSector?: boolean
}

export function StockTable({ stocks, showSector = true }: StockTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left text-xs font-mono text-muted-foreground px-4 py-3">TICKER</th>
            {showSector && (
              <th className="text-left text-xs font-mono text-muted-foreground px-4 py-3 hidden sm:table-cell">SECTOR</th>
            )}
            <th className="text-right text-xs font-mono text-muted-foreground px-4 py-3">PRICE (₦)</th>
            <th className="text-right text-xs font-mono text-muted-foreground px-4 py-3">CHANGE</th>
            <th className="text-right text-xs font-mono text-muted-foreground px-4 py-3 hidden md:table-cell">VOLUME</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((s) => (
            <tr key={s.ticker} className="border-b border-border/50 last:border-0 hover:bg-secondary/30 transition-colors">
              <td className="px-4 py-3">
                <Link href={`/dashboard/stocks/${s.ticker}`} className="hover:underline">
                  <span className="font-mono font-semibold text-xs">{s.ticker}</span>
                  <span className="block text-xs text-muted-foreground truncate max-w-[180px]">{s.name}</span>
                </Link>
              </td>
              {showSector && (
                <td className="px-4 py-3 hidden sm:table-cell">
                  <Badge variant="secondary" className="text-[9px] font-mono">{s.sector}</Badge>
                </td>
              )}
              <td className="px-4 py-3 text-right font-mono">
                {s.price.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
              </td>
              <td className={`px-4 py-3 text-right font-mono font-semibold ${
                s.priceChangePercent > 0 ? "text-gain" : s.priceChangePercent < 0 ? "text-loss" : "text-muted-foreground"
              }`}>
                {s.priceChangePercent > 0 ? "+" : ""}{s.priceChangePercent.toFixed(2)}%
              </td>
              <td className="px-4 py-3 text-right font-mono hidden md:table-cell">
                {s.volume ? s.volume.toLocaleString() : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
