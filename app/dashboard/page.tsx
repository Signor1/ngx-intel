import { ArrowUpRight, ArrowDownRight, TrendingUp, Activity, DollarSign, BarChart2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Data as of March 27, 2026 — sources: NGX Group, Nairametrics
const METRICS = [
  {
    label: "ASI Today",
    value: "200,913.06",
    change: "+632.44",
    changePercent: "+0.32%",
    up: true,
    icon: TrendingUp,
  },
  {
    label: "Market Cap",
    value: "₦129T",
    change: "+₦360B",
    changePercent: "+0.28%",
    up: true,
    icon: DollarSign,
  },
  {
    label: "Volume",
    value: "523.4M",
    change: "-41.2M",
    changePercent: "-7.3%",
    up: false,
    icon: Activity,
  },
  {
    label: "Advance/Decline",
    value: "38 / 14",
    change: "12 unchanged",
    changePercent: "",
    up: true,
    icon: BarChart2,
  },
]

const TOP_GAINERS = [
  { ticker: "ARADEL", name: "Aradel Holdings", price: "₦1,300.40", change: "+2.15%" },
  { ticker: "SEPLAT", name: "Seplat Energy", price: "₦9,099.90", change: "+1.83%" },
  { ticker: "ZENITHBANK", name: "Zenith Bank", price: "₦107.50", change: "+1.42%" },
  { ticker: "UBA", name: "United Bank for Africa", price: "₦35.50", change: "+1.43%" },
  { ticker: "GTCO", name: "Guaranty Trust", price: "₦111.00", change: "+0.91%" },
]

const TOP_LOSERS = [
  { ticker: "NB", name: "Nigerian Breweries", price: "₦71.95", change: "-1.85%" },
  { ticker: "BUACEMENT", name: "BUA Cement", price: "₦185.00", change: "-0.54%" },
  { ticker: "FBNH", name: "First Bank Holdings", price: "₦32.00", change: "-0.62%" },
  { ticker: "MTNN", name: "MTN Nigeria", price: "₦701.10", change: "-0.27%" },
  { ticker: "DANGCEM", name: "Dangote Cement", price: "₦810.00", change: "-0.12%" },
]

const SECTORS = [
  { name: "Banking", change: +2.1, size: "large" },
  { name: "Consumer Goods", change: -0.8, size: "large" },
  { name: "Oil & Gas", change: +1.2, size: "medium" },
  { name: "Industrial", change: -0.4, size: "medium" },
  { name: "Insurance", change: +0.3, size: "small" },
  { name: "Agriculture", change: +1.8, size: "small" },
  { name: "ICT", change: +0.9, size: "medium" },
  { name: "Real Estate", change: -0.2, size: "small" },
  { name: "Conglomerates", change: +0.5, size: "small" },
  { name: "Services", change: -0.6, size: "small" },
  { name: "Healthcare", change: +0.1, size: "small" },
]

const UPCOMING_DIVIDENDS = [
  { ticker: "ZENITHBANK", name: "Zenith Bank", amount: "₦4.00/share", exDate: "Apr 3, 2026", yield: "10.96%" },
  { ticker: "GTCO", name: "Guaranty Trust", amount: "₦3.50/share", exDate: "Apr 10, 2026", yield: "5.94%" },
  { ticker: "NASCON", name: "NASCON Allied", amount: "₦2.20/share", exDate: "Apr 18, 2026", yield: "6.12%" },
]

export default function DashboardPage() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-semibold">Market Overview</h1>
        <p className="text-sm text-muted-foreground mt-1">Nigerian Exchange Group — as of today&apos;s close</p>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {METRICS.map((m) => {
          const Icon = m.icon
          return (
            <Card key={m.label} className="p-5">
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs font-mono text-muted-foreground">{m.label}</span>
                <Icon className="w-4 h-4 text-muted-foreground" />
              </div>
              <p className="text-xl font-semibold mb-1">{m.value}</p>
              <div className="flex items-center gap-1">
                {m.changePercent && (
                  <>
                    {m.up ? (
                      <ArrowUpRight className="w-3 h-3 text-gain" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3 text-loss" />
                    )}
                    <span className={`text-xs font-mono ${m.up ? "text-gain" : "text-loss"}`}>
                      {m.changePercent}
                    </span>
                  </>
                )}
                <span className="text-xs text-muted-foreground">{m.change}</span>
              </div>
            </Card>
          )
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Sector heatmap */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Sector Performance</h2>
            <span className="text-xs font-mono text-muted-foreground">TODAY</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {SECTORS.map((s) => (
              <div
                key={s.name}
                className={`flex flex-col gap-1 rounded-xl px-4 py-3 border ${
                  s.size === "large" ? "basis-[calc(50%-4px)]" : s.size === "medium" ? "basis-[calc(33%-4px)]" : "basis-[calc(20%-4px)]"
                } ${
                  s.change > 0
                    ? "bg-gain/10 border-gain/20 text-gain"
                    : "bg-loss/10 border-loss/20 text-loss"
                }`}
              >
                <span className="text-xs font-medium truncate">{s.name}</span>
                <span className="text-xs font-mono font-semibold">
                  {s.change > 0 ? "+" : ""}
                  {s.change.toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming dividends */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Upcoming Ex-Dates</h2>
            <a href="/dashboard/dividends" className="text-xs font-mono text-brand hover:underline">
              VIEW ALL →
            </a>
          </div>
          <div className="space-y-3">
            {UPCOMING_DIVIDENDS.map((d) => (
              <Card key={d.ticker} className="p-4">
                <div className="flex items-start justify-between mb-1">
                  <span className="text-xs font-mono font-semibold text-brand">{d.ticker}</span>
                  <Badge variant="secondary" className="text-[10px] font-mono">
                    {d.yield} yield
                  </Badge>
                </div>
                <p className="text-sm font-medium mb-1">{d.amount}</p>
                <p className="text-xs text-muted-foreground">Ex-date: {d.exDate}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Movers */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Gainers */}
        <div>
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gain" />
            Top Gainers
          </h2>
          <Card>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs font-mono text-muted-foreground px-4 py-3">TICKER</th>
                  <th className="text-left text-xs font-mono text-muted-foreground px-4 py-3 hidden sm:table-cell">COMPANY</th>
                  <th className="text-right text-xs font-mono text-muted-foreground px-4 py-3">PRICE</th>
                  <th className="text-right text-xs font-mono text-muted-foreground px-4 py-3">CHANGE</th>
                </tr>
              </thead>
              <tbody>
                {TOP_GAINERS.map((s) => (
                  <tr key={s.ticker} className="border-b border-border/50 last:border-0 hover:bg-secondary/30 transition-colors">
                    <td className="px-4 py-3 font-mono font-semibold text-xs">{s.ticker}</td>
                    <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell truncate max-w-[120px]">{s.name}</td>
                    <td className="px-4 py-3 text-right font-mono">{s.price}</td>
                    <td className="px-4 py-3 text-right font-mono text-gain font-semibold">{s.change}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>

        {/* Losers */}
        <div>
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-loss" />
            Top Losers
          </h2>
          <Card>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs font-mono text-muted-foreground px-4 py-3">TICKER</th>
                  <th className="text-left text-xs font-mono text-muted-foreground px-4 py-3 hidden sm:table-cell">COMPANY</th>
                  <th className="text-right text-xs font-mono text-muted-foreground px-4 py-3">PRICE</th>
                  <th className="text-right text-xs font-mono text-muted-foreground px-4 py-3">CHANGE</th>
                </tr>
              </thead>
              <tbody>
                {TOP_LOSERS.map((s) => (
                  <tr key={s.ticker} className="border-b border-border/50 last:border-0 hover:bg-secondary/30 transition-colors">
                    <td className="px-4 py-3 font-mono font-semibold text-xs">{s.ticker}</td>
                    <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell truncate max-w-[120px]">{s.name}</td>
                    <td className="px-4 py-3 text-right font-mono">{s.price}</td>
                    <td className="px-4 py-3 text-right font-mono text-loss font-semibold">{s.change}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      </div>
    </div>
  )
}
