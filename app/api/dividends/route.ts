import { NextRequest, NextResponse } from "next/server"
import { unstable_cache } from "next/cache"
import { getDataSource } from "@/lib/data-sources"
import { REVALIDATE } from "@/lib/cache"

const getCachedDividends = unstable_cache(
  async () => {
    const source = await getDataSource()
    return source.getDividends()
  },
  ["dividends-all"],
  { revalidate: REVALIDATE.DIVIDENDS }
)

export async function GET(req: NextRequest) {
  const ticker = req.nextUrl.searchParams.get("ticker")

  try {
    const allDividends = await getCachedDividends()

    // Filter by ticker if provided
    const data = ticker
      ? allDividends.filter((d) => d.ticker === ticker.toUpperCase())
      : allDividends

    return NextResponse.json(data)
  } catch (err) {
    console.error("[/api/dividends]", err)
    return NextResponse.json({ error: "Failed to fetch dividends" }, { status: 500 })
  }
}
