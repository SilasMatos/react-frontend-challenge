import type { ReactNode } from 'react'
import { QueryProvider } from '@/providers/query-provider'
import { AppToaster, ThemeProvider } from '@/features/theme'

export interface AppProvidersProps {
  children: ReactNode
}

/**
 * Composição única dos providers globais (React Query, tema, Router...).
 * Novos providers entram só aqui — `app.tsx` e os testes consomem este wrapper.
 */
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryProvider>
      <ThemeProvider>
        {children}
        <AppToaster />
      </ThemeProvider>
    </QueryProvider>
  )
}
