import type { ComponentProps, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

export interface AppHeaderProps extends ComponentProps<'header'> {
  /** Navegação principal, à esquerda (ex.: Descobrir, Estante). */
  nav?: ReactNode
  /** Ações à direita (ex.: alternar tema, sair). */
  actions?: ReactNode
}

/** Cabeçalho da área autenticada. Presentational — recebe nav e ações via prop. */
export function AppHeader({ nav, actions, className, ...props }: AppHeaderProps) {
  return (
    <header
      data-slot="app-header"
      className={twMerge(
        'sticky top-0 z-10 flex h-14 items-center justify-between gap-4 border-b border-border bg-background/80 px-4 backdrop-blur-sm sm:px-6',
        className,
      )}
      {...props}
    >
      <div className="flex min-w-0 items-center gap-1 sm:gap-3">
        <span className="text-sm font-semibold tracking-tight">Libris</span>
        {nav ? <nav className="flex items-center gap-0.5">{nav}</nav> : null}
      </div>
      {actions ? (
        <div className="flex shrink-0 items-center gap-1">{actions}</div>
      ) : null}
    </header>
  )
}
