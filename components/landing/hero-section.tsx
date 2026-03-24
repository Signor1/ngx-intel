"use client"

import { ArrowRight, TrendingUp, TrendingDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { signIn } from "next-auth/react"

const MOCK_MOVERS = [
  { ticker: "ZENITHBANK", price: "₦36.50", change: "+2.11%", up: true },
  { ticker: "MTNN", price: "₦270.00", change: "+1.85%", up: true },
  { ticker: "DANGCEM", price: "₦620.00", change: "-0.48%", up: false },
  { ticker: "GTCO", price: "₦58.90", change: "+3.20%", up: true },
  { ticker: "ACCESSCORP", price: "₦22.15", change: "-1.10%", up: false },
  { ticker: "AIRTELAFRI", price: "₦2,350.00", change: "+0.64%", up: true },
]

/**
 * Landing page hero section — dark background, headline, live ticker strip.
 */
export function HeroSection() {
  return (
    <section className="relative bg-[#0F1117] overflow-hidden">
      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#0A8A5A 1px, transparent 1px), linear-gradient(90deg, #0A8A5A 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 pt-20 pb-16">
        {/* Status badge */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-[#0A8A5A] border border-[#0A8A5A]/30 bg-[#0A8A5A]/10 rounded-full px-4 py-1.5">
            <span className="w-1.5 h-1.5 bg-[#0A8A5A] rounded-full animate-pulse" />
            <span>NGX ASI — 200,000+ POINTS • LIVE DATA</span>
          </div>
        </div>

        {/* Main headline */}
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="font-semibold text-5xl md:text-6xl lg:text-7xl leading-[1.1] text-white mb-6">
            Understand{" "}
            <span className="text-[#0A8A5A]">Nigerian Stocks.</span>
            <br />
            Invest Smarter.
          </h1>

          <p className="text-[#9CA3AF] text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Live NGX market data, AI-powered analysis, and Nigeria&apos;s most complete stock education platform — all
            in one place.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              className="rounded-full bg-[#0A8A5A] hover:bg-[#065E3C] text-white px-8 h-12 text-base"
            >
              Get Started Free — Sign in with Google
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          <p className="text-[#6B7280] text-sm mt-4 font-mono">FREE • NO CREDIT CARD • 200+ NGX STOCKS</p>
        </div>

        {/* Mock dashboard preview */}
        <div className="mt-16 relative">
          <div className="bg-[#1A1D23] border border-[#2D3139] rounded-2xl p-4 max-w-3xl mx-auto shadow-2xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-500/70" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <div className="w-3 h-3 rounded-full bg-green-500/70" />
              <span className="ml-3 text-xs font-mono text-[#6B7280]">NGX INTEL — DASHBOARD</span>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-3">
              {[
                { label: "ASI VALUE", value: "201,432.18", change: "+1.24%", up: true },
                { label: "MKT CAP", value: "₦56.2T", change: "+0.82%", up: true },
                { label: "VOLUME", value: "523.4M", change: "-3.1%", up: false },
              ].map((stat) => (
                <div key={stat.label} className="bg-[#0F1117] rounded-xl p-3">
                  <p className="text-[10px] font-mono text-[#6B7280] mb-1">{stat.label}</p>
                  <p className="text-sm font-semibold text-white">{stat.value}</p>
                  <p className={`text-xs font-mono ${stat.up ? "text-[#16A34A]" : "text-[#DC2626]"}`}>
                    {stat.change}
                  </p>
                </div>
              ))}
            </div>
            <div className="bg-[#0F1117] rounded-xl p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono text-[#6B7280]">TOP MOVERS TODAY</span>
                <span className="text-[10px] font-mono text-[#0A8A5A]">VIEW ALL →</span>
              </div>
              <div className="flex gap-2 flex-wrap">
                {MOCK_MOVERS.map((stock) => (
                  <div key={stock.ticker} className="flex items-center gap-1.5 bg-[#1A1D23] rounded-lg px-2 py-1">
                    <span className="text-[10px] font-mono text-white">{stock.ticker}</span>
                    <span className={`text-[10px] font-mono ${stock.up ? "text-[#16A34A]" : "text-[#DC2626]"}`}>
                      {stock.change}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Market Ticker Strip */}
      <div className="border-t border-[#2D3139] bg-[#0A0D12] py-3 overflow-hidden">
        <div className="flex animate-marquee gap-12 whitespace-nowrap">
          {[...MOCK_MOVERS, ...MOCK_MOVERS, ...MOCK_MOVERS].map((stock, i) => (
            <div key={i} className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-mono text-[#9CA3AF]">{stock.ticker}</span>
              <span className="text-xs font-mono text-white">{stock.price}</span>
              <span className={`text-xs font-mono flex items-center gap-0.5 ${stock.up ? "text-[#16A34A]" : "text-[#DC2626]"}`}>
                {stock.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {stock.change}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
