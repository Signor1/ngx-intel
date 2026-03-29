"use client"

import { useState } from "react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import type { PricePoint } from "@/types/market"

const PERIODS = [
  { label: "1M", days: 30 },
  { label: "3M", days: 90 },
  { label: "6M", days: 180 },
  { label: "1Y", days: 365 },
] as const

interface PriceChartProps {
  data: PricePoint[]
  height?: number
}

export function PriceChart({ data, height = 300 }: PriceChartProps) {
  const [period, setPeriod] = useState(90)

  const chartData = data.slice(-period).map((p) => ({
    date: p.date,
    price: p.close,
  }))

  return (
    <div>
      <div className="flex justify-end gap-1 mb-4">
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
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={height}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
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
              contentStyle={{
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                borderRadius: 8,
                fontSize: 12,
              }}
              formatter={(value) => [`₦${Number(value).toLocaleString("en-NG", { minimumFractionDigits: 2 })}`, "Price"]}
              labelFormatter={(v) => new Date(v).toLocaleDateString("en-NG", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}
            />
            <Area type="monotone" dataKey="price" stroke="var(--color-brand)" fill="url(#priceGradient)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center text-sm text-muted-foreground" style={{ height }}>
          No price history available
        </div>
      )}
    </div>
  )
}
