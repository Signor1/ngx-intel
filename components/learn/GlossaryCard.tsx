import Link from "next/link"
import { BookOpen } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const DIFFICULTY_COLORS = {
  beginner: "bg-green-500/10 text-green-600 border-green-500/20",
  intermediate: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  advanced: "bg-red-500/10 text-red-600 border-red-500/20",
}

interface GlossaryCardProps {
  title: string
  slug: string
  category: string
  difficulty: "beginner" | "intermediate" | "advanced"
  formula?: string
}

export function GlossaryCard({ title, slug, category, difficulty, formula }: GlossaryCardProps) {
  return (
    <Link href={`/dashboard/learn/${slug}`}>
      <Card className="p-5 hover:border-brand/50 transition-colors h-full">
        <div className="flex items-start justify-between mb-3">
          <BookOpen className="w-5 h-5 text-brand shrink-0" />
          <Badge variant="outline" className={`text-[10px] ${DIFFICULTY_COLORS[difficulty]}`}>
            {difficulty}
          </Badge>
        </div>
        <h3 className="font-semibold text-sm mb-2">{title}</h3>
        <Badge variant="secondary" className="text-[10px] font-mono">{category}</Badge>
        {formula && (
          <p className="text-xs font-mono text-muted-foreground mt-2 bg-secondary/50 rounded px-2 py-1">
            {formula}
          </p>
        )}
      </Card>
    </Link>
  )
}
