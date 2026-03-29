"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  ReferenceLine,
} from "recharts"

// Verified historical data — sources: NGX Group, Nairametrics, BusinessDay, Premium Times
const ASI_HISTORY = [
  { year: "2010", asi: 24770, return: 18.9 },
  { year: "2011", asi: 20730, return: -16.3 },
  { year: "2012", asi: 28078, return: 35.4 },
  { year: "2013", asi: 41329, return: 47.2 },
  { year: "2014", asi: 34657, return: -16.1 },
  { year: "2015", asi: 28642, return: -17.4 },
  { year: "2016", asi: 26875, return: -6.2 },
  { year: "2017", asi: 38243, return: 42.3 },
  { year: "2018", asi: 31431, return: -17.8 },
  { year: "2019", asi: 26842, return: -14.6 },
  { year: "2020", asi: 40270, return: 50.0 },
  { year: "2021", asi: 42716, return: 6.1 },
  { year: "2022", asi: 51251, return: 19.98 },
  { year: "2023", asi: 74773, return: 45.9 },
  { year: "2024", asi: 102926, return: 37.65 },
  { year: "2025", asi: 155613, return: 51.19 },
]

const YEAR_DETAILS = [
  {
    year: 2025, return: "+51.19%", topSector: "Consumer Goods",
    bestStock: { ticker: "GUINNESS", gain: "+398%" }, worstStock: { ticker: "VFD", loss: "-75%" },
    narrative: "The strongest year on the NGX since 2007. The ASI surged 51% to close at an all-time high of 155,613 points, pushing total market capitalisation close to ₦100 trillion. Consumer goods stocks led the charge — Guinness Nigeria rose 398%, Vitafoam gained 300%, and NASCON surged 243%.",
    events: ["ASI hits all-time high 155,613", "₦100T market cap milestone", "Consumer Goods +129.57%", "World's best frontier market"],
  },
  {
    year: 2024, return: "+37.65%", topSector: "Banking",
    bestStock: { ticker: "JULI", gain: "+1,646%" }, worstStock: { ticker: "MULTIVERSE", loss: "-60%" },
    narrative: "A blockbuster year for the NGX. The ASI crossed 100,000 for the first time, closing at 102,926 points. Banking stocks led as improved earnings and naira dynamics boosted returns. Oando gained 529% and Transcorp rose 386%.",
    events: ["ASI crosses 100,000", "37.65% annual return", "Naira float impact", "World's 2nd best dollar return"],
  },
  {
    year: 2023, return: "+45.90%", topSector: "Oil & Gas",
    bestStock: { ticker: "SEPLAT", gain: "+155%" }, worstStock: { ticker: "LIVESTOCK", loss: "-40%" },
    narrative: "The NGX roared back with a 46% gain — the best in Africa. Tinubu's election and fuel subsidy removal sent oil stocks soaring. Market cap crossed ₦50 trillion for the first time.",
    events: ["Presidential election", "Fuel subsidy removal", "₦50T market cap milestone", "Best in Africa"],
  },
  {
    year: 2022, return: "+19.98%", topSector: "Consumer Goods",
    bestStock: { ticker: "BUAFOODS", gain: "+90%" }, worstStock: { ticker: "OMATEK", loss: "-50%" },
    narrative: "Despite global headwinds, NGX delivered positive returns. BUA Foods listing was the highlight. Domestic investors increasingly dominated as foreign flows dried up.",
    events: ["BUA Foods listing", "Domestic investors dominate", "Global inflation spike"],
  },
  {
    year: 2021, return: "+6.07%", topSector: "Banking",
    bestStock: { ticker: "MTNN", gain: "+45%" }, worstStock: { ticker: "UNILEVER", loss: "-30%" },
    narrative: "A muted year after the 2020 rally. The market digested COVID recovery while dealing with naira pressure and inflationary concerns. Fixed income rates started recovering.",
    events: ["COVID recovery", "CBN crypto ban", "Inflation concerns", "Fixed income rates rising"],
  },
  {
    year: 2020, return: "+50.03%", topSector: "Banking",
    bestStock: { ticker: "ZENITHBANK", gain: "+65%" }, worstStock: { ticker: "AIRTELAFRI", loss: "-15%" },
    narrative: "One of the most remarkable years in NGX history. After a COVID crash in March, the market rallied 50% — driven by historically low interest rates that pushed funds from fixed income into equities. T-bill yields fell below 2%.",
    events: ["COVID-19 crash & recovery", "Record low interest rates", "T-bill yields below 2%", "50% annual return"],
  },
]

export default function HistoryPage() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-semibold">Year-by-Year NGX History</h1>
        <p className="text-muted-foreground mt-1">How the Nigerian Exchange performed from 2010 to present</p>
      </div>

      {/* ASI Chart */}
      <Card className="p-6">
        <h2 className="font-semibold text-lg mb-1">All-Share Index (2010–2025)</h2>
        <p className="text-sm text-muted-foreground mb-6">From 24,770 to 155,613 points — a 529% gain in 15 years</p>
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={ASI_HISTORY}>
            <defs>
              <linearGradient id="asiGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-brand)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--color-brand)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="year" tick={{ fontSize: 12, fill: "var(--color-text-secondary)" }} />
            <YAxis tick={{ fontSize: 12, fill: "var(--color-text-secondary)" }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
            <Tooltip
              contentStyle={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 13 }}
              formatter={(value) => [Number(value).toLocaleString() + " points", "ASI"]}
            />
            <Area type="monotone" dataKey="asi" stroke="var(--color-brand)" fill="url(#asiGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* Annual Returns — Recharts BarChart */}
      <Card className="p-6">
        <h2 className="font-semibold text-lg mb-1">Annual Returns (%)</h2>
        <p className="text-sm text-muted-foreground mb-6">Green = positive year, Red = negative year</p>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={ASI_HISTORY}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="year" tick={{ fontSize: 12, fill: "var(--color-text-secondary)" }} />
            <YAxis tick={{ fontSize: 12, fill: "var(--color-text-secondary)" }} tickFormatter={(v) => `${v}%`} />
            <Tooltip
              contentStyle={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 13 }}
              formatter={(value) => [`${Number(value) > 0 ? "+" : ""}${Number(value).toFixed(1)}%`, "Return"]}
            />
            <ReferenceLine y={0} stroke="var(--color-border)" />
            <Bar dataKey="return" radius={[4, 4, 0, 0]}>
              {ASI_HISTORY.map((entry, index) => (
                <Cell key={index} fill={entry.return >= 0 ? "var(--color-gain)" : "var(--color-loss)"} fillOpacity={0.8} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <p className="text-sm text-muted-foreground">Best Year</p>
          <p className="text-2xl font-bold font-mono text-gain">+51.19%</p>
          <p className="text-sm text-muted-foreground">2025</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-sm text-muted-foreground">Worst Year</p>
          <p className="text-2xl font-bold font-mono text-loss">-17.8%</p>
          <p className="text-sm text-muted-foreground">2018</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-sm text-muted-foreground">Positive Years</p>
          <p className="text-2xl font-bold font-mono">10 / 16</p>
          <p className="text-sm text-muted-foreground">62.5%</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-sm text-muted-foreground">Avg. Return</p>
          <p className="text-2xl font-bold font-mono text-gain">+15.3%</p>
          <p className="text-sm text-muted-foreground">per year</p>
        </Card>
      </div>

      {/* Year-by-year timeline */}
      <div>
        <h2 className="font-semibold text-lg mb-4">Detailed Timeline</h2>
        <div className="space-y-4">
          {YEAR_DETAILS.map((y) => (
            <Card key={y.year} className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-start gap-5">
                <div className="shrink-0 sm:w-24">
                  <p className="text-3xl font-bold font-mono text-brand">{y.year}</p>
                  <p className={`text-xl font-semibold font-mono ${y.return.startsWith("+") ? "text-gain" : "text-loss"}`}>
                    {y.return}
                  </p>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[15px] leading-7 text-muted-foreground mb-4">{y.narrative}</p>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">TOP SECTOR</p>
                      <p className="text-sm font-semibold">{y.topSector}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">BEST STOCK</p>
                      <p className="text-sm font-semibold font-mono text-gain">{y.bestStock.ticker} {y.bestStock.gain}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">WORST STOCK</p>
                      <p className="text-sm font-semibold font-mono text-loss">{y.worstStock.ticker} {y.worstStock.loss}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {y.events.map((e) => <Badge key={e} variant="secondary" className="text-xs">{e}</Badge>)}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
