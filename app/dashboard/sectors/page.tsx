"use client"

import { useEffect, useState, useMemo } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Stock, NGXSector } from "@/types/market"

const SECTOR_META: Record<NGXSector, { label: string; color: string; icon: string }> = {
  banking: { label: "Banking", color: "bg-blue-500", icon: "🏦" },
  "consumer-goods": { label: "Consumer Goods", color: "bg-orange-500", icon: "🛒" },
  "industrial-goods": { label: "Industrial Goods", color: "bg-slate-500", icon: "🏭" },
  "oil-gas": { label: "Oil & Gas", color: "bg-yellow-600", icon: "⛽" },
  insurance: { label: "Insurance", color: "bg-purple-500", icon: "🛡️" },
  agriculture: { label: "Agriculture", color: "bg-green-600", icon: "🌾" },
  healthcare: { label: "Healthcare", color: "bg-red-500", icon: "🏥" },
  ict: { label: "ICT", color: "bg-cyan-500", icon: "📡" },
  "real-estate": { label: "Real Estate", color: "bg-amber-600", icon: "🏠" },
  conglomerates: { label: "Conglomerates", color: "bg-indigo-500", icon: "🏢" },
  services: { label: "Services", color: "bg-teal-500", icon: "⚙️" },
}

interface SectorSummary {
  sector: NGXSector
  label: string
  color: string
  icon: string
  stockCount: number
  totalVolume: number
  avgChange: number
  topStock: { ticker: string; price: number; changePercent: number } | null
}

export default function SectorsPage() {
  const [stocks, setStocks] = useState<Stock[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/stocks")
      .then((r) => r.json())
      .then((data) => {
        setStocks(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const sectors = useMemo((): SectorSummary[] => {
    const map = new Map<NGXSector, Stock[]>()
    for (const s of stocks) {
      const list = map.get(s.sector) || []
      list.push(s)
      map.set(s.sector, list)
    }

    return (Object.keys(SECTOR_META) as NGXSector[]).map((sector) => {
      const meta = SECTOR_META[sector]
      const sectorStocks = map.get(sector) || []
      const totalVolume = sectorStocks.reduce((sum, s) => sum + (s.volume || 0), 0)
      const avgChange = sectorStocks.length > 0
        ? sectorStocks.reduce((sum, s) => sum + s.priceChangePercent, 0) / sectorStocks.length
        : 0
      const topStock = sectorStocks.length > 0
        ? sectorStocks.sort((a, b) => (b.volume || 0) - (a.volume || 0))[0]
        : null

      return {
        sector,
        label: meta.label,
        color: meta.color,
        icon: meta.icon,
        stockCount: sectorStocks.length,
        totalVolume,
        avgChange: Math.round(avgChange * 100) / 100,
        topStock: topStock
          ? { ticker: topStock.ticker, price: topStock.price, changePercent: topStock.priceChangePercent }
          : null,
      }
    }).sort((a, b) => b.totalVolume - a.totalVolume)
  }, [stocks])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-semibold">NGX Sectors</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Overview of all 11 sectors on the Nigerian Exchange
        </p>
      </div>

      {/* Heatmap overview */}
      <Card className="p-5">
        <h2 className="font-semibold mb-4">Sector Heatmap — Today</h2>
        <div className="flex flex-wrap gap-2">
          {sectors.map((s) => (
            <Link
              key={s.sector}
              href={`/dashboard/sectors/${s.sector}`}
              className={`flex flex-col gap-1 rounded-xl px-4 py-3 border transition-colors hover:opacity-90 ${
                s.stockCount > 10 ? "basis-[calc(50%-4px)] sm:basis-[calc(33%-4px)]" : "basis-[calc(33%-4px)] sm:basis-[calc(25%-4px)]"
              } ${
                s.avgChange > 0
                  ? "bg-gain/10 border-gain/20"
                  : s.avgChange < 0
                  ? "bg-loss/10 border-loss/20"
                  : "bg-secondary border-border"
              }`}
            >
              <span className="text-xs font-medium">{s.icon} {s.label}</span>
              <span className={`text-sm font-mono font-semibold ${
                s.avgChange > 0 ? "text-gain" : s.avgChange < 0 ? "text-loss" : "text-muted-foreground"
              }`}>
                {s.avgChange > 0 ? "+" : ""}{s.avgChange.toFixed(2)}%
              </span>
              <span className="text-[10px] text-muted-foreground font-mono">{s.stockCount} stocks</span>
            </Link>
          ))}
        </div>
      </Card>

      {/* Sector cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sectors.map((s) => (
          <Link key={s.sector} href={`/dashboard/sectors/${s.sector}`}>
            <Card className="p-5 hover:border-brand/50 transition-colors h-full">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-lg ${s.color} flex items-center justify-center text-lg`}>
                  {s.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{s.label}</h3>
                  <span className="text-xs text-muted-foreground font-mono">{s.stockCount} companies</span>
                </div>
              </div>

              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-xs text-muted-foreground">Avg. Change</p>
                  <p className={`text-lg font-semibold font-mono ${
                    s.avgChange > 0 ? "text-gain" : s.avgChange < 0 ? "text-loss" : "text-muted-foreground"
                  }`}>
                    {s.avgChange > 0 ? "+" : ""}{s.avgChange.toFixed(2)}%
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Volume</p>
                  <p className="text-sm font-mono">{s.totalVolume > 1e6 ? `${(s.totalVolume / 1e6).toFixed(1)}M` : s.totalVolume.toLocaleString()}</p>
                </div>
              </div>

              {s.topStock && (
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <span className="text-xs text-muted-foreground">Top stock</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-[10px] font-mono">{s.topStock.ticker}</Badge>
                    <span className="text-xs font-mono">₦{s.topStock.price.toLocaleString()}</span>
                  </div>
                </div>
              )}
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
