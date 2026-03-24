/**
 * Determines whether the Nigerian Exchange (NGX) is currently open.
 * NGX trades Monday–Friday, 10:00–14:30 WAT (UTC+1).
 */
export function isMarketOpen(): boolean {
  const now = new Date()
  const wat = new Date(now.toLocaleString("en-US", { timeZone: "Africa/Lagos" }))
  const day = wat.getDay()
  const hour = wat.getHours()
  const min = wat.getMinutes()
  const afterOpen = hour > 10 || (hour === 10 && min >= 0)
  const beforeClose = hour < 14 || (hour === 14 && min <= 30)
  return day >= 1 && day <= 5 && afterOpen && beforeClose
}

/**
 * Returns the number of minutes until market open or close.
 */
export function getMarketCountdown(): { label: string; minutes: number } {
  const now = new Date()
  const wat = new Date(now.toLocaleString("en-US", { timeZone: "Africa/Lagos" }))
  const hour = wat.getHours()
  const min = wat.getMinutes()

  if (isMarketOpen()) {
    const closeMinutes = 14 * 60 + 30
    const currentMinutes = hour * 60 + min
    return { label: "closes in", minutes: closeMinutes - currentMinutes }
  }

  const openMinutes = 10 * 60
  const currentMinutes = hour * 60 + min
  if (currentMinutes < openMinutes) {
    return { label: "opens in", minutes: openMinutes - currentMinutes }
  }
  // After close — opens next trading day
  return { label: "opens tomorrow at", minutes: 0 }
}
