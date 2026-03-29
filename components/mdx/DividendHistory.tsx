"use client"

import { useEffect, useState } from "react"
import type { DividendRecord } from "@/types/market"

interface DividendHistoryProps {
  ticker: string
}

export function DividendHistory({ ticker }: DividendHistoryProps) {
  const [dividends, setDividends] = useState<DividendRecord[]>([])

  useEffect(() => {
    fetch(`/api/dividends?ticker=${ticker}`)
      .then((r) => r.json())
      .then(setDividends)
      .catch(() => {})
  }, [ticker])

  if (dividends.length === 0) {
    return <p className="text-sm text-muted-foreground not-prose">No dividend data for {ticker}</p>
  }

  return (
    <div className="overflow-x-auto not-prose my-4">
      <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-secondary">
            <th className="text-left text-xs font-mono px-3 py-2">Year</th>
            <th className="text-right text-xs font-mono px-3 py-2">₦/Share</th>
            <th className="text-right text-xs font-mono px-3 py-2">Ex-Date</th>
          </tr>
        </thead>
        <tbody>
          {dividends.slice(0, 5).map((d, i) => (
            <tr key={i} className="border-t border-border">
              <td className="px-3 py-2 font-mono">{d.financialYear}</td>
              <td className="px-3 py-2 text-right font-mono font-semibold">
                {d.dividendPerShare.toFixed(2)}
              </td>
              <td className="px-3 py-2 text-right font-mono text-muted-foreground text-xs">
                {new Date(d.exDividendDate).toLocaleDateString("en-NG", { month: "short", year: "numeric" })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
