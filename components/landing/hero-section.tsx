"use client"

import Link from "next/link"
import { ArrowRight, TrendingUp, TrendingDown, BarChart2, Zap, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import Marquee from "react-fast-marquee"

// Real prices from seed data (March 2026)
// Verified prices — late March 2026 (sources: NGX, Investing.com, TradingView, StockAnalysis)
const TICKER_DATA = [
  { ticker: "ZENITHBANK", price: "₦107.50", change: "+1.42%", up: true },
  { ticker: "GTCO", price: "₦111.00", change: "+0.91%", up: true },
  { ticker: "MTNN", price: "₦701.10", change: "-0.27%", up: false },
  { ticker: "DANGCEM", price: "₦810.00", change: "+0.62%", up: true },
  { ticker: "SEPLAT", price: "₦9,099.90", change: "+1.83%", up: true },
  { ticker: "AIRTELAFRI", price: "₦2,270.00", change: "+0.44%", up: true },
  { ticker: "ARADEL", price: "₦1,300.40", change: "+2.15%", up: true },
  { ticker: "BUAFOODS", price: "₦798.90", change: "+0.36%", up: true },
  { ticker: "ACCESSCORP", price: "₦26.00", change: "+0.39%", up: true },
  { ticker: "NB", price: "₦71.95", change: "-1.85%", up: false },
  { ticker: "PRESCO", price: "₦1,701.10", change: "+1.06%", up: true },
  { ticker: "UBA", price: "₦35.50", change: "+1.43%", up: true },
  { ticker: "FBNH", price: "₦32.00", change: "-0.62%", up: false },
  { ticker: "BUACEMENT", price: "₦185.00", change: "-0.54%", up: false },
  { ticker: "STANBIC", price: "₦90.00", change: "+0.56%", up: true },
]

export function HeroSection() {
  return (
    <section className="relative bg-background overflow-hidden">
      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(var(--color-brand) 1px, transparent 1px), linear-gradient(90deg, var(--color-brand) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Radial glow behind headline */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-brand/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 pt-20 pb-16">

        {/* Main headline */}
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="font-bold text-5xl md:text-6xl lg:text-7xl leading-[1.08] text-foreground mb-6 tracking-tight">
            Understand{" "}
            <span className="text-brand relative">
              Nigerian Stocks.
              <svg className="absolute -bottom-2 left-0 w-full h-3 text-brand/30" viewBox="0 0 300 12" preserveAspectRatio="none">
                <path d="M0 8 Q75 0 150 8 Q225 16 300 8" fill="none" stroke="currentColor" strokeWidth="3" />
              </svg>
            </span>
            <br />
            Invest Smarter.
          </h1>

          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Live NGX market data, AI-powered analysis, and Nigeria&apos;s most complete stock education platform — all in one place.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/auth/signin?callbackUrl=/dashboard">
              <Button size="lg" className="rounded-full bg-brand hover:bg-brand-dark text-white px-8 h-13 text-base shadow-lg shadow-brand/20 transition-all hover:shadow-xl hover:shadow-brand/30 hover:-translate-y-0.5">
                Get Started Free
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
              See what&apos;s inside <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Trust strip */}
          <div className="flex items-center justify-center gap-6 mt-8 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-brand" /> Free forever</span>
            <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-brand" /> No credit card</span>
            <span className="flex items-center gap-1.5"><BarChart2 className="w-3.5 h-3.5 text-brand" /> 150+ NGX stocks</span>
          </div>
        </div>

        {/* Mock dashboard preview */}
        <div className="mt-16 relative">
          {/* Glow behind card */}
          <div className="absolute inset-0 bg-brand/5 rounded-3xl blur-2xl scale-95 pointer-events-none" />

          <div className="relative bg-card border border-border rounded-2xl p-4 max-w-3xl mx-auto shadow-2xl">
            {/* Window chrome */}
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-400/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
              <div className="w-3 h-3 rounded-full bg-green-400/80" />
              <span className="ml-3 text-xs font-mono text-muted-foreground">NGX INTEL — DASHBOARD</span>
            </div>

            {/* Metric cards */}
            <div className="grid grid-cols-3 gap-3 mb-3">
              {[
                { label: "ASI VALUE", value: "200,913", change: "+0.32%", up: true },
                { label: "MKT CAP", value: "₦129T", change: "+0.28%", up: true },
                { label: "VOLUME", value: "523.4M", change: "-5.2%", up: false },
              ].map((stat) => (
                <div key={stat.label} className="bg-secondary/60 rounded-xl p-3">
                  <p className="text-[10px] font-mono text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-sm font-semibold text-foreground">{stat.value}</p>
                  <p className={`text-xs font-mono ${stat.up ? "text-gain" : "text-loss"}`}>{stat.change}</p>
                </div>
              ))}
            </div>

            {/* Movers */}
            <div className="bg-secondary/60 rounded-xl p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono text-muted-foreground">TOP MOVERS TODAY</span>
                <span className="text-[10px] font-mono text-brand">VIEW ALL →</span>
              </div>
              <div className="flex gap-2 flex-wrap">
                {TICKER_DATA.slice(0, 6).map((stock) => (
                  <div key={stock.ticker} className="flex items-center gap-1.5 bg-background/80 border border-border/50 rounded-lg px-2.5 py-1.5">
                    <span className="text-[11px] font-mono font-semibold text-foreground">{stock.ticker}</span>
                    <span className="text-[11px] font-mono text-muted-foreground">{stock.price}</span>
                    <span className={`text-[11px] font-mono font-semibold ${stock.up ? "text-gain" : "text-loss"}`}>
                      {stock.change}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Animated Marquee Ticker Strip */}
      <div className="border-t border-border bg-secondary/30">
        <Marquee speed={40} gradient={true} gradientColor="var(--background)" gradientWidth={80} pauseOnHover={true} className="py-3">
          {TICKER_DATA.map((stock, i) => (
            <div key={i} className="flex items-center gap-2.5 mx-6">
              <span className="text-sm font-mono font-semibold text-foreground">{stock.ticker}</span>
              <span className="text-sm font-mono text-muted-foreground">{stock.price}</span>
              <span className={`text-sm font-mono font-semibold flex items-center gap-0.5 ${stock.up ? "text-gain" : "text-loss"}`}>
                {stock.up ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                {stock.change}
              </span>
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  )
}
