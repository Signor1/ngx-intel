"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart2,
  BookOpen,
  Brain,
  Calendar,
  FileText,
  History,
  LayoutDashboard,
  LogOut,
  Star,
  TrendingUp,
} from "lucide-react"
import { signOut } from "next-auth/react"
import { cn } from "@/lib/utils"

const NAV_ITEMS = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/stocks", icon: TrendingUp, label: "Stocks" },
  { href: "/dashboard/dividends", icon: Calendar, label: "Dividends" },
  { href: "/dashboard/sectors", icon: BarChart2, label: "Sectors" },
  { href: "/dashboard/learn", icon: BookOpen, label: "Learn" },
  { href: "/dashboard/history", icon: History, label: "History" },
  { href: "/dashboard/analysis", icon: FileText, label: "Analysis" },
  { href: "/dashboard/chat", icon: Brain, label: "AI Chat" },
  { href: "/dashboard/watchlist", icon: Star, label: "Watchlist" },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden lg:flex flex-col w-60 bg-sidebar border-r border-sidebar-border h-screen shrink-0 sticky top-0">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 h-16 border-b border-sidebar-border">
        <div className="w-7 h-7 bg-brand rounded-md flex items-center justify-center shrink-0">
          <TrendingUp className="w-4 h-4 text-white" />
        </div>
        <span className="font-semibold text-sidebar-foreground text-base tracking-tight">NGX Intel</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-foreground"
                  : "text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
              {href === "/dashboard/chat" && (
                <span className="ml-auto text-[10px] font-mono bg-brand/20 text-brand px-1.5 py-0.5 rounded">AI</span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Sign out */}
      <div className="px-3 pb-4 border-t border-sidebar-border pt-4">
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          Sign out
        </button>
      </div>
    </aside>
  )
}
