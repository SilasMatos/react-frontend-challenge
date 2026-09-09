import { createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

/**
 * Instância única do router.
 *
 * O `queryClient` do contexto é um placeholder aqui e é injetado em runtime pelo
 * `<RouterProvider context={{ queryClient }}>` em `app.tsx` — o client real vive
 * num `useState` dentro do `QueryProvider`, então só existe depois da montagem.
 *
 * `defaultPreloadStaleTime: 0` deixa o cache do TanStack Query decidir o que
 * revalidar no preload, em vez de o router manter uma cópia própria.
 */
export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
  scrollRestoration: true,
  context: {
    queryClient: undefined!,
  },
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
