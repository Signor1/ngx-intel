import { NextResponse } from "next/server"
import { unstable_cache } from "next/cache"
import { getDataSource } from "@/lib/data-sources"
import { REVALIDATE } from "@/lib/cache"

const getCachedSummary = unstable_cache(
  async () => {
    const source = await getDataSource()
    return source.getMarketSummary()
  },
  ["market-summary"],
  { revalidate: REVALIDATE.MARKET_SUMMARY }
)

export async function GET() {
  try {
    const data = await getCachedSummary()
    return NextResponse.json(data)
  } catch (err) {
    console.error("[/api/market/summary]", err)
    return NextResponse.json({ error: "Failed to fetch market summary" }, { status: 500 })
  }
}
