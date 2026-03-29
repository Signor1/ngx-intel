import Link from "next/link"
import { Clock, Calendar, ChevronRight, FileText } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getAllAnalysisItems } from "@/lib/mdx"

export default function AnalysisPage() {
  const articles = getAllAnalysisItems()

  // Group by tag for sidebar
  const allTags = [...new Set(articles.flatMap((a) => a.frontmatter.tags))]
  const featured = articles.filter((a) => a.frontmatter.featured)

  return (
    <div className="flex gap-8 max-w-7xl mx-auto">
      {/* Sidebar */}
      <aside className="hidden lg:block w-56 shrink-0">
        <div className="sticky top-24 space-y-6">
          <div>
            <h2 className="font-semibold text-sm mb-1">Analysis</h2>
            <p className="text-sm text-muted-foreground">{articles.length} articles</p>
          </div>

          {featured.length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-2">Featured</p>
              <nav className="space-y-1">
                {featured.map((a) => (
                  <Link
                    key={a.frontmatter.slug}
                    href={`/dashboard/analysis/${a.frontmatter.slug}`}
                    className="block px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary rounded-md transition-colors"
                  >
                    {a.frontmatter.title.length > 40 ? a.frontmatter.title.slice(0, 40) + "..." : a.frontmatter.title}
                  </Link>
                ))}
              </nav>
            </div>
          )}

          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-2">Topics</p>
            <div className="flex flex-wrap gap-1.5">
              {allTags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">Market Analysis</h1>
          <p className="text-muted-foreground mt-1">
            In-depth analysis and commentary on the Nigerian stock market
          </p>
        </div>

        {articles.length > 0 ? (
          <div className="space-y-3">
            {articles.map((article) => {
              const { frontmatter } = article
              return (
                <Link key={frontmatter.slug} href={`/dashboard/analysis/${frontmatter.slug}`} className="block group">
                  <div className="flex items-start gap-4 px-5 py-5 rounded-xl border border-border hover:border-brand/40 hover:bg-secondary/30 transition-all">
                    <FileText className="w-5 h-5 text-brand shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {frontmatter.featured && (
                          <Badge className="bg-brand/10 text-brand text-xs">Featured</Badge>
                        )}
                      </div>
                      <h3 className="font-semibold text-[15px] group-hover:text-brand transition-colors mb-2">
                        {frontmatter.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(frontmatter.date).toLocaleDateString("en-NG", { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {frontmatter.readTime} min read
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {frontmatter.tags.slice(0, 4).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                        ))}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-brand transition-colors shrink-0 mt-1" />
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <FileText className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
            <p className="font-medium mb-1">No articles yet</p>
            <p className="text-sm text-muted-foreground">
              Analysis articles are coming soon. Check back for in-depth NGX market commentary.
            </p>
          </Card>
        )}
      </main>
    </div>
  )
}
