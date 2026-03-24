"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

const FAQS = [
  {
    q: "Who is NGX Intel for?",
    a: "Anyone interested in the Nigerian stock market — from a complete beginner who has never bought a share, to an active retail investor managing a real portfolio. The platform is built to serve both with the same clean interface.",
  },
  {
    q: "Is it free to use?",
    a: "Yes. The core platform — live market data, stock screener, dividend tracker, sector analysis, and the knowledge hub — is completely free. The AI chat requires your own Anthropic API key (you get $5 free credit when you sign up at console.anthropic.com).",
  },
  {
    q: "How accurate is the market data?",
    a: "Market data is sourced from NGX-approved data providers and refreshed every 5 minutes during trading hours (10:00–14:30 WAT, Monday–Friday). Outside trading hours, data reflects the previous session's close. Always verify critical prices on your broker's app before executing a trade.",
  },
  {
    q: "Is my API key safe? Do you store it?",
    a: "Your Anthropic API key is never sent to our servers. It lives only in your browser's memory for the current session. When you close the tab, it's gone. Every AI request goes directly from your browser to Anthropic — we never see it.",
  },
  {
    q: "How do I start investing on the NGX?",
    a: "You'll need a CSCS (Central Securities Clearing System) account, which you open through a licensed stockbroker. NGX Intel has a full step-by-step guide in the Knowledge Hub under 'Getting Started'. The AI assistant can also walk you through the process.",
  },
]

/**
 * Landing page FAQ section — accordion-style, client component for open/close state.
 */
export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section id="faq" className="py-24">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-xs font-mono text-muted-foreground tracking-wider">◆ FAQ</span>
          <h2 className="font-semibold text-4xl md:text-5xl mt-4">Common questions</h2>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div key={i} className="bg-card border border-border rounded-2xl overflow-hidden">
              <button
                className="w-full flex items-center justify-between px-6 py-5 text-left"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <span className="font-medium pr-4">{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-muted-foreground shrink-0 transition-transform duration-200 ${
                    openIndex === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openIndex === i && (
                <div className="px-6 pb-5">
                  <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
