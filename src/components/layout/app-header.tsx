import type { ComponentProps, ReactNode } from 'react'
import { Link } from '@tanstack/react-router'
import { twMerge } from 'tailwind-merge'
import { Logo } from '@/components/logo'
import { Separator } from '@/components/ui/separator'

export interface AppHeaderProps extends ComponentProps<'header'> {
  nav?: ReactNode
  actions?: ReactNode
}

export function AppHeader({ nav, actions, className, ...props }: AppHeaderProps) {
  return (
    <header
      data-slot="app-header"
      className={twMerge(
        'sticky top-0 z-10 flex h-(--header-height) items-center justify-between gap-3 bg-background/80 px-4 backdrop-blur-sm enter-drop sm:px-6',
        className,
      )}
      {...props}
    >
      <div className="flex min-w-0 items-center gap-3 sm:gap-4">
        <Link
          to="/"
          activeOptions={{ exact: true, includeSearch: false }}
          className="rounded-sm outline-none transition-all duration-slow hover:tracking-wider hover:text-primary focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Logo />
        </Link>
        {nav ? (
          <>
            <Separator
              orientation="vertical"
              className="h-4 data-vertical:self-center"
            />
            <nav className="flex items-center gap-0.5">{nav}</nav>
          </>
        ) : null}
      </div>
      {actions ? (
        <div className="flex shrink-0 items-center gap-1">{actions}</div>
      ) : null}
    </header>
  )
}
