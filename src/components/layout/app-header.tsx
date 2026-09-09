import type { ComponentProps, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

export interface AppHeaderProps extends ComponentProps<'header'> {
  /** Ações à direita (ex.: alternar tema, sair). */
  actions?: ReactNode
}

/** Cabeçalho da área autenticada. Presentational — recebe as ações via prop. */
export function AppHeader({ actions, className, ...props }: AppHeaderProps) {
  return (
    <header
      data-slot="app-header"
      className={twMerge(
        'sticky top-0 z-10 flex h-14 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-sm sm:px-6',
        className,
      )}
      {...props}
    >
      <span className="text-sm font-semibold tracking-tight">Libris</span>
      {actions ? (
        <div className="flex items-center gap-1">{actions}</div>
      ) : null}
    </header>
  )
}
