"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search, BookOpen, ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import type { GlossaryFrontmatter } from "@/lib/mdx"

const CATEGORIES = [
  { value: "all", label: "All Topics" },
  { value: "getting-started", label: "Getting Started" },
  { value: "fundamentals", label: "Fundamentals" },
  { value: "trading", label: "Trading" },
  { value: "analysis", label: "Analysis" },
  { value: "market-structure", label: "Market Structure" },
]

const DIFFICULTY_COLORS = {
  beginner: "bg-green-500/10 text-green-700 dark:text-green-400",
  intermediate: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
  advanced: "bg-red-500/10 text-red-700 dark:text-red-400",
}

export function LearnClient({ items }: { items: GlossaryFrontmatter[] }) {
  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const pathname = usePathname()

  const grouped = useMemo(() => {
    const map: Record<string, GlossaryFrontmatter[]> = {}
    for (const item of items) {
      const cat = item.category
      if (!map[cat]) map[cat] = []
      map[cat].push(item)
    }
    return map
  }, [items])

  const filtered = useMemo(() => {
    let result = [...items]
    if (search) {
      const q = search.toLowerCase()
      result = result.filter((item) => item.title.toLowerCase().includes(q) || item.slug.toLowerCase().includes(q))
    }
    if (activeCategory !== "all") {
      result = result.filter((item) => item.category === activeCategory)
    }
    return result
  }, [items, search, activeCategory])

  return (
    <div className="flex gap-8 max-w-7xl mx-auto">
      {/* Sidebar TOC */}
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="sticky top-24 space-y-6 max-h-[calc(100vh-8rem)] overflow-y-auto pr-4">
          <div>
            <h2 className="font-semibold text-sm mb-3">Knowledge Hub</h2>
            <p className="text-sm text-muted-foreground mb-4">{items.length} terms</p>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8 h-8 text-sm" />
          </div>

          {/* Category nav */}
          <nav className="space-y-1">
            {CATEGORIES.map((cat) => {
              const count = cat.value === "all" ? items.length : (grouped[cat.value]?.length ?? 0)
              return (
                <button
                  key={cat.value}
                  onClick={() => setActiveCategory(cat.value)}
                  className={`flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeCategory === cat.value
                      ? "bg-brand/10 text-brand font-medium"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className="text-xs font-mono">{count}</span>
                </button>
              )
            })}
          </nav>

          {/* Quick links by category */}
          {activeCategory !== "all" && grouped[activeCategory] && (
            <div className="space-y-0.5 border-t border-border pt-4">
              <p className="text-xs text-muted-foreground font-medium mb-2 uppercase tracking-wide">In this section</p>
              {grouped[activeCategory].map((item) => (
                <Link
                  key={item.slug}
                  href={`/dashboard/learn/${item.slug}`}
                  className={`block px-3 py-1.5 text-sm rounded-md transition-colors ${
                    pathname === `/dashboard/learn/${item.slug}`
                      ? "bg-brand/10 text-brand font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  {item.title.replace(/^What is (a |an |the )?/i, "").replace(/\?$/, "")}
                </Link>
              ))}
            </div>
          )}
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">Knowledge Hub</h1>
          <p className="text-muted-foreground mt-1">
            Learn everything about the Nigerian stock market — plain English, real examples
          </p>
        </div>

        {/* Mobile search + filter */}
        <div className="lg:hidden space-y-3 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search for a term..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
          </div>
          <div className="flex gap-1 flex-wrap">
            {CATEGORIES.map((c) => (
              <button key={c.value} onClick={() => setActiveCategory(c.value)}
                className={`px-3 py-1.5 text-xs rounded-full font-medium transition-colors ${activeCategory === c.value ? "bg-brand text-white" : "bg-secondary text-muted-foreground"}`}>
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Term list */}
        {filtered.length > 0 ? (
          <div className="space-y-2">
            {filtered.map((item) => (
              <Link key={item.slug} href={`/dashboard/learn/${item.slug}`} className="block group">
                <div className="flex items-center gap-4 px-4 py-3.5 rounded-xl border border-border hover:border-brand/40 hover:bg-secondary/30 transition-all">
                  <BookOpen className="w-5 h-5 text-brand shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm group-hover:text-brand transition-colors">{item.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${DIFFICULTY_COLORS[item.difficulty]}`}>
                        {item.difficulty}
                      </span>
                      {item.formula && (
                        <span className="text-xs text-muted-foreground font-mono truncate max-w-[200px]">{item.formula}</span>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-brand transition-colors shrink-0" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <p className="font-medium mb-1">No terms found</p>
            <p className="text-sm">Try a different search or category</p>
          </div>
        )}
      </main>
    </div>
  )
}
