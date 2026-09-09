import { Toaster } from '@/components/ui/sonner'
import { useTheme } from '../hooks/use-theme'

/**
 * `<Toaster>` do sonner amarrado ao tema resolvido da app (o componente base em
 * `components/ui` é agnóstico de tema; a ligação com a store vive aqui, na
 * feature).
 */
export function AppToaster() {
  const { theme } = useTheme()

  return (
    <Toaster
      theme={theme}
      position="bottom-right"
      closeButton
      toastOptions={{ duration: 4000 }}
    />
  )
}
