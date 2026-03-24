"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart2, BookOpen, Brain, Calendar, LayoutDashboard, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"

const MOBILE_NAV = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Home" },
  { href: "/dashboard/stocks", icon: TrendingUp, label: "Stocks" },
  { href: "/dashboard/dividends", icon: Calendar, label: "Dividends" },
  { href: "/dashboard/sectors", icon: BarChart2, label: "Sectors" },
  { href: "/dashboard/learn", icon: BookOpen, label: "Learn" },
  { href: "/dashboard/chat", icon: Brain, label: "AI" },
]

/**
 * Mobile bottom navigation bar — 6 primary destinations.
 */
export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 bg-sidebar border-t border-sidebar-border z-50">
      <div className="flex">
        {MOBILE_NAV.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex-1 flex flex-col items-center gap-1 py-3 text-[10px] font-medium transition-colors",
                active ? "text-brand" : "text-sidebar-foreground/50"
              )}
            >
              <Icon className="w-5 h-5" />
              {label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
