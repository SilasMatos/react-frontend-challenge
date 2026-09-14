import type { ReactNode } from 'react'
import { QueryProvider } from '@/providers/query-provider'
import { ThemeProvider } from '@/features/theme'

export interface AppProvidersProps {
  children: ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </QueryProvider>
  )
}
