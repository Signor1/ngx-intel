"use client"

import { Card } from "@/components/ui/card"

const PROMPT_GROUPS = [
  {
    category: "Getting Started",
    prompts: [
      "How do I buy my first Nigerian stock?",
      "What is a CSCS account and how do I get one?",
      "How much money do I need to start investing on NGX?",
    ],
  },
  {
    category: "Dividends",
    prompts: [
      "Which NGX stocks have the highest dividend yield?",
      "What is an ex-dividend date?",
      "Explain Zenith Bank's dividend history",
    ],
  },
  {
    category: "Analysis",
    prompts: [
      "Compare Zenith Bank and GTCO — which is better?",
      "Is Dangote Cement overvalued?",
      "What are the best blue chip stocks on NGX?",
    ],
  },
  {
    category: "Sectors",
    prompts: [
      "Which NGX sector performed best in 2025?",
      "What drives the banking sector on the NGX?",
      "Is the oil & gas sector a good investment now?",
    ],
  },
]

interface SuggestedPromptsProps {
  onSelect: (prompt: string) => void
}

export function SuggestedPrompts({ onSelect }: SuggestedPromptsProps) {
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {PROMPT_GROUPS.map((group) => (
        <Card key={group.category} className="p-4">
          <p className="text-xs font-mono text-muted-foreground mb-2">{group.category}</p>
          <div className="space-y-1.5">
            {group.prompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => onSelect(prompt)}
                className="block w-full text-left text-sm text-foreground hover:text-brand transition-colors py-1"
              >
                &quot;{prompt}&quot;
              </button>
            ))}
          </div>
        </Card>
      ))}
    </div>
  )
}
