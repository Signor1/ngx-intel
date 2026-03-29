import type { MarketSummary, Stock, StockDetail, DividendRecord, PricePoint } from "@/types/market"

/**
 * Source-agnostic interface for all NGX market data.
 * Implementations: EODHDSource (free, default), NGXOfficialSource (paid, future).
 */
export interface NGXDataSource {
  getMarketSummary(): Promise<MarketSummary>
  getAllStocks(): Promise<Stock[]>
  getStock(ticker: string): Promise<StockDetail | null>
  getDividends(): Promise<DividendRecord[]>
  getHistoricalPrices(ticker: string, from: Date, to: Date): Promise<PricePoint[]>
}

/**
 * Returns the active data source based on the DATA_SOURCE env var.
 * Defaults to EODHDSource (free tier + seed JSON fallback).
 */
export async function getDataSource(): Promise<NGXDataSource> {
  if (process.env.DATA_SOURCE === "ngx_official") {
    const { NGXOfficialSource } = await import("./ngx-official-source")
    return new NGXOfficialSource()
  }
  const { EODHDSource } = await import("./eodhd-source")
  return new EODHDSource()
}
