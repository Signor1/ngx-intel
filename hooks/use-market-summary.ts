"use client"

import { useQuery } from "@tanstack/react-query"
import type { MarketSummary } from "@/types/market"
import { isMarketOpen } from "@/lib/market-hours"

async function fetchMarketSummary(): Promise<MarketSummary> {
  const res = await fetch("/api/market/summary")
  if (!res.ok) throw new Error("Failed to fetch market summary")
  return res.json()
}

export function useMarketSummary() {
  return useQuery({
    queryKey: ["market-summary"],
    queryFn: fetchMarketSummary,
    refetchInterval: isMarketOpen() ? 5 * 60 * 1000 : false, // poll every 5 min during market hours
    staleTime: 2 * 60 * 1000,
  })
}
