import { useCallback, useEffect, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { bookQueryOptions } from './book-query'

export const PREFETCH_INTENT_DELAY_MS = 150

export interface UsePrefetchBookResult {
  prefetch: (bookId: string) => void
  cancel: () => void
}

export function usePrefetchBook(): UsePrefetchBookResult {
  const queryClient = useQueryClient()
  const timer = useRef<number | null>(null)

  const cancel = useCallback(() => {
    if (timer.current != null) {
      window.clearTimeout(timer.current)
      timer.current = null
    }
  }, [])

  const prefetch = useCallback(
    (bookId: string) => {
      cancel()
      if (!bookId) return
      timer.current = window.setTimeout(() => {
        timer.current = null
        void queryClient.prefetchQuery(bookQueryOptions(bookId))
      }, PREFETCH_INTENT_DELAY_MS)
    },
    [queryClient, cancel],
  )

  useEffect(() => cancel, [cancel])

  return { prefetch, cancel }
}
