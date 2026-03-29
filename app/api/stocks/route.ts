import { NextResponse } from "next/server"
import { unstable_cache } from "next/cache"
import { getDataSource } from "@/lib/data-sources"
import { REVALIDATE } from "@/lib/cache"

const getCachedStocks = unstable_cache(
  async () => {
    const source = await getDataSource()
    return source.getAllStocks()
  },
  ["stocks-list"],
  { revalidate: REVALIDATE.STOCKS_LIST }
)

export async function GET() {
  try {
    const data = await getCachedStocks()
    return NextResponse.json(data)
  } catch (err) {
    console.error("[/api/stocks]", err)
    return NextResponse.json({ error: "Failed to fetch stocks" }, { status: 500 })
  }
}
