import { auth } from "@/auth"
import { ThemeToggle } from "@/components/layout/theme-toggle"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

/**
 * Dashboard top bar — market status, user avatar.
 * Server component so it can read the session without a client boundary.
 */
export async function TopBar() {
  const session = await auth()
  const user = session?.user

  const now = new Date()
  const wat = new Date(now.toLocaleString("en-US", { timeZone: "Africa/Lagos" }))
  const day = wat.getDay()
  const hour = wat.getHours()
  const min = wat.getMinutes()
  const isOpen =
    day >= 1 &&
    day <= 5 &&
    (hour > 10 || (hour === 10 && min >= 0)) &&
    (hour < 14 || (hour === 14 && min <= 30))

  return (
    <header className="h-16 border-b border-border flex items-center justify-between px-6 bg-background/95 backdrop-blur sticky top-0 z-40">
      {/* Market status */}
      <div className="flex items-center gap-3">
        <div
          className={`flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-full border ${
            isOpen
              ? "bg-gain/10 border-gain/30 text-gain"
              : "bg-muted border-border text-muted-foreground"
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${isOpen ? "bg-gain animate-pulse" : "bg-muted-foreground"}`} />
          {isOpen ? "MARKET OPEN" : "MARKET CLOSED"}
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        <ThemeToggle />
        {user && (
          <Avatar className="w-8 h-8">
            <AvatarImage src={user.image ?? undefined} alt={user.name ?? "User"} />
            <AvatarFallback className="bg-brand text-white text-xs font-semibold">
              {user.name?.charAt(0).toUpperCase() ?? "U"}
            </AvatarFallback>
          </Avatar>
        )}
      </div>
    </header>
  )
}
