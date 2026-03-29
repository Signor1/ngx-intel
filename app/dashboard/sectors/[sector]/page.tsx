"use client"

import { useEffect, useState, useMemo } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Stock, NGXSector } from "@/types/market"

const SECTOR_INFO: Record<string, { label: string; description: string; drivers: string[]; risks: string[] }> = {
  banking: {
    label: "Banking",
    description: "The banking sector is the most liquid and heavily traded on the NGX, dominated by Tier-1 banks like Zenith, GTCO, UBA, Access Holdings, and First Bank. Nigerian banks are key dividend payers and benefit from rising interest rates and CBN monetary tightening.",
    drivers: ["CBN monetary policy & interest rates", "Naira exchange rate movements", "Recapitalization requirements", "Digital banking adoption", "Oil revenue flows"],
    risks: ["Regulatory changes from CBN", "Non-performing loans (NPL ratio)", "Naira devaluation impact on foreign-denominated assets", "Recapitalization pressure"],
  },
  "consumer-goods": {
    label: "Consumer Goods",
    description: "Consumer goods companies produce food, beverages, and household items for Nigeria's 200M+ population. Key players include Nigerian Breweries, Nestlé, Dangote Sugar, BUA Foods, and Cadbury. The sector is sensitive to inflation and consumer spending power.",
    drivers: ["Consumer spending & disposable income", "Inflation rates", "Raw material costs", "Population growth", "Naira purchasing power"],
    risks: ["High inflation eroding margins", "FX scarcity for imported raw materials", "Weak consumer demand", "Competition from imported goods"],
  },
  "oil-gas": {
    label: "Oil & Gas",
    description: "Nigeria is Africa's largest oil producer. Listed companies include Seplat Energy, TotalEnergies Nigeria, Oando, and Aradel Holdings. The sector tracks global crude oil prices and is influenced by OPEC+ decisions and local refining capacity.",
    drivers: ["Crude oil prices (Brent)", "OPEC+ production quotas", "Dangote Refinery operations", "PIA (Petroleum Industry Act) implementation", "Gas monetization"],
    risks: ["Oil price volatility", "Production disruptions & pipeline vandalism", "Regulatory uncertainty", "Energy transition pressures"],
  },
  "industrial-goods": {
    label: "Industrial Goods",
    description: "Dominated by cement manufacturers — Dangote Cement, BUA Cement, and Lafarge Africa (Wapco). Infrastructure spending and construction activity are the primary growth drivers.",
    drivers: ["Government infrastructure spending", "Construction activity", "Cement pricing", "Housing demand"],
    risks: ["Energy costs for production", "Competition & overcapacity", "Regulatory & environmental compliance"],
  },
  insurance: {
    label: "Insurance",
    description: "Nigeria's insurance penetration remains among the lowest globally at under 1% of GDP, presenting both a challenge and a massive opportunity. Key players include AIICO, AXA Mansard, NEM Insurance, and Custodian Investment.",
    drivers: ["Insurance penetration growth", "Regulatory reforms (NAICOM)", "Recapitalization", "Digital insurance adoption"],
    risks: ["Low insurance awareness", "Claim settlement challenges", "Recapitalization requirements", "Intense competition"],
  },
  agriculture: {
    label: "Agriculture",
    description: "Agricultural stocks on the NGX include palm oil giants Presco and Okomu Oil, plus Livestock Feeds and Ellah Lakes. Nigeria's push for food security and import substitution supports the sector.",
    drivers: ["Palm oil prices", "Government agricultural policies", "Food security initiatives", "Export demand"],
    risks: ["Weather & climate risks", "Land & infrastructure challenges", "FX impact on equipment imports"],
  },
  healthcare: {
    label: "Healthcare",
    description: "A small but growing sector with pharmaceutical companies like Fidson Healthcare, May & Baker, and GlaxoSmithKline Nigeria. Rising health consciousness and population growth drive demand.",
    drivers: ["Population growth", "Healthcare spending", "Drug manufacturing capacity", "Government health policies"],
    risks: ["Regulatory approvals", "FX for imported APIs", "Competition from imports"],
  },
  ict: {
    label: "ICT",
    description: "Dominated by telecom giants MTN Nigeria and Airtel Africa — two of the most valuable companies on the NGX. Nigeria's young, increasingly connected population makes this a high-growth sector.",
    drivers: ["Data consumption growth", "Mobile money & fintech", "5G rollout", "Digital economy policies"],
    risks: ["Regulatory levies & taxation", "Infrastructure costs", "Competition & pricing pressure"],
  },
  "real-estate": {
    label: "Real Estate",
    description: "Includes REITs like UPDC REIT and SFS Real Estate Investment Trust, plus UPDC Plc. Nigeria's housing deficit of 17M+ units presents a long-term opportunity.",
    drivers: ["Housing deficit", "Mortgage penetration", "Urbanization", "Interest rate environment"],
    risks: ["Land acquisition challenges", "Regulatory & title issues", "High construction costs"],
  },
  conglomerates: {
    label: "Conglomerates",
    description: "Diversified companies operating across multiple sectors. Transcorp (power, hospitality, oil), UACN (food, logistics), and PZ Cussons are the main players.",
    drivers: ["Cross-sector diversification", "Consumer demand", "Power sector reforms"],
    risks: ["Operational complexity", "Capital allocation challenges", "Sector-specific headwinds"],
  },
  services: {
    label: "Services",
    description: "A broad category covering logistics, publishing, and other service-oriented businesses listed on the NGX.",
    drivers: ["Economic growth", "Trade volumes", "Digital transformation"],
    risks: ["Low liquidity", "Small market capitalization", "Limited institutional interest"],
  },
}

export default function SectorDetailPage() {
  const { sector } = useParams<{ sector: string }>()
  const [stocks, setStocks] = useState<Stock[]>([])
  const [loading, setLoading] = useState(true)

  const info = SECTOR_INFO[sector] || {
    label: sector, description: "", drivers: [], risks: [],
  }

  useEffect(() => {
    fetch("/api/stocks")
      .then((r) => r.json())
      .then((data: Stock[]) => {
        setStocks(data.filter((s) => s.sector === sector))
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [sector])

  const sorted = useMemo(() => {
    return [...stocks].sort((a, b) => (b.volume || 0) - (a.volume || 0))
  }, [stocks])

  const avgChange = stocks.length > 0
    ? stocks.reduce((sum, s) => sum + s.priceChangePercent, 0) / stocks.length
    : 0

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <Link
        href="/dashboard/sectors"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        All Sectors
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{info.label} Sector</h1>
          <p className="text-sm text-muted-foreground mt-1">{stocks.length} companies listed on NGX</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Avg. Change Today</p>
          <p className={`text-2xl font-semibold font-mono ${avgChange > 0 ? "text-gain" : avgChange < 0 ? "text-loss" : "text-muted-foreground"}`}>
            {avgChange > 0 ? "+" : ""}{avgChange.toFixed(2)}%
          </p>
        </div>
      </div>

      {/* Description */}
      <Card className="p-5">
        <p className="text-sm text-muted-foreground leading-relaxed">{info.description}</p>
      </Card>

      {/* Stocks table */}
      <Card className="p-5">
        <h2 className="font-semibold mb-4">All {info.label} Stocks</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-mono text-muted-foreground px-3 py-2">TICKER</th>
                <th className="text-left text-xs font-mono text-muted-foreground px-3 py-2 hidden sm:table-cell">COMPANY</th>
                <th className="text-right text-xs font-mono text-muted-foreground px-3 py-2">PRICE (₦)</th>
                <th className="text-right text-xs font-mono text-muted-foreground px-3 py-2">CHANGE</th>
                <th className="text-right text-xs font-mono text-muted-foreground px-3 py-2 hidden md:table-cell">VOLUME</th>
                <th className="text-right text-xs font-mono text-muted-foreground px-3 py-2 hidden md:table-cell">52W RANGE</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((s) => (
                <tr key={s.ticker} className="border-b border-border/50 last:border-0 hover:bg-secondary/30 transition-colors">
                  <td className="px-3 py-2.5">
                    <Link href={`/dashboard/stocks/${s.ticker}`} className="font-mono font-semibold text-xs text-brand hover:underline">
                      {s.ticker}
                    </Link>
                    <Badge variant="outline" className="text-[9px] font-mono ml-2">{s.board}</Badge>
                  </td>
                  <td className="px-3 py-2.5 text-muted-foreground text-xs hidden sm:table-cell truncate max-w-[180px]">
                    {s.name}
                  </td>
                  <td className="px-3 py-2.5 text-right font-mono">
                    {s.price.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
                  </td>
                  <td className={`px-3 py-2.5 text-right font-mono font-semibold ${
                    s.priceChangePercent > 0 ? "text-gain" : s.priceChangePercent < 0 ? "text-loss" : "text-muted-foreground"
                  }`}>
                    <span className="inline-flex items-center gap-0.5">
                      {s.priceChangePercent > 0 ? <ArrowUpRight className="w-3 h-3" /> : s.priceChangePercent < 0 ? <ArrowDownRight className="w-3 h-3" /> : null}
                      {s.priceChangePercent > 0 ? "+" : ""}{s.priceChangePercent.toFixed(2)}%
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-right font-mono text-muted-foreground hidden md:table-cell">
                    {s.volume ? s.volume.toLocaleString() : "—"}
                  </td>
                  <td className="px-3 py-2.5 text-right font-mono text-xs text-muted-foreground hidden md:table-cell">
                    ₦{s.weekLow52.toLocaleString()} — ₦{s.weekHigh52.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Drivers & Risks */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="p-5">
          <h2 className="font-semibold mb-3 text-gain">Key Drivers</h2>
          <ul className="space-y-2">
            {info.drivers.map((d) => (
              <li key={d} className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="text-gain mt-0.5">+</span>
                {d}
              </li>
            ))}
          </ul>
        </Card>
        <Card className="p-5">
          <h2 className="font-semibold mb-3 text-loss">Key Risks</h2>
          <ul className="space-y-2">
            {info.risks.map((r) => (
              <li key={r} className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="text-loss mt-0.5">!</span>
                {r}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  )
}
