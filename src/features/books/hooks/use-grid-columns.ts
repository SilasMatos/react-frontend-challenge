import { useSyncExternalStore } from 'react'

const BREAKPOINTS: ReadonlyArray<readonly [query: string, columns: number]> = [
  ['(min-width: 1280px)', 4],
  ['(min-width: 1024px)', 3],
  ['(min-width: 640px)', 2],
]

function readColumns(): number {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return 1
  for (const [query, columns] of BREAKPOINTS) {
    if (window.matchMedia(query).matches) return columns
  }
  return 1
}

function subscribe(onChange: () => void): () => void {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return () => {}
  const lists = BREAKPOINTS.map(([query]) => window.matchMedia(query))
  for (const list of lists) list.addEventListener('change', onChange)
  return () => {
    for (const list of lists) list.removeEventListener('change', onChange)
  }
}

export function useGridColumns(): number {
  return useSyncExternalStore(subscribe, readColumns, () => 1)
}
