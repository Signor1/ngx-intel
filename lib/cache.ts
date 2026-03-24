import { isMarketOpen } from "./market-hours"

/**
 * Cache revalidation intervals (in seconds) — smart, market-hours-aware.
 */
export const REVALIDATE = {
  MARKET_SUMMARY: isMarketOpen() ? 300 : 86400,
  STOCKS_LIST: isMarketOpen() ? 600 : 86400,
  STOCK_DETAIL: isMarketOpen() ? 600 : 86400,
  DIVIDENDS: 21600,
  HISTORICAL: 86400,
  SECTORS: 3600,
} as const
