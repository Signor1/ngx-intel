/**
 * NGXOfficialSource — placeholder for NGX Official API (paid, $1k+/yr)
 * Endpoint: marketdataapiv3.ngxgroup.com
 *
 * Not yet implemented. Switch DATA_SOURCE=ngx_official to activate.
 */

import type { NGXDataSource } from "./index"
import type { MarketSummary, Stock, StockDetail, DividendRecord, PricePoint } from "@/types/market"

export class NGXOfficialSource implements NGXDataSource {
  async getMarketSummary(): Promise<MarketSummary> {
    throw new Error("NGX Official API not yet implemented. Set DATA_SOURCE=eodhd or remove the env var.")
  }
  async getAllStocks(): Promise<Stock[]> {
    throw new Error("NGX Official API not yet implemented.")
  }
  async getStock(): Promise<StockDetail | null> {
    throw new Error("NGX Official API not yet implemented.")
  }
  async getDividends(): Promise<DividendRecord[]> {
    throw new Error("NGX Official API not yet implemented.")
  }
  async getHistoricalPrices(): Promise<PricePoint[]> {
    throw new Error("NGX Official API not yet implemented.")
  }
}
