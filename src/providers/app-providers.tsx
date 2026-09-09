import type { ReactNode } from 'react'

export interface AppProvidersProps {
  children: ReactNode
}

/**
 * Composição única dos providers globais (React Query, tema, Router...).
 * Novos providers entram só aqui — `app.tsx` e os testes consomem este wrapper.
 */
export function AppProviders({ children }: AppProvidersProps) {
  return <>{children}</>
}
