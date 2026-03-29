"use client"

import { useEffect, useState, useMemo } from "react"
import Link from "next/link"
import { Calendar, Trophy, List, ChevronLeft, ChevronRight } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { DividendRecord, NGXSector } from "@/types/market"

const SECTOR_OPTIONS: { value: NGXSector | "all"; label: string }[] = [
  { value: "all", label: "All Sectors" },
  { value: "banking", label: "Banking" },
  { value: "consumer-goods", label: "Consumer Goods" },
  { value: "oil-gas", label: "Oil & Gas" },
  { value: "industrial-goods", label: "Industrial Goods" },
  { value: "insurance", label: "Insurance" },
  { value: "agriculture", label: "Agriculture" },
  { value: "ict", label: "ICT" },
]

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const PAGE_SIZE = 20

export default function DividendsPage() {
  const [dividends, setDividends] = useState<DividendRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [sectorFilter, setSectorFilter] = useState<NGXSector | "all">("all")
  const [yearFilter, setYearFilter] = useState<number | "all">("all")
  const [page, setPage] = useState(1)

  useEffect(() => {
    fetch("/api/dividends")
      .then((r) => r.json())
      .then((data) => { setDividends(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => { setPage(1) }, [sectorFilter, yearFilter])

  const filtered = useMemo(() => {
    let result = [...dividends]
    if (sectorFilter !== "all") result = result.filter((d) => d.sector === sectorFilter)
    if (yearFilter !== "all") result = result.filter((d) => d.financialYear === yearFilter)
    return result
  }, [dividends, sectorFilter, yearFilter])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const years = useMemo(() => [...new Set(dividends.map((d) => d.financialYear))].sort((a, b) => b - a), [dividends])

  const calendarData = useMemo(() => {
    const byMonth: Record<string, DividendRecord[]> = {}
    for (const d of filtered) {
      const date = new Date(d.exDividendDate)
      const key = `${date.getFullYear()}-${String(date.getMonth()).padStart(2, "0")}`
      if (!byMonth[key]) byMonth[key] = []
      byMonth[key].push(d)
    }
    return byMonth
  }, [filtered])

  const champions = useMemo(() => {
    const latest = new Map<string, DividendRecord>()
    for (const d of dividends) {
      const existing = latest.get(d.ticker)
      if (!existing || d.exDividendDate > existing.exDividendDate) latest.set(d.ticker, d)
    }
    return [...latest.values()].filter((d) => d.dividendYield > 0).sort((a, b) => b.dividendYield - a.dividendYield).slice(0, 20)
  }, [dividends])

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand" /></div>
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-semibold">Dividend Tracker</h1>
        <p className="text-muted-foreground mt-1">
          Track ex-dividend dates, yields, and payouts across {dividends.length} records
        </p>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all" className="gap-2"><List className="w-4 h-4" /> All Dividends</TabsTrigger>
          <TabsTrigger value="calendar" className="gap-2"><Calendar className="w-4 h-4" /> Calendar</TabsTrigger>
          <TabsTrigger value="champions" className="gap-2"><Trophy className="w-4 h-4" /> Champions</TabsTrigger>
        </TabsList>

        {/* Tab 1: All Dividends */}
        <TabsContent value="all" className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <select value={sectorFilter} onChange={(e) => setSectorFilter(e.target.value as NGXSector | "all")} className="h-9 rounded-md border border-input bg-background px-3 text-sm">
              {SECTOR_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
            <select value={yearFilter} onChange={(e) => setYearFilter(e.target.value === "all" ? "all" : Number(e.target.value))} className="h-9 rounded-md border border-input bg-background px-3 text-sm">
              <option value="all">All Years</option>
              {years.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>

          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-xs text-muted-foreground px-4 py-3 font-medium">COMPANY</th>
                    <th className="text-left text-xs text-muted-foreground px-4 py-3 font-medium hidden sm:table-cell">SECTOR</th>
                    <th className="text-right text-xs text-muted-foreground px-4 py-3 font-medium">₦/SHARE</th>
                    <th className="text-right text-xs text-muted-foreground px-4 py-3 font-medium">YIELD</th>
                    <th className="text-right text-xs text-muted-foreground px-4 py-3 font-medium">EX-DATE</th>
                    <th className="text-center text-xs text-muted-foreground px-4 py-3 font-medium hidden md:table-cell">TYPE</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((d, i) => (
                    <tr key={`${d.ticker}-${d.exDividendDate}-${i}`} className="border-b border-border/50 last:border-0 hover:bg-secondary/30 transition-colors">
                      <td className="px-4 py-3.5">
                        <Link href={`/dashboard/stocks/${d.ticker}`} className="hover:underline">
                          <span className="font-mono font-semibold text-sm text-brand">{d.ticker}</span>
                          <span className="block text-sm text-muted-foreground truncate max-w-[180px]">{d.companyName}</span>
                        </Link>
                      </td>
                      <td className="px-4 py-3.5 hidden sm:table-cell">
                        <Badge variant="secondary" className="text-xs">{d.sector}</Badge>
                      </td>
                      <td className="px-4 py-3.5 text-right font-mono text-sm font-semibold">{d.dividendPerShare.toFixed(2)}</td>
                      <td className="px-4 py-3.5 text-right font-mono text-sm text-gain font-semibold">{d.dividendYield > 0 ? `${d.dividendYield.toFixed(1)}%` : "—"}</td>
                      <td className="px-4 py-3.5 text-right text-sm text-muted-foreground">
                        {new Date(d.exDividendDate).toLocaleDateString("en-NG", { month: "short", day: "numeric", year: "numeric" })}
                      </td>
                      <td className="px-4 py-3.5 text-center hidden md:table-cell">
                        <Badge variant="outline" className="text-xs">{d.type}</Badge>
                      </td>
                    </tr>
                  ))}
                  {paginated.length === 0 && (
                    <tr><td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">No dividend records found</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
                </p>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)}>
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let pageNum: number
                    if (totalPages <= 5) pageNum = i + 1
                    else if (page <= 3) pageNum = i + 1
                    else if (page >= totalPages - 2) pageNum = totalPages - 4 + i
                    else pageNum = page - 2 + i
                    return (
                      <Button key={pageNum} variant={page === pageNum ? "default" : "outline"} size="sm" className="w-9 h-9" onClick={() => setPage(pageNum)}>
                        {pageNum}
                      </Button>
                    )
                  })}
                  <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(page + 1)}>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </TabsContent>

        {/* Tab 2: Calendar */}
        <TabsContent value="calendar" className="space-y-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(calendarData).sort(([a], [b]) => a.localeCompare(b)).map(([monthKey, divs]) => {
              const [year, month] = monthKey.split("-")
              return (
                <Card key={monthKey} className="p-4">
                  <h3 className="font-semibold mb-3">{MONTHS[parseInt(month)]} {year}</h3>
                  <div className="space-y-2">
                    {divs.map((d, i) => (
                      <div key={`${d.ticker}-${i}`} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${d.sector === "banking" ? "bg-blue-500" : d.sector === "consumer-goods" ? "bg-orange-500" : d.sector === "oil-gas" ? "bg-yellow-500" : "bg-brand"}`} />
                          <Link href={`/dashboard/stocks/${d.ticker}`} className="font-mono font-semibold text-sm hover:underline">{d.ticker}</Link>
                        </div>
                        <div className="text-right">
                          <span className="font-mono text-sm">₦{d.dividendPerShare.toFixed(2)}</span>
                          <span className="text-muted-foreground ml-2 text-sm">{new Date(d.exDividendDate).getDate()}th</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )
            })}
          </div>
          {Object.keys(calendarData).length === 0 && <Card className="p-12 text-center text-muted-foreground">No dividend dates to show</Card>}
        </TabsContent>

        {/* Tab 3: Champions */}
        <TabsContent value="champions" className="space-y-4">
          <p className="text-muted-foreground">Top 20 NGX stocks ranked by most recent dividend yield</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {champions.map((d, rank) => (
              <Card key={d.ticker} className="p-4 relative overflow-hidden">
                {rank < 3 && <div className="absolute top-0 right-0 bg-brand text-white text-xs font-bold px-2 py-0.5 rounded-bl-lg">#{rank + 1}</div>}
                <Link href={`/dashboard/stocks/${d.ticker}`} className="hover:underline">
                  <p className="font-mono font-semibold text-sm text-brand">{d.ticker}</p>
                </Link>
                <p className="text-sm text-muted-foreground truncate mt-0.5">{d.companyName}</p>
                <div className="mt-3 flex items-end justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Yield</p>
                    <p className="text-xl font-semibold font-mono text-gain">{d.dividendYield.toFixed(1)}%</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Per Share</p>
                    <p className="text-sm font-mono font-semibold">₦{d.dividendPerShare.toFixed(2)}</p>
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs mt-2">{d.sector}</Badge>
              </Card>
            ))}
          </div>
          {champions.length === 0 && <Card className="p-12 text-center text-muted-foreground">No dividend data available</Card>}
        </TabsContent>
      </Tabs>
    </div>
  )
}
