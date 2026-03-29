import Link from "next/link"

export function DashboardFooter() {
  return (
    <footer className="border-t border-border px-6 py-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} NGX Intel. Data provided for educational purposes only.
        </p>
        <div className="flex items-center gap-4">
          <Link href="/dashboard/learn" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            Learn
          </Link>
          <a href="https://ngxgroup.com" target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            NGX Group
          </a>
          <a href="https://sec.gov.ng" target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            SEC Nigeria
          </a>
        </div>
      </div>
    </footer>
  )
}
