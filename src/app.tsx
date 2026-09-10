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

function RoutedApp() {
  const queryClient = useQueryClient()
  return <RouterProvider router={router} context={{ queryClient }} />
}
