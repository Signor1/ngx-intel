import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Clock, Calendar, ChevronRight, Brain } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getAllAnalysisItems, getAnalysisItem } from "@/lib/mdx"
import { MDXRemote } from "next-mdx-remote/rsc"

export function generateStaticParams() {
  const items = getAllAnalysisItems()
  return items.map((item) => ({ slug: item.frontmatter.slug }))
}

export default async function AnalysisArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const item = getAnalysisItem(slug)
  if (!item) notFound()

  const { frontmatter, content } = item
  const allArticles = getAllAnalysisItems()
  const otherArticles = allArticles.filter((a) => a.frontmatter.slug !== slug).slice(0, 5)

  return (
    <div className="flex gap-8 max-w-7xl mx-auto">
      {/* Sidebar */}
      <aside className="hidden lg:block w-56 shrink-0">
        <div className="sticky top-24 space-y-4">
          <Link href="/dashboard/analysis" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> All Analysis
          </Link>
          {otherArticles.length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-2">More Articles</p>
              <nav className="space-y-1">
                {otherArticles.map((a) => (
                  <Link key={a.frontmatter.slug} href={`/dashboard/analysis/${a.frontmatter.slug}`}
                    className="block px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary rounded-md transition-colors">
                    {a.frontmatter.title.length > 45 ? a.frontmatter.title.slice(0, 45) + "..." : a.frontmatter.title}
                  </Link>
                ))}
              </nav>
            </div>
          )}
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0 max-w-3xl">
        {/* Mobile back */}
        <Link href="/dashboard/analysis" className="lg:hidden inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
          <ArrowLeft className="w-3.5 h-3.5" /> All Analysis
        </Link>

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Link href="/dashboard/analysis" className="hover:text-foreground transition-colors">Analysis</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-foreground truncate max-w-[200px]">{frontmatter.title}</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          {frontmatter.featured && <Badge className="mb-3 bg-brand/10 text-brand text-xs">Featured</Badge>}
          <h1 className="text-3xl font-bold mb-4">{frontmatter.title}</h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {new Date(frontmatter.date).toLocaleDateString("en-NG", { month: "long", day: "numeric", year: "numeric" })}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {frontmatter.readTime} min read
            </span>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {frontmatter.tags.map((tag) => <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>)}
          </div>
        </div>

        {/* Article */}
        <article className="mdx-content">
          <MDXRemote source={content} />
        </article>

        {/* Ask AI */}
        <div className="mt-10">
          <Link href="/dashboard/chat">
            <Button variant="outline" className="w-full gap-2 h-12 text-sm">
              <Brain className="w-4 h-4" /> Ask AI about this article
            </Button>
          </Link>
        </div>
      </main>
    </div>
  )
}
