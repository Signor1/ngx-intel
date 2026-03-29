import { NextRequest, NextResponse } from "next/server"
import { unstable_cache } from "next/cache"
import { getDataSource } from "@/lib/data-sources"
import { REVALIDATE } from "@/lib/cache"

export async function GET(_req: NextRequest, { params }: { params: Promise<{ ticker: string }> }) {
  const { ticker } = await params
  const upper = ticker.toUpperCase()

  try {
    const getCachedStock = unstable_cache(
      async () => {
        const source = await getDataSource()
        return source.getStock(upper)
      },
      [`stock-${upper}`],
      { revalidate: REVALIDATE.STOCK_DETAIL }
    )

    const data = await getCachedStock()
    if (!data) return NextResponse.json({ error: "Stock not found" }, { status: 404 })
    return NextResponse.json(data)
  } catch (err) {
    console.error(`[/api/stocks/${upper}]`, err)
    return NextResponse.json({ error: "Failed to fetch stock" }, { status: 500 })
  }
}
