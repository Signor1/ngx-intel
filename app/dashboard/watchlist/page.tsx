"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { Star, Search, Trash2, StickyNote, ArrowUpRight, ArrowDownRight, Plus } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useWatchlistStore } from "@/stores/watchlist-store"
import type { Stock } from "@/types/market"

export default function WatchlistPage() {
  const { items, addStock, removeStock, updateNote } = useWatchlistStore()
  const [allStocks, setAllStocks] = useState<Stock[]>([])
  const [search, setSearch] = useState("")
  const [showSearch, setShowSearch] = useState(false)
  const [editingNote, setEditingNote] = useState<string | null>(null)
  const [noteValue, setNoteValue] = useState("")

  useEffect(() => {
    fetch("/api/stocks")
      .then((r) => r.json())
      .then(setAllStocks)
      .catch(() => {})
  }, [])

  // Create a map of current prices
  const priceMap = useMemo(() => {
    const map = new Map<string, Stock>()
    for (const s of allStocks) map.set(s.ticker, s)
    return map
  }, [allStocks])

  const searchResults = useMemo(() => {
    if (!search) return []
    const q = search.toLowerCase()
    return allStocks
      .filter(
        (s) =>
          (s.ticker.toLowerCase().includes(q) || s.name.toLowerCase().includes(q)) &&
          !items.find((i) => i.ticker === s.ticker)
      )
      .slice(0, 8)
  }, [search, allStocks, items])

  function handleAddStock(stock: Stock) {
    addStock({
      ticker: stock.ticker,
      name: stock.name,
      sector: stock.sector,
      addedAt: Date.now(),
    })
    setSearch("")
    setShowSearch(false)
  }

  function startEditNote(ticker: string, currentNote?: string) {
    setEditingNote(ticker)
    setNoteValue(currentNote || "")
  }

  function saveNote(ticker: string) {
    updateNote(ticker, noteValue)
    setEditingNote(null)
    setNoteValue("")
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Watchlist</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {items.length > 0
              ? `Tracking ${items.length} stock${items.length === 1 ? "" : "s"}`
              : "Track your favourite NGX stocks"}
          </p>
        </div>
        <Button
          onClick={() => setShowSearch(!showSearch)}
          variant={showSearch ? "default" : "outline"}
          size="sm"
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Stock
        </Button>
      </div>

      {/* Search to add */}
      {showSearch && (
        <Card className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by ticker or company name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
              autoFocus
            />
          </div>
          {searchResults.length > 0 && (
            <div className="mt-3 space-y-1">
              {searchResults.map((s) => (
                <button
                  key={s.ticker}
                  onClick={() => handleAddStock(s)}
                  className="flex items-center justify-between w-full px-3 py-2 rounded-lg hover:bg-secondary transition-colors text-sm"
                >
                  <div className="text-left">
                    <span className="font-mono font-semibold text-xs">{s.ticker}</span>
                    <span className="text-xs text-muted-foreground ml-2 truncate">{s.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs">₦{s.price.toLocaleString()}</span>
                    <Plus className="w-4 h-4 text-brand" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* Watchlist cards */}
      {items.length > 0 ? (
        <div className="space-y-3">
          {items.map((item) => {
            const liveData = priceMap.get(item.ticker)
            const price = liveData?.price ?? 0
            const change = liveData?.priceChange ?? 0
            const changePct = liveData?.priceChangePercent ?? 0
            const isUp = change >= 0

            return (
              <Card key={item.ticker} className="p-4">
                <div className="flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Link
                        href={`/dashboard/stocks/${item.ticker}`}
                        className="font-mono font-semibold text-sm text-brand hover:underline"
                      >
                        {item.ticker}
                      </Link>
                      <Badge variant="secondary" className="text-[9px] font-mono">{item.sector}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{item.name}</p>

                    {/* Note */}
                    {editingNote === item.ticker ? (
                      <div className="flex gap-2 mt-2">
                        <Input
                          value={noteValue}
                          onChange={(e) => setNoteValue(e.target.value)}
                          placeholder="Add a note..."
                          className="text-xs h-8"
                          onKeyDown={(e) => e.key === "Enter" && saveNote(item.ticker)}
                          autoFocus
                        />
                        <Button size="sm" variant="outline" onClick={() => saveNote(item.ticker)} className="h-8 text-xs">
                          Save
                        </Button>
                      </div>
                    ) : item.note ? (
                      <button
                        onClick={() => startEditNote(item.ticker, item.note)}
                        className="mt-2 text-xs text-muted-foreground bg-secondary/50 px-2 py-1 rounded flex items-center gap-1 hover:bg-secondary transition-colors"
                      >
                        <StickyNote className="w-3 h-3" />
                        {item.note}
                      </button>
                    ) : (
                      <button
                        onClick={() => startEditNote(item.ticker)}
                        className="mt-2 text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                      >
                        <StickyNote className="w-3 h-3" />
                        Add note
                      </button>
                    )}
                  </div>

                  <div className="text-right shrink-0">
                    <p className="font-mono font-semibold">
                      ₦{price.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
                    </p>
                    <div className="flex items-center justify-end gap-1 mt-0.5">
                      {isUp ? (
                        <ArrowUpRight className="w-3 h-3 text-gain" />
                      ) : (
                        <ArrowDownRight className="w-3 h-3 text-loss" />
                      )}
                      <span className={`text-xs font-mono font-semibold ${isUp ? "text-gain" : "text-loss"}`}>
                        {changePct > 0 ? "+" : ""}{changePct.toFixed(2)}%
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => removeStock(item.ticker)}
                    className="text-muted-foreground hover:text-loss transition-colors shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <Star className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <h3 className="font-medium mb-1">No stocks in your watchlist</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Add stocks to track their prices and performance
          </p>
          <Button onClick={() => setShowSearch(true)} variant="outline" className="gap-2">
            <Plus className="w-4 h-4" />
            Add your first stock
          </Button>
        </Card>
      )}
    </div>
  )
}
