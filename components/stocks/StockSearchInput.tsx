"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import type { Stock } from "@/types/market"

interface StockSearchInputProps {
  onSelect?: (stock: Stock) => void
  placeholder?: string
}

export function StockSearchInput({ onSelect, placeholder = "Search ticker or company..." }: StockSearchInputProps) {
  const [query, setQuery] = useState("")
  const [stocks, setStocks] = useState<Stock[]>([])
  const [open, setOpen] = useState(false)

  useEffect(() => {
    fetch("/api/stocks")
      .then((r) => r.json())
      .then(setStocks)
      .catch(() => {})
  }, [])

  const results = useMemo(() => {
    if (!query) return []
    const q = query.toLowerCase()
    return stocks
      .filter((s) => s.ticker.toLowerCase().includes(q) || s.name.toLowerCase().includes(q))
      .slice(0, 8)
  }, [query, stocks])

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <Input
        placeholder={placeholder}
        value={query}
        onChange={(e) => { setQuery(e.target.value); setOpen(true) }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 200)}
        className="pl-9"
      />
      {open && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-lg shadow-lg z-50 overflow-hidden">
          {results.map((s) => (
            <button
              key={s.ticker}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                if (onSelect) {
                  onSelect(s)
                  setQuery("")
                  setOpen(false)
                }
              }}
              className="flex items-center justify-between w-full px-3 py-2 hover:bg-secondary transition-colors text-sm"
            >
              <div>
                <span className="font-mono font-semibold text-xs">{s.ticker}</span>
                <span className="text-xs text-muted-foreground ml-2">{s.name}</span>
              </div>
              <span className="font-mono text-xs">₦{s.price.toLocaleString()}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
