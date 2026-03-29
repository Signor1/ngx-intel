"use client"

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import type { PricePoint } from "@/types/market"

interface ASIChartProps {
  data: { date: string; value: number }[]
  height?: number
}

export function ASIChart({ data, height = 250 }: ASIChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center text-sm text-muted-foreground" style={{ height }}>
        No chart data available
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="asiGradient" x1="0" y1="0" x2="0" y2="1">
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
          tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
          domain={["auto", "auto"]}
        />
        <Tooltip
          contentStyle={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: 8,
            fontSize: 12,
          }}
          formatter={(value) => [Number(value).toLocaleString(), "ASI"]}
          labelFormatter={(v) => new Date(v).toLocaleDateString("en-NG", { weekday: "short", month: "short", day: "numeric" })}
        />
        <Area type="monotone" dataKey="value" stroke="var(--color-brand)" fill="url(#asiGradient)" strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  )
}
