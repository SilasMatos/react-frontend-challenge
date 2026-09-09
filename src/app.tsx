import { useQueryClient } from '@tanstack/react-query'
import { RouterProvider } from '@tanstack/react-router'
import { AppProviders } from '@/providers/app-providers'
import { router } from '@/router'

export function App() {
  return (
    <AppProviders>
      <RoutedApp />
    </AppProviders>
  )
}

/**
 * Fica sob o `QueryProvider` para pegar o `queryClient` já criado e passá-lo ao
 * contexto do router (loaders/prefetch usam o mesmo cache da UI).
 */
function RoutedApp() {
  const queryClient = useQueryClient()
  return <RouterProvider router={router} context={{ queryClient }} />
}
