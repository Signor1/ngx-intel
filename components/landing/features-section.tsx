import { BarChart2, BookOpen, Brain, Calendar, Clock, TrendingUp } from "lucide-react"

const FEATURES = [
  {
    icon: BarChart2,
    label: "MARKET_DASHBOARD",
    title: "Live Market Dashboard",
    description: "ASI index, sector heatmap, top gainers and losers — all updated in real time during NGX trading hours.",
  },
  {
    icon: TrendingUp,
    label: "STOCK_SCREENER",
    title: "Stock Screener",
    description: "Filter 200+ NGX stocks by sector, price range, P/E ratio, dividend yield, and 52-week performance.",
  },
  {
    icon: Calendar,
    label: "DIVIDEND_TRACKER",
    title: "Dividend Tracker",
    description: "Never miss an ex-dividend date. Full calendar view with dividend history and champion stocks ranked by yield.",
  },
  {
    icon: Brain,
    label: "AI_ASSISTANT",
    title: "AI Assistant",
    description:
      "A Claude-powered advisor laser-focused on NGX stocks. Ask anything from 'What is Zenith Bank's dividend yield?' to 'Compare NASCON and Dangote Sugar'.",
  },
  {
    icon: Clock,
    label: "MARKET_HISTORY",
    title: "Year-by-Year History",
    description: "Visual narrative of NGX from 2010 to 2026. Best stocks, worst performers, key events — each year told clearly.",
  },
  {
    icon: BookOpen,
    label: "KNOWLEDGE_HUB",
    title: "Knowledge Hub",
    description: "40+ glossary terms explained in plain Nigerian English. From 'What is a dividend?' to advanced sector rotation strategies.",
  },
]

/**
 * Landing page feature bento grid — 3×2 layout of core platform capabilities.
 */
export function FeaturesSection() {
  return (
    <section id="features" className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-start justify-between mb-16">
          <div>
            <span className="text-xs font-mono text-muted-foreground tracking-wider">◆ PLATFORM_MODULES</span>
            <h2 className="font-semibold text-4xl md:text-5xl mt-4 max-w-lg leading-tight">
              Everything you need to understand the NGX
            </h2>
          </div>
          <p className="text-muted-foreground text-sm max-w-xs hidden md:block">
            Covering 200+ NGX listed companies across 11 sectors and every board.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {FEATURES.map((feature) => {
            const Icon = feature.icon
            return (
              <div key={feature.label} className="bg-card border border-border rounded-2xl p-6">
                <div className="flex items-start justify-between mb-6">
                  <span className="text-xs font-mono text-muted-foreground">MODULE</span>
                  <span className="text-xs font-mono text-muted-foreground">{feature.label}</span>
                </div>
                <div className="bg-secondary/50 rounded-xl p-4 mb-6 flex items-center justify-center h-20">
                  <div className="w-12 h-12 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-brand" />
                  </div>
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            )
          })}
        </div>

        {/* Social proof strip */}
        <div className="mt-12 bg-secondary/30 rounded-2xl px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <span className="text-xs font-mono text-muted-foreground">◆ COVERAGE</span>
            <p className="font-semibold text-xl mt-1">200+ NGX Listed Companies</p>
            <p className="text-sm text-muted-foreground">Across 11 sectors and 3 boards — Premium, Main, and ASeM</p>
          </div>
          <div className="flex gap-8">
            {[
              { value: "11", label: "SECTORS" },
              { value: "200+", label: "STOCKS" },
              { value: "40+", label: "GLOSSARY TERMS" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-semibold text-2xl text-brand">{stat.value}</p>
                <p className="text-xs font-mono text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
