import type { ComponentProps, ReactNode } from 'react'
import { Link } from '@tanstack/react-router'
import { twMerge } from 'tailwind-merge'

export interface AppHeaderProps extends ComponentProps<'header'> {
  nav?: ReactNode
  actions?: ReactNode
}

export function AppHeader({ nav, actions, className, ...props }: AppHeaderProps) {
  return (
    <header
      data-slot="app-header"
      className={twMerge(
        'sticky top-0 z-10 flex h-10 items-center justify-between gap-3 bg-background/80 px-4 backdrop-blur-sm duration-500 ease-out-quart animate-in fade-in slide-in-from-top-2 motion-reduce:animate-none sm:px-6',
        className,
      )}
      {...props}
    >
      <div className="flex min-w-0 items-center gap-2 sm:gap-4">
        <Link
          to="/"
          activeOptions={{ exact: true, includeSearch: false }}
          className="rounded-sm text-sm font-semibold tracking-tight outline-none transition-all duration-300 ease-out-quart hover:tracking-wider hover:text-primary focus-visible:ring-2 focus-visible:ring-ring"
        >
          Libris
        </Link>
        {nav ? <nav className="flex items-center gap-0.5">{nav}</nav> : null}
      </div>
      {actions ? (
        <div className="flex shrink-0 items-center gap-1">{actions}</div>
      ) : null}
    </header>
  )
}
