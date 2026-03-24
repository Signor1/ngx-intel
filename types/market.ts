export type NGXSector =
  | "banking"
  | "consumer-goods"
  | "industrial-goods"
  | "oil-gas"
  | "insurance"
  | "agriculture"
  | "healthcare"
  | "ict"
  | "real-estate"
  | "conglomerates"
  | "services"

export interface TopMover {
  ticker: string
  name: string
  price: number
  change: number
  changePercent: number
}

export interface MarketSummary {
  asiValue: number
  asiChange: number
  asiChangePercent: number
  marketCap: number
  volume: number
  deals: number
  gainers: number
  losers: number
  unchanged: number
  topGainers: TopMover[]
  topLosers: TopMover[]
  tradingDate: string
  isOpen: boolean
}

export interface Stock {
  ticker: string
  name: string
  sector: NGXSector
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
  board: "Premium" | "Main" | "ASeM"
}

export interface PricePoint {
  date: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export interface DividendRecord {
  ticker: string
  companyName: string
  sector: NGXSector
  dividendPerShare: number
  dividendYield: number
  exDividendDate: string
  paymentDate: string | null
  frequency: "annual" | "semi-annual" | "quarterly"
  type: "final" | "interim" | "special"
  financialYear: number
}

export interface FinancialSummary {
  revenue: number[]
  profitAfterTax: number[]
  eps: number[]
  years: number[]
}

export interface StockDetail extends Stock {
  description: string
  website: string | null
  founded: number | null
  employees: number | null
  priceHistory: PricePoint[]
  dividendHistory: DividendRecord[]
  financials: FinancialSummary
  analystRating: "Buy" | "Accumulate" | "Hold" | "Reduce" | "Sell" | null
}

export interface SectorSummary {
  sector: NGXSector
  name: string
  marketCap: number
  dailyChange: number
  stockCount: number
  topTicker: string
}
