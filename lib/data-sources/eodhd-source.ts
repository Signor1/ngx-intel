/**
 * EODHDSource — EODHD.com API adapter for NGX market data
 *
 * Free tier supports:
 *   - /api/eod/{TICKER}.XNSA — daily OHLCV historical prices
 *   - /api/div/{TICKER}.XNSA — dividend history
 *   - /api/exchange-symbol-list/XNSA — full stock list
 *   - /api/real-time/{TICKER}.XNSA — previous close (no live intraday on free)
 *
 * Paid-only (not used):
 *   - /api/fundamentals — P/E, EPS, market cap, descriptions
 *   - /api/screener — filter by sector, market cap, etc.
 *   - /api/eod-bulk-last-day — bulk EOD prices
 */

import type { NGXDataSource } from "./index"
import type {
  MarketSummary,
  Stock,
  StockDetail,
  DividendRecord,
  PricePoint,
} from "@/types/market"
import { isMarketOpen } from "@/lib/market-hours"
import seedStocks from "@/data/stocks-seed.json"

const API_BASE = "https://eodhd.com/api"

function getApiToken(): string {
  return process.env.EODHD_API_KEY || ""
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function fetchJSON<T>(path: string, fallback: T): Promise<T> {
  const token = getApiToken()
  if (!token) {
    console.warn("[EODHD] No API key configured, using seed data")
    return fallback
  }

  const separator = path.includes("?") ? "&" : "?"
  const url = `${API_BASE}${path}${separator}api_token=${token}&fmt=json`

  try {
    const res = await fetch(url, {
      next: { revalidate: 600 },
      headers: { Accept: "application/json" },
    })

    if (!res.ok) {
      console.error(`[EODHD] HTTP ${res.status} for ${path}`)
      return fallback
    }

    return (await res.json()) as T
  } catch (err) {
    console.error("[EODHD] fetch error:", err)
    return fallback
  }
}

// Type for raw EODHD EOD response
interface EODHDPrice {
  date: string
  open: number
  high: number
  low: number
  close: number
  adjusted_close: number
  volume: number
}

// Type for raw EODHD dividend response
interface EODHDDividend {
  date: string
  declarationDate: string | null
  recordDate: string | null
  paymentDate: string | null
  period: string | null
  value: number
  unadjustedValue: number
  currency: string
}

// Type for the seed stock data
interface SeedStock {
  ticker: string
  name: string
  sector: string
  board: string
  isin: string
  price: number
  priceChange: number
  priceChangePercent: number
  volume: number
  marketCap: number
  pe: number | null
  eps: number | null
  dividendYield: number | null
  weekHigh52: number
  weekLow52: number
  description?: string
  website?: string | null
  founded?: number | null
}

// Build a lookup from seed data
const seedMap = new Map<string, SeedStock>()
for (const s of seedStocks as SeedStock[]) {
  seedMap.set(s.ticker, s)
}

function seedToStock(s: SeedStock): Stock {
  return {
    ticker: s.ticker,
    name: s.name,
    sector: s.sector as Stock["sector"],
    price: s.price,
    priceChange: s.priceChange,
    priceChangePercent: s.priceChangePercent,
    volume: s.volume,
    marketCap: s.marketCap,
    pe: s.pe,
    eps: s.eps,
    dividendYield: s.dividendYield,
    weekHigh52: s.weekHigh52,
    weekLow52: s.weekLow52,
    board: s.board as Stock["board"],
  }
}

// ─── EODHDSource ──────────────────────────────────────────────────────────────

export class EODHDSource implements NGXDataSource {
  /**
   * Fetches the latest EOD data for a ticker and merges with seed.
   * Returns up to `limit` days of history.
   */
  private async fetchLatestEOD(
    ticker: string,
    days: number = 5
  ): Promise<EODHDPrice[]> {
    const to = new Date()
    const from = new Date()
    from.setDate(from.getDate() - days)

    const fromStr = from.toISOString().split("T")[0]
    const toStr = to.toISOString().split("T")[0]

    return fetchJSON<EODHDPrice[]>(
      `/eod/${ticker}.XNSA?period=d&order=d&from=${fromStr}&to=${toStr}`,
      []
    )
  }

  async getMarketSummary(): Promise<MarketSummary> {
    // Fetch a few bellwether stocks to compute market stats
    const bellwethers = [
      "ZENITHBANK", "GTCO", "MTNN", "DANGCEM", "ACCESSCORP",
      "UBA", "SEPLAT", "AIRTELAFRI", "BUACEMENT", "NB",
      "FBNH", "NESTLE", "STANBIC", "BUAFOODS", "ARADEL",
    ]

    const results = await Promise.allSettled(
      bellwethers.map((t) => this.fetchLatestEOD(t, 5))
    )

    let totalVolume = 0
    let gainers = 0
    let losers = 0
    let unchanged = 0
    const movers: { ticker: string; name: string; price: number; change: number; changePercent: number }[] = []

    for (let i = 0; i < bellwethers.length; i++) {
      const result = results[i]
      if (result.status !== "fulfilled" || result.value.length < 2) continue

      const [latest, prev] = result.value
      const ticker = bellwethers[i]
      const seed = seedMap.get(ticker)
      const change = latest.close - prev.close
      const changePct = prev.close ? (change / prev.close) * 100 : 0

      totalVolume += latest.volume || 0
      if (change > 0) gainers++
      else if (change < 0) losers++
      else unchanged++

      movers.push({
        ticker,
        name: seed?.name ?? ticker,
        price: latest.close,
        change: Math.round(change * 100) / 100,
        changePercent: Math.round(changePct * 100) / 100,
      })
    }

    // Sort for top gainers/losers
    const sorted = [...movers].sort((a, b) => b.changePercent - a.changePercent)
    const topGainers = sorted.filter((m) => m.changePercent > 0).slice(0, 5)
    const topLosers = sorted.filter((m) => m.changePercent < 0).slice(0, 5).reverse()

    // Estimate broader market from all seed stocks
    const allStocks = seedStocks as SeedStock[]
    const totalGainers = allStocks.filter((s) => s.priceChange > 0).length || gainers
    const totalLosers = allStocks.filter((s) => s.priceChange < 0).length || losers
    const totalUnchanged = allStocks.length - totalGainers - totalLosers

    // Use first bellwether's data to estimate ASI change direction
    const asiSeed = FALLBACK_SUMMARY

    return {
      asiValue: asiSeed.asiValue,
      asiChange: asiSeed.asiChange,
      asiChangePercent: asiSeed.asiChangePercent,
      marketCap: asiSeed.marketCap,
      volume: totalVolume || asiSeed.volume,
      deals: asiSeed.deals,
      gainers: totalGainers,
      losers: totalLosers,
      unchanged: totalUnchanged,
      topGainers: topGainers.length > 0 ? topGainers : asiSeed.topGainers,
      topLosers: topLosers.length > 0 ? topLosers : asiSeed.topLosers,
      tradingDate: new Date().toISOString().split("T")[0],
      isOpen: isMarketOpen(),
    }
  }

  async getAllStocks(): Promise<Stock[]> {
    // Use seed data as base, enriched with latest EOD for top stocks
    const allSeed = seedStocks as SeedStock[]

    // For free tier, we can't bulk-fetch. Return seed data which has
    // recent prices baked in, and let individual stock pages fetch fresh.
    return allSeed
      .filter((s) => s.price > 0)
      .map(seedToStock)
      .sort((a, b) => (b.volume || 0) - (a.volume || 0))
  }

  async getStock(ticker: string): Promise<StockDetail | null> {
    const upper = ticker.toUpperCase()
    const seed = seedMap.get(upper)
    if (!seed) return null

    // Fetch recent price history (90 days)
    const eodData = await this.fetchLatestEOD(upper, 90)

    let price = seed.price
    let priceChange = seed.priceChange
    let priceChangePercent = seed.priceChangePercent
    let volume = seed.volume
    let weekHigh52 = seed.weekHigh52
    let weekLow52 = seed.weekLow52

    if (eodData.length >= 2) {
      const latest = eodData[0]
      const prev = eodData[1]
      price = latest.close
      priceChange = Math.round((latest.close - prev.close) * 100) / 100
      priceChangePercent = prev.close
        ? Math.round(((latest.close - prev.close) / prev.close) * 10000) / 100
        : 0
      volume = latest.volume
    }

    // Compute 52-week high/low from available history
    if (eodData.length > 0) {
      const highs = eodData.map((d) => d.high).filter(Boolean)
      const lows = eodData.map((d) => d.low).filter((l) => l > 0)
      if (highs.length) weekHigh52 = Math.max(weekHigh52, ...highs)
      if (lows.length) weekLow52 = Math.min(weekLow52 || Infinity, ...lows)
    }

    // Fetch dividend history
    const divData = await fetchJSON<EODHDDividend[]>(
      `/div/${upper}.XNSA?from=2020-01-01`,
      []
    )

    const dividendHistory: DividendRecord[] = divData.map((d) => ({
      ticker: upper,
      companyName: seed.name,
      sector: seed.sector as DividendRecord["sector"],
      dividendPerShare: d.unadjustedValue || d.value,
      dividendYield: 0,
      exDividendDate: d.date,
      paymentDate: d.paymentDate,
      frequency: "annual" as const,
      type: d.period === "interim" ? ("interim" as const) : ("final" as const),
      financialYear: new Date(d.date).getFullYear(),
    }))

    const priceHistory: PricePoint[] = [...eodData]
      .reverse()
      .map((d) => ({
        date: d.date,
        open: d.open,
        high: d.high,
        low: d.low,
        close: d.close,
        volume: d.volume,
      }))

    return {
      ticker: upper,
      name: seed.name,
      sector: seed.sector as Stock["sector"],
      price,
      priceChange,
      priceChangePercent,
      volume,
      marketCap: seed.marketCap,
      pe: seed.pe,
      eps: seed.eps,
      dividendYield: seed.dividendYield,
      weekHigh52,
      weekLow52,
      board: seed.board as Stock["board"],
      description: seed.description || "",
      website: seed.website || null,
      founded: seed.founded || null,
      employees: null,
      priceHistory,
      dividendHistory,
      financials: { revenue: [], profitAfterTax: [], eps: [], years: [] },
      analystRating: null,
    }
  }

  async getDividends(): Promise<DividendRecord[]> {
    // Fetch dividends for top dividend-paying stocks
    const divTickers = [
      "ZENITHBANK", "GTCO", "UBA", "ACCESSCORP", "FBNH", "MTNN",
      "DANGCEM", "BUACEMENT", "SEPLAT", "NASCON", "PRESCO", "OKOMUOIL",
      "AIRTELAFRI", "STANBIC", "NESTLE", "BUAFOODS", "DANGSUGAR",
      "FIDELITYBK", "WEMABANK", "FCMB", "NEM", "CUSTODIAN",
    ]

    const allDividends: DividendRecord[] = []

    const results = await Promise.allSettled(
      divTickers.map((ticker) =>
        fetchJSON<EODHDDividend[]>(`/div/${ticker}.XNSA?from=2022-01-01`, [])
          .then((divs) => ({ ticker, divs }))
      )
    )

    for (const result of results) {
      if (result.status !== "fulfilled") continue
      const { ticker, divs } = result.value
      const seed = seedMap.get(ticker)

      for (const d of divs) {
        allDividends.push({
          ticker,
          companyName: seed?.name ?? ticker,
          sector: (seed?.sector ?? "services") as DividendRecord["sector"],
          dividendPerShare: d.unadjustedValue || d.value,
          dividendYield: seed?.price
            ? Math.round(((d.unadjustedValue || d.value) / seed.price) * 10000) / 100
            : 0,
          exDividendDate: d.date,
          paymentDate: d.paymentDate,
          frequency: "annual",
          type: d.period === "interim" ? "interim" : "final",
          financialYear: new Date(d.date).getFullYear(),
        })
      }
    }

    // Sort by ex-dividend date descending
    return allDividends.sort(
      (a, b) => b.exDividendDate.localeCompare(a.exDividendDate)
    )
  }

  async getHistoricalPrices(
    ticker: string,
    from: Date,
    to: Date
  ): Promise<PricePoint[]> {
    const fromStr = from.toISOString().split("T")[0]
    const toStr = to.toISOString().split("T")[0]

    const data = await fetchJSON<EODHDPrice[]>(
      `/eod/${ticker.toUpperCase()}.XNSA?period=d&order=a&from=${fromStr}&to=${toStr}`,
      []
    )

    return data.map((d) => ({
      date: d.date,
      open: d.open,
      high: d.high,
      low: d.low,
      close: d.close,
      volume: d.volume,
    }))
  }
}

// ─── Fallback market summary ─────────────────────────────────────────────────

const FALLBACK_SUMMARY: MarketSummary = {
  asiValue: 200913.06,
  asiChange: 632.44,
  asiChangePercent: 0.32,
  marketCap: 129000000000000,
  volume: 523400000,
  deals: 8421,
  gainers: 38,
  losers: 14,
  unchanged: 12,
  topGainers: [
    { ticker: "GTCO", name: "GUARANTY TRUST HOLDING COMPANY PLC", price: 116.1, change: 0.7, changePercent: 0.61 },
    { ticker: "ZENITHBANK", name: "ZENITH BANK PLC", price: 103, change: 2.0, changePercent: 1.98 },
    { ticker: "MTNN", name: "MTN NIGERIA COMMUNICATIONS PLC", price: 718, change: 5.0, changePercent: 0.70 },
  ],
  topLosers: [
    { ticker: "BUACEMENT", name: "BUA CEMENT PLC", price: 185, change: -2.0, changePercent: -1.07 },
    { ticker: "NB", name: "NIGERIAN BREWERIES PLC", price: 27.5, change: -0.5, changePercent: -1.79 },
    { ticker: "TRANSCORP", name: "TRANSCORP HOLDINGS PLC", price: 60.5, change: -1.0, changePercent: -1.63 },
  ],
  tradingDate: new Date().toISOString().split("T")[0],
  isOpen: false,
}
