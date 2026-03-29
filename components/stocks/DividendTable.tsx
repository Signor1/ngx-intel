import { Badge } from "@/components/ui/badge"
import type { DividendRecord } from "@/types/market"

interface DividendTableProps {
  dividends: DividendRecord[]
}

export function DividendTable({ dividends }: DividendTableProps) {
  if (dividends.length === 0) {
    return <p className="text-sm text-muted-foreground py-4">No dividend history available</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left text-xs font-mono text-muted-foreground px-3 py-2">YEAR</th>
            <th className="text-left text-xs font-mono text-muted-foreground px-3 py-2">TYPE</th>
            <th className="text-right text-xs font-mono text-muted-foreground px-3 py-2">PER SHARE (₦)</th>
            <th className="text-right text-xs font-mono text-muted-foreground px-3 py-2">EX-DATE</th>
          </tr>
        </thead>
        <tbody>
          {dividends.map((d, i) => (
            <tr key={i} className="border-b border-border/50 last:border-0">
              <td className="px-3 py-2 font-mono">{d.financialYear}</td>
              <td className="px-3 py-2">
                <Badge variant="secondary" className="text-[10px]">{d.type}</Badge>
              </td>
              <td className="px-3 py-2 text-right font-mono font-semibold">
                {d.dividendPerShare.toFixed(2)}
              </td>
              <td className="px-3 py-2 text-right font-mono text-muted-foreground">
                {new Date(d.exDividendDate).toLocaleDateString("en-NG", {
                  month: "short", day: "numeric", year: "numeric",
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
