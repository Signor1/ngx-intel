import fs from "fs"
import path from "path"
import matter from "gray-matter"

const CONTENT_DIR = path.join(process.cwd(), "content")

export interface GlossaryFrontmatter {
  title: string
  slug: string
  category: "fundamentals" | "trading" | "analysis" | "market-structure" | "getting-started"
  difficulty: "beginner" | "intermediate" | "advanced"
  related: string[]
  formula?: string
  example?: string
  lastUpdated: string
}

export interface GlossaryItem {
  frontmatter: GlossaryFrontmatter
  content: string
}

export interface AnalysisFrontmatter {
  title: string
  slug: string
  date: string
  readTime: number
  tags: string[]
  featured: boolean
}

export interface AnalysisItem {
  frontmatter: AnalysisFrontmatter
  content: string
}

function readMDXFiles<T>(dir: string): { frontmatter: T; content: string }[] {
  const fullDir = path.join(CONTENT_DIR, dir)
  if (!fs.existsSync(fullDir)) return []

  const files = fs.readdirSync(fullDir).filter((f) => f.endsWith(".mdx"))
  return files.map((file) => {
    const raw = fs.readFileSync(path.join(fullDir, file), "utf-8")
    const { data, content } = matter(raw)
    return { frontmatter: data as T, content }
  })
}

// Learning order: difficulty first (beginner → intermediate → advanced),
// then category priority, then alphabetical within each group
const DIFFICULTY_ORDER: Record<string, number> = { beginner: 0, intermediate: 1, advanced: 2 }
const CATEGORY_ORDER: Record<string, number> = {
  "getting-started": 0,
  "fundamentals": 1,
  "market-structure": 2,
  "trading": 3,
  "analysis": 4,
}

export function getAllGlossaryItems(): GlossaryItem[] {
  return readMDXFiles<GlossaryFrontmatter>("glossary")
    .sort((a, b) => {
      const diffA = DIFFICULTY_ORDER[a.frontmatter.difficulty] ?? 9
      const diffB = DIFFICULTY_ORDER[b.frontmatter.difficulty] ?? 9
      if (diffA !== diffB) return diffA - diffB
      const catA = CATEGORY_ORDER[a.frontmatter.category] ?? 9
      const catB = CATEGORY_ORDER[b.frontmatter.category] ?? 9
      if (catA !== catB) return catA - catB
      return a.frontmatter.title.localeCompare(b.frontmatter.title)
    })
}

export function getGlossaryItem(slug: string): GlossaryItem | null {
  const items = getAllGlossaryItems()
  return items.find((item) => item.frontmatter.slug === slug) || null
}

export function getAllAnalysisItems(): AnalysisItem[] {
  return readMDXFiles<AnalysisFrontmatter>("analysis")
    .sort((a, b) => b.frontmatter.date.localeCompare(a.frontmatter.date))
}

export function getAnalysisItem(slug: string): AnalysisItem | null {
  const items = getAllAnalysisItems()
  return items.find((item) => item.frontmatter.slug === slug) || null
}
