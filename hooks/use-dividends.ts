"use client"

import { useQuery } from "@tanstack/react-query"
import type { DividendRecord } from "@/types/market"

async function fetchDividends(ticker?: string): Promise<DividendRecord[]> {
  const url = ticker ? `/api/dividends?ticker=${ticker}` : "/api/dividends"
  const res = await fetch(url)
  if (!res.ok) throw new Error("Failed to fetch dividends")
  return res.json()
}

export function useDividends(ticker?: string) {
  return useQuery({
    queryKey: ["dividends", ticker ?? "all"],
    queryFn: () => fetchDividends(ticker),
    staleTime: 30 * 60 * 1000, // 30 min
  })
}
