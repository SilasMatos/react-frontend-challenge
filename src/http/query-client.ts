import { QueryClient } from '@tanstack/react-query'
import { HttpError } from '@/http/http-client'

const STALE_TIME = 5 * 60 * 1000
const GC_TIME = 30 * 60 * 1000
const MAX_RETRIES = 2

function shouldRetry(failureCount: number, error: unknown): boolean {
  if (error instanceof HttpError && error.status >= 400 && error.status < 500) {
    return false
  }
  return failureCount < MAX_RETRIES
}

export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: STALE_TIME,
        gcTime: GC_TIME,
        refetchOnWindowFocus: false,
        retry: shouldRetry,
      },
    },
  })
}
