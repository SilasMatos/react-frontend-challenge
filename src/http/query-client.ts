import { QueryClient } from '@tanstack/react-query'
import { HttpError } from '@/http/http-client'

const STALE_TIME = 5 * 60 * 1000
const GC_TIME = 30 * 60 * 1000
const MAX_RETRIES = 2

/** Erro de cliente (4xx) não muda ao repetir — só re-tenta rede/servidor. */
function shouldRetry(failureCount: number, error: unknown): boolean {
  if (error instanceof HttpError && error.status >= 400 && error.status < 500) {
    return false
  }
  return failureCount < MAX_RETRIES
}

/**
 * Nova instância por árvore de app (evita cache compartilhado entre testes e
 * entre reloads do HMR). `staleTime` alto porque catálogo de livros muda pouco.
 */
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
