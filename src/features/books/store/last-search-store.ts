import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { PrintType, SortOrder } from '../types/search'

export interface LastSearch {
  q?: string
  printType?: PrintType
  orderBy?: SortOrder
}

interface LastSearchStore {
  search: LastSearch
  remember: (search: LastSearch) => void
}

function compact(search: LastSearch): LastSearch {
  const next: LastSearch = {}
  if (search.q) next.q = search.q
  if (search.printType) next.printType = search.printType
  if (search.orderBy) next.orderBy = search.orderBy
  return next
}

export const useLastSearchStore = create<LastSearchStore>()(
  persist(
    (set) => ({
      search: {},
      remember: (search) => set({ search: compact(search) }),
    }),
    {
      name: 'libris:last-search',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ search: state.search }),
    },
  ),
)

export function useLastSearch(): LastSearch {
  return useLastSearchStore((state) => state.search)
}
