import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, BookOpen, Brain, ChevronRight } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getAllGlossaryItems, getGlossaryItem } from "@/lib/mdx"
import { MDXRemote } from "next-mdx-remote/rsc"

const DIFFICULTY_COLORS = {
  beginner: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
  intermediate: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20",
  advanced: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20",
}

const CATEGORY_LABELS: Record<string, string> = {
  fundamentals: "Fundamentals",
  trading: "Trading",
  analysis: "Analysis",
  "market-structure": "Market Structure",
  "getting-started": "Getting Started",
}

export function generateStaticParams() {
  const items = getAllGlossaryItems()
  return items.map((item) => ({ slug: item.frontmatter.slug }))
}

export default async function LearnTermPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const item = getGlossaryItem(slug)
  if (!item) notFound()

  const { frontmatter, content } = item

  // Get other terms in same category for sidebar
  const allItems = getAllGlossaryItems()
  const sameCategory = allItems.filter((i) => i.frontmatter.category === frontmatter.category && i.frontmatter.slug !== slug)

  return (
    <div className="flex gap-8 max-w-7xl mx-auto">
      {/* Sidebar — other terms in same category */}
      <aside className="hidden lg:block w-56 shrink-0">
        <div className="sticky top-24 space-y-4 max-h-[calc(100vh-8rem)] overflow-y-auto pr-4">
          <Link href="/dashboard/learn" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> All Topics
          </Link>

          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-2">
              {CATEGORY_LABELS[frontmatter.category] || frontmatter.category}
            </p>
            <nav className="space-y-0.5">
              {sameCategory.map((i) => (
                <Link
                  key={i.frontmatter.slug}
                  href={`/learn/${i.frontmatter.slug}`}
                  className="block px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary rounded-md transition-colors"
                >
                  {i.frontmatter.title.replace(/^What is (a |an |the )?/i, "").replace(/\?$/, "")}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0 max-w-3xl">
        {/* Mobile back link */}
        <Link href="/dashboard/learn" className="lg:hidden inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
          <ArrowLeft className="w-3.5 h-3.5" /> Knowledge Hub
        </Link>

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Link href="/dashboard/learn" className="hover:text-foreground transition-colors">Learn</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-foreground">{CATEGORY_LABELS[frontmatter.category] || frontmatter.category}</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-3">{frontmatter.title}</h1>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className={`text-xs ${DIFFICULTY_COLORS[frontmatter.difficulty]}`}>
              {frontmatter.difficulty}
            </Badge>
            <Badge variant="secondary" className="text-xs">{CATEGORY_LABELS[frontmatter.category] || frontmatter.category}</Badge>
            <span className="text-xs text-muted-foreground">Updated {frontmatter.lastUpdated}</span>
          </div>
        </div>

        {/* Formula box */}
        {frontmatter.formula && (
          <div className="bg-brand/5 border border-brand/20 rounded-xl p-5 mb-6">
            <p className="text-xs text-muted-foreground font-medium mb-1 uppercase tracking-wide">Formula</p>
            <p className="font-mono text-lg font-semibold">{frontmatter.formula}</p>
          </div>
        )}

        {/* Example box */}
        {frontmatter.example && (
          <div className="bg-secondary rounded-xl p-5 mb-6 border border-border">
            <p className="text-xs text-brand font-medium mb-1 uppercase tracking-wide">Nigerian Example</p>
            <p className="text-sm leading-relaxed">{frontmatter.example}</p>
          </div>
        )}

        {/* MDX Content */}
        <article className="mdx-content">
          <MDXRemote source={content} />
        </article>

        {/* Related terms */}
        {frontmatter.related && frontmatter.related.length > 0 && (
          <div className="mt-10 pt-8 border-t border-border">
            <h3 className="font-semibold mb-4">Related Terms</h3>
            <div className="flex flex-wrap gap-2">
              {frontmatter.related.map((relSlug) => (
                <Link key={relSlug} href={`/learn/${relSlug}`}>
                  <Badge variant="secondary" className="text-sm cursor-pointer hover:bg-brand/10 hover:text-brand transition-colors px-3 py-1.5">
                    {relSlug.replace(/-/g, " ")}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Ask AI */}
        <div className="mt-8">
          <Link href="/dashboard/chat">
            <Button variant="outline" className="w-full gap-2 h-12 text-sm">
              <Brain className="w-4 h-4" />
              Ask AI about &quot;{frontmatter.title}&quot;
            </Button>
          </Link>
        </div>
      </main>
    </div>
  )
}
