import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface WatchlistItem {
  ticker: string
  name: string
  sector: string
  addedAt: number
  note?: string
}

interface WatchlistStore {
  items: WatchlistItem[]
  addStock: (item: WatchlistItem) => void
  removeStock: (ticker: string) => void
  updateNote: (ticker: string, note: string) => void
  isWatching: (ticker: string) => boolean
  clear: () => void
}

/**
 * Zustand store for the personal watchlist.
 * Persisted to localStorage and cleared on sign-out.
 */
export const useWatchlistStore = create<WatchlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addStock: (item) =>
        set((state) => {
          if (state.items.find((i) => i.ticker === item.ticker)) return state
          return { items: [...state.items, item] }
        }),

      removeStock: (ticker) =>
        set((state) => ({ items: state.items.filter((i) => i.ticker !== ticker) })),

      updateNote: (ticker, note) =>
        set((state) => ({
          items: state.items.map((i) => (i.ticker === ticker ? { ...i, note } : i)),
        })),

      isWatching: (ticker) => !!get().items.find((i) => i.ticker === ticker),

      clear: () => set({ items: [] }),
    }),
    { name: "ngx-intel-watchlist" }
  )
)
