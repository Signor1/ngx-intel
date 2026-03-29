import { Sidebar } from "@/components/layout/sidebar"
import { TopBar } from "@/components/layout/topbar"
import { MobileNav } from "@/components/layout/mobile-nav"
import { DashboardFooter } from "@/components/layout/dashboard-footer"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar — fixed, never scrolls */}
      <Sidebar />

      {/* Main area — topbar stays fixed, content scrolls */}
      <div className="flex flex-col flex-1 min-w-0 h-screen">
        <TopBar />
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 pb-8 min-h-[calc(100vh-10rem)]">
            {children}
          </div>
          <DashboardFooter />
        </main>
      </div>

      <MobileNav />
    </div>
  )
}
