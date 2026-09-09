/* eslint-disable react-refresh/only-export-components */
import type { ReactElement, ReactNode } from 'react'
import { render, type RenderOptions } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  createMemoryHistory,
  createRouter,
  RouterProvider,
} from '@tanstack/react-router'
import { AppProviders } from '@/providers/app-providers'
import { routeTree } from '@/routeTree.gen'

function Wrapper({ children }: { children: ReactNode }) {
  return <AppProviders>{children}</AppProviders>
}

/** `render` do Testing Library já embrulhado nos providers globais. */
export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) {
  return render(ui, { wrapper: Wrapper, ...options })
}

/** Cliente de teste sem retry — falhas propagam na hora. */
export function createTestQueryClient(): QueryClient {
  return new QueryClient({ defaultOptions: { queries: { retry: false } } })
}

/**
 * Monta a árvore real de rotas num `MemoryHistory` na `initialPath`. Para testes
 * de integração de tela (guard de rota, navegação, `Link`).
 */
export function renderRoute(initialPath = '/') {
  const queryClient = createTestQueryClient()
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: [initialPath] }),
    context: { queryClient },
  })

  const utils = render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  )

  return { ...utils, router, queryClient }
}
