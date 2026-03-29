import { Search } from "lucide-react"
import { getAllGlossaryItems } from "@/lib/mdx"
import { LearnClient } from "./learn-client"

export default function LearnPage() {
  const items = getAllGlossaryItems()

  return <LearnClient items={items.map((i) => i.frontmatter)} />
}
