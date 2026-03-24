import type { NGXSector } from "./market"

export type DifficultyLevel = "beginner" | "intermediate" | "advanced"
export type ContentCategory = "fundamentals" | "trading" | "analysis" | "market-structure" | "getting-started"

export interface GlossaryFrontmatter {
  title: string
  slug: string
  category: ContentCategory
  difficulty: DifficultyLevel
  related: string[]
  formula?: string
  example?: string
  lastUpdated: string
}

export interface SectorFrontmatter {
  title: string
  slug: string
  icon: string
  color: string
  description: string
  topStocks: string[]
  sectorIndex: string
  lastUpdated: string
}

export interface AnalysisFrontmatter {
  title: string
  slug: string
  date: string
  readTime: number
  tags: string[]
  featured: boolean
  excerpt?: string
}

export interface GlossaryTerm extends GlossaryFrontmatter {
  content: string
}

export interface SectorProfile extends SectorFrontmatter {
  content: string
}

export interface AnalysisArticle extends AnalysisFrontmatter {
  content: string
}

export type { NGXSector }
