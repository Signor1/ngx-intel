"use client"

import Link from "next/link"

interface SectorData {
  name: string
  sector: string
  change: number
  stockCount: number
}

interface SectorHeatmapProps {
  sectors: SectorData[]
}

export function SectorHeatmap({ sectors }: SectorHeatmapProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {sectors.map((s) => (
        <Link
          key={s.sector}
          href={`/dashboard/sectors/${s.sector}`}
          className={`flex flex-col gap-1 rounded-xl px-4 py-3 border transition-colors hover:opacity-90 ${
            s.stockCount > 10
              ? "basis-[calc(50%-4px)] sm:basis-[calc(33%-4px)]"
              : "basis-[calc(33%-4px)] sm:basis-[calc(25%-4px)]"
          } ${
            s.change > 0
              ? "bg-gain/10 border-gain/20"
              : s.change < 0
              ? "bg-loss/10 border-loss/20"
              : "bg-secondary border-border"
          }`}
        >
          <span className="text-xs font-medium truncate">{s.name}</span>
          <span
            className={`text-sm font-mono font-semibold ${
              s.change > 0 ? "text-gain" : s.change < 0 ? "text-loss" : "text-muted-foreground"
            }`}
          >
            {s.change > 0 ? "+" : ""}
            {s.change.toFixed(2)}%
          </span>
          <span className="text-[10px] text-muted-foreground font-mono">{s.stockCount} stocks</span>
        </Link>
      ))}
    </div>
  )
}
