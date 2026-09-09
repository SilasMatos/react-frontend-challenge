/* eslint-disable react-refresh/only-export-components */
import type { ReactElement, ReactNode } from 'react'
import { render, type RenderOptions } from '@testing-library/react'
import { AppProviders } from '@/providers/app-providers'

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
