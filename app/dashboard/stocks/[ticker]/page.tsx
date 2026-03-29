"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ArrowUpRight, ArrowDownRight, Star, ExternalLink } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { StockDetail } from "@/types/market"
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area,
} from "recharts"

const PERIODS = [
  { label: "1M", days: 30 },
  { label: "3M", days: 90 },
  { label: "6M", days: 180 },
  { label: "1Y", days: 365 },
] as const

export default function StockDetailPage() {
  const { ticker } = useParams<{ ticker: string }>()
  const [stock, setStock] = useState<StockDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [period, setPeriod] = useState(90)

  useEffect(() => {
    if (!ticker) return
    fetch(`/api/stocks/${ticker}`)
      .then((r) => {
        if (!r.ok) throw new Error("Not found")
        return r.json()
      })
      .then((data) => {
        setStock(data)
        setLoading(false)
      })
      .catch(() => {
        setError(true)
        setLoading(false)
      })
  }, [ticker])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand" />
      </div>
    )
  }

  if (error || !stock) {
    return (
      <div className="text-center py-20">
        <p className="text-lg font-medium mb-2">Stock not found</p>
        <p className="text-sm text-muted-foreground mb-4">
          &quot;{ticker}&quot; is not available in our database.
        </p>
        <Link href="/dashboard/stocks">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Screener
          </Button>
        </Link>
      </div>
    )
  }

  const isUp = stock.priceChange >= 0
  const chartData = stock.priceHistory
    .slice(-period)
    .map((p) => ({ date: p.date, price: p.close, volume: p.volume }))

  const week52Range = stock.weekHigh52 - stock.weekLow52
  const week52Progress = week52Range > 0
    ? ((stock.price - stock.weekLow52) / week52Range) * 100
    : 50

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Back link */}
      <Link
        href="/dashboard/stocks"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Screener
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-semibold">{stock.name}</h1>
            <button className="text-muted-foreground hover:text-brand transition-colors">
              <Star className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm text-muted-foreground">{stock.ticker}</span>
            <Badge variant="secondary" className="text-[10px] font-mono">{stock.sector}</Badge>
            <Badge variant="outline" className="text-[10px] font-mono">{stock.board}</Badge>
          </div>
        </div>
        <div className="text-right">
          <p className="text-3xl font-semibold font-mono">
            ₦{stock.price.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
          </p>
          <div className="flex items-center justify-end gap-1 mt-1">
            {isUp ? (
              <ArrowUpRight className="w-4 h-4 text-gain" />
            ) : (
              <ArrowDownRight className="w-4 h-4 text-loss" />
            )}
            <span className={`font-mono text-sm font-semibold ${isUp ? "text-gain" : "text-loss"}`}>
              ₦{Math.abs(stock.priceChange).toFixed(2)} ({isUp ? "+" : ""}{stock.priceChangePercent.toFixed(2)}%)
            </span>
          </div>
        </div>
      </div>

      {/* 52-Week Range */}
      <Card className="p-4">
        <div className="flex items-center justify-between text-xs font-mono text-muted-foreground mb-2">
          <span>52W Low: ₦{stock.weekLow52.toLocaleString()}</span>
          <span>52-Week Range</span>
          <span>52W High: ₦{stock.weekHigh52.toLocaleString()}</span>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-brand rounded-full transition-all"
            style={{ width: `${Math.min(100, Math.max(0, week52Progress))}%` }}
          />
        </div>
      </Card>

      {/* Price Chart */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Price History</h2>
          <div className="flex gap-1">
            {PERIODS.map((p) => (
              <button
                key={p.label}
                onClick={() => setPeriod(p.days)}
                className={`px-3 py-1 text-xs font-mono rounded-md transition-colors ${
                  period === p.days
                    ? "bg-brand text-white"
                    : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-brand)" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="var(--color-brand)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: "var(--color-text-secondary)" }}
                tickFormatter={(v) => new Date(v).toLocaleDateString("en-NG", { month: "short", day: "numeric" })}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "var(--color-text-secondary)" }}
                tickFormatter={(v) => `₦${v}`}
                domain={["auto", "auto"]}
              />
              <Tooltip
                contentStyle={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }}
                labelFormatter={(v) => new Date(v).toLocaleDateString("en-NG", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}
                formatter={(value) => [`₦${Number(value).toLocaleString("en-NG", { minimumFractionDigits: 2 })}`, "Price"]}
              />
              <Area type="monotone" dataKey="price" stroke="var(--color-brand)" fill="url(#priceGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-[300px] text-muted-foreground text-sm">
            No price history available
          </div>
        )}
      </Card>

      {/* Key Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: "P/E Ratio", value: stock.pe ? stock.pe.toFixed(1) : "—" },
          { label: "EPS", value: stock.eps ? `₦${stock.eps.toFixed(2)}` : "—" },
          { label: "Market Cap", value: stock.marketCap ? `₦${(stock.marketCap / 1e9).toFixed(1)}B` : "—" },
          { label: "Div Yield", value: stock.dividendYield ? `${stock.dividendYield.toFixed(1)}%` : "—" },
          { label: "Volume", value: stock.volume ? stock.volume.toLocaleString() : "—" },
          { label: "Board", value: stock.board },
        ].map(({ label, value }) => (
          <Card key={label} className="p-4">
            <p className="text-xs font-mono text-muted-foreground mb-1">{label}</p>
            <p className="text-lg font-semibold font-mono">{value}</p>
          </Card>
        ))}
      </div>

      {/* Company Description */}
      {stock.description && (
        <Card className="p-5">
          <h2 className="font-semibold mb-3">About {stock.name}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">{stock.description}</p>
          {stock.website && (
            <a
              href={stock.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-brand hover:underline mt-3"
            >
              Visit website <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </Card>
      )}

      {/* Dividend History */}
      {stock.dividendHistory.length > 0 && (
        <Card className="p-5">
          <h2 className="font-semibold mb-4">Dividend History</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs font-mono text-muted-foreground px-3 py-2">YEAR</th>
                  <th className="text-left text-xs font-mono text-muted-foreground px-3 py-2">TYPE</th>
                  <th className="text-right text-xs font-mono text-muted-foreground px-3 py-2">PER SHARE (₦)</th>
                  <th className="text-right text-xs font-mono text-muted-foreground px-3 py-2">EX-DATE</th>
                </tr>
              </thead>
              <tbody>
                {stock.dividendHistory.map((d, i) => (
                  <tr key={i} className="border-b border-border/50 last:border-0">
                    <td className="px-3 py-2 font-mono">{d.financialYear}</td>
                    <td className="px-3 py-2">
                      <Badge variant="secondary" className="text-[10px]">{d.type}</Badge>
                    </td>
                    <td className="px-3 py-2 text-right font-mono font-semibold">
                      {d.dividendPerShare.toFixed(2)}
                    </td>
                    <td className="px-3 py-2 text-right font-mono text-muted-foreground">
                      {new Date(d.exDividendDate).toLocaleDateString("en-NG", { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  )
}
