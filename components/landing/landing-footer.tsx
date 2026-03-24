import Link from "next/link"
import { TrendingUp } from "lucide-react"

const LINKS = [
  {
    heading: "Platform",
    items: [
      { label: "Market Dashboard", href: "/dashboard" },
      { label: "Stock Screener", href: "/dashboard/stocks" },
      { label: "Dividend Tracker", href: "/dashboard/dividends" },
      { label: "Sector Analysis", href: "/dashboard/sectors" },
      { label: "NGX History", href: "/dashboard/history" },
    ],
  },
  {
    heading: "Learn",
    items: [
      { label: "Knowledge Hub", href: "/dashboard/learn" },
      { label: "AI Assistant", href: "/dashboard/chat" },
      { label: "Analysis Articles", href: "/dashboard/analysis" },
    ],
  },
  {
    heading: "Resources",
    items: [
      { label: "NGX Group", href: "https://ngxgroup.com" },
      { label: "SEC Nigeria", href: "https://sec.gov.ng" },
      { label: "CSCS", href: "https://cscs.com.ng" },
      { label: "Anthropic Console", href: "https://console.anthropic.com" },
    ],
  },
]

/**
 * Landing page footer — branding, nav links, disclaimer.
 */
export function LandingFooter() {
  return (
    <footer className="border-t border-border bg-secondary/20">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 bg-brand rounded-md flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-lg tracking-tight">NGX Intel</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Nigeria&apos;s most complete stock market intelligence platform. Built for everyone from beginners to
              active investors.
            </p>
          </div>

          {/* Link columns */}
          {LINKS.map((col) => (
            <div key={col.heading}>
              <h4 className="text-xs font-mono text-muted-foreground tracking-wider mb-4">{col.heading}</h4>
              <ul className="space-y-3">
                {col.items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      {...(item.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} NGX Intel. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground text-center md:text-right max-w-md">
            Data provided for educational purposes only. Not financial advice. Always verify prices on NGX or your
            brokerage app before making investment decisions.
          </p>
        </div>
      </div>
    </footer>
  )
}
