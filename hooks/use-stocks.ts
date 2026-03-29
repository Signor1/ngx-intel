"use client"

import { useQuery } from "@tanstack/react-query"
import type { Stock, StockDetail } from "@/types/market"
import { isMarketOpen } from "@/lib/market-hours"

async function fetchAllStocks(): Promise<Stock[]> {
  const res = await fetch("/api/stocks")
  if (!res.ok) throw new Error("Failed to fetch stocks")
  return res.json()
}

async function fetchStock(ticker: string): Promise<StockDetail> {
  const res = await fetch(`/api/stocks/${ticker}`)
  if (!res.ok) throw new Error(`Failed to fetch stock ${ticker}`)
  return res.json()
}

export function useStocks() {
  return useQuery({
    queryKey: ["stocks"],
    queryFn: fetchAllStocks,
    refetchInterval: isMarketOpen() ? 10 * 60 * 1000 : false,
    staleTime: 5 * 60 * 1000,
  })
}

export function useStock(ticker: string) {
  return useQuery({
    queryKey: ["stock", ticker],
    queryFn: () => fetchStock(ticker),
    enabled: !!ticker,
    refetchInterval: isMarketOpen() ? 10 * 60 * 1000 : false,
    staleTime: 5 * 60 * 1000,
  })
}
