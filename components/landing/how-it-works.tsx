import { LogIn, LayoutDashboard, MessageSquare } from "lucide-react"

const STEPS = [
  {
    step: "01",
    icon: LogIn,
    title: "Sign in with Google",
    description:
      "One click. No forms, no credit card, no verification email. Your Google account is all you need to get started.",
  },
  {
    step: "02",
    icon: LayoutDashboard,
    title: "Explore live market data",
    description:
      "Your dashboard shows the ASI index, sector performance, top movers, and dividend calendar — updated in real time during NGX trading hours.",
  },
  {
    step: "03",
    icon: MessageSquare,
    title: "Ask the AI anything",
    description:
      "Open the AI chat and ask anything from 'What is Zenith Bank's dividend yield?' to 'Compare NASCON and Dangote Sugar' — in plain English.",
  },
]

/**
 * Landing page how-it-works section — 3-step horizontal flow.
 */
export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-secondary/20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-xs font-mono text-muted-foreground tracking-wider">◆ GETTING_STARTED</span>
          <h2 className="font-semibold text-4xl md:text-5xl mt-4">Up and running in 60 seconds</h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            No setup. No waiting. The full NGX Intel platform is one Google sign-in away.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connecting line (desktop only) */}
          <div className="hidden md:block absolute top-10 left-[calc(33.3%+1rem)] right-[calc(33.3%+1rem)] h-px bg-border" />
          <div className="hidden md:block absolute top-10 left-[calc(66.6%+1rem)] right-4 h-px bg-border" />

          {STEPS.map((step) => {
            const Icon = step.icon
            return (
              <div key={step.step} className="flex flex-col items-center text-center">
                {/* Step number + icon */}
                <div className="relative mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-card border border-border flex items-center justify-center shadow-sm">
                    <Icon className="w-8 h-8 text-brand" />
                  </div>
                  <span className="absolute -top-2 -right-2 text-xs font-mono font-semibold bg-brand text-white rounded-full w-6 h-6 flex items-center justify-center">
                    {step.step}
                  </span>
                </div>

                <h3 className="font-semibold text-lg mb-3">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">{step.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
