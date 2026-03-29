"use client"

import { useEffect, useState, useMemo } from "react"
import Link from "next/link"
import { Search, SlidersHorizontal, Star, ArrowUpDown, Download, ChevronLeft, ChevronRight } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Stock, NGXSector } from "@/types/market"

const SECTORS: { value: NGXSector | "all"; label: string }[] = [
  { value: "all", label: "All Sectors" },
  { value: "banking", label: "Banking" },
  { value: "consumer-goods", label: "Consumer Goods" },
  { value: "industrial-goods", label: "Industrial Goods" },
  { value: "oil-gas", label: "Oil & Gas" },
  { value: "insurance", label: "Insurance" },
  { value: "agriculture", label: "Agriculture" },
  { value: "healthcare", label: "Healthcare" },
  { value: "ict", label: "ICT" },
  { value: "real-estate", label: "Real Estate" },
  { value: "conglomerates", label: "Conglomerates" },
  { value: "services", label: "Services" },
]

const BOARDS = ["All", "Premium", "Main", "ASeM"] as const
const PAGE_SIZE = 20

type SortKey = "ticker" | "price" | "priceChangePercent" | "volume" | "marketCap" | "dividendYield" | "pe"

export default function StocksPage() {
  const [stocks, setStocks] = useState<Stock[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [sector, setSector] = useState<NGXSector | "all">("all")
  const [board, setBoard] = useState<string>("All")
  const [sortKey, setSortKey] = useState<SortKey>("volume")
  const [sortAsc, setSortAsc] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [page, setPage] = useState(1)

  useEffect(() => {
    fetch("/api/stocks")
      .then((r) => r.json())
      .then((data) => { setStocks(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  // Reset page when filters change
  useEffect(() => { setPage(1) }, [search, sector, board, sortKey, sortAsc])

  const filtered = useMemo(() => {
    let result = [...stocks]
    if (search) {
      const q = search.toLowerCase()
      result = result.filter((s) => s.ticker.toLowerCase().includes(q) || s.name.toLowerCase().includes(q))
    }
    if (sector !== "all") result = result.filter((s) => s.sector === sector)
    if (board !== "All") result = result.filter((s) => s.board === board)
    result.sort((a, b) => {
      const aVal = a[sortKey] ?? 0
      const bVal = b[sortKey] ?? 0
      if (typeof aVal === "string") return sortAsc ? aVal.localeCompare(bVal as string) : (bVal as string).localeCompare(aVal)
      return sortAsc ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number)
    })
    return result
  }, [stocks, search, sector, board, sortKey, sortAsc])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortAsc(!sortAsc)
    else { setSortKey(key); setSortAsc(false) }
  }

  function exportCSV() {
    const headers = ["Ticker", "Company", "Sector", "Price", "Change%", "Volume", "P/E", "Div Yield", "Board"]
    const rows = filtered.map((s) => [
      s.ticker, s.name, s.sector, s.price, s.priceChangePercent,
      s.volume, s.pe ?? "", s.dividendYield ?? "", s.board,
    ])
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url; a.download = "ngx-stocks.csv"; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Stock Screener</h1>
          <p className="text-muted-foreground mt-1">
            Browse and filter {stocks.length > 0 ? `${filtered.length} of ${stocks.length}` : ""} NGX-listed companies
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={exportCSV} className="hidden sm:flex gap-2">
          <Download className="w-4 h-4" /> Export CSV
        </Button>
      </div>

      {/* Search + Filter */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search by ticker or company name..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>
        <Button variant={showFilters ? "default" : "outline"} size="icon" onClick={() => setShowFilters(!showFilters)}>
          <SlidersHorizontal className="w-4 h-4" />
        </Button>
      </div>

      {showFilters && (
        <Card className="p-4">
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block font-medium">Sector</label>
              <select value={sector} onChange={(e) => setSector(e.target.value as NGXSector | "all")} className="h-9 rounded-md border border-input bg-background px-3 text-sm">
                {SECTORS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block font-medium">Board</label>
              <div className="flex gap-1">
                {BOARDS.map((b) => (
                  <button key={b} onClick={() => setBoard(b)}
                    className={`px-3 py-1.5 text-xs rounded-md font-medium transition-colors ${board === b ? "bg-brand text-white" : "bg-secondary text-muted-foreground hover:bg-secondary/80"}`}>
                    {b}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Table */}
      <Card>
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand" />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    {[
                      { key: "ticker" as SortKey, label: "TICKER", align: "left", hide: false },
                      { key: "price" as SortKey, label: "PRICE (₦)", align: "right", hide: false },
                      { key: "priceChangePercent" as SortKey, label: "CHANGE", align: "right", hide: false },
                      { key: "volume" as SortKey, label: "VOLUME", align: "right", hide: true },
                      { key: "pe" as SortKey, label: "P/E", align: "right", hide: true },
                      { key: "dividendYield" as SortKey, label: "DIV YIELD", align: "right", hide: true },
                    ].map(({ key, label, align, hide }) => (
                      <th key={key} onClick={() => toggleSort(key)}
                        className={`text-${align} text-xs text-muted-foreground px-4 py-3 cursor-pointer hover:text-foreground transition-colors select-none font-medium ${hide ? "hidden md:table-cell" : ""}`}>
                        <span className="inline-flex items-center gap-1">
                          {label}
                          {sortKey === key && <ArrowUpDown className="w-3 h-3" />}
                        </span>
                      </th>
                    ))}
                    <th className="px-4 py-3 w-10" />
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((s) => (
                    <tr key={s.ticker} className="border-b border-border/50 last:border-0 hover:bg-secondary/30 transition-colors">
                      <td className="px-4 py-3.5">
                        <Link href={`/dashboard/stocks/${s.ticker}`} className="hover:underline">
                          <span className="font-mono font-semibold text-sm">{s.ticker}</span>
                          <span className="block text-sm text-muted-foreground truncate max-w-[200px]">{s.name}</span>
                        </Link>
                        <Badge variant="secondary" className="text-[10px] mt-1">{s.sector}</Badge>
                      </td>
                      <td className="px-4 py-3.5 text-right font-mono text-sm">
                        {s.price.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
                      </td>
                      <td className={`px-4 py-3.5 text-right font-mono text-sm font-semibold ${s.priceChangePercent > 0 ? "text-gain" : s.priceChangePercent < 0 ? "text-loss" : "text-muted-foreground"}`}>
                        {s.priceChangePercent > 0 ? "+" : ""}{s.priceChangePercent.toFixed(2)}%
                      </td>
                      <td className="px-4 py-3.5 text-right font-mono text-sm hidden md:table-cell">
                        {s.volume ? s.volume.toLocaleString() : "—"}
                      </td>
                      <td className="px-4 py-3.5 text-right font-mono text-sm hidden md:table-cell">
                        {s.pe ? s.pe.toFixed(1) : "—"}
                      </td>
                      <td className="px-4 py-3.5 text-right font-mono text-sm hidden md:table-cell">
                        {s.dividendYield ? `${s.dividendYield.toFixed(1)}%` : "—"}
                      </td>
                      <td className="px-4 py-3.5">
                        <button className="text-muted-foreground hover:text-brand transition-colors">
                          <Star className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {paginated.length === 0 && (
                    <tr><td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">No stocks match your filters</td></tr>
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
                      <Button key={pageNum} variant={page === pageNum ? "default" : "outline"} size="sm"
                        className="w-9 h-9" onClick={() => setPage(pageNum)}>
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
          </>
        )}
      </Card>
    </div>
  )
}
