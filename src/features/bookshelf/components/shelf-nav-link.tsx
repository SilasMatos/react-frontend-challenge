import { Library } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { twMerge } from 'tailwind-merge'
import { useBookshelfStore } from '../store/bookshelf-store'

export interface ShelfNavLinkProps {
  className?: string
}

export function ShelfNavLink({ className }: ShelfNavLinkProps) {
  const count = useBookshelfStore((state) => state.items.length)

  return (
    <Link
      to="/estante"
      data-slot="shelf-nav-link"
      className={twMerge(
        'inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-sm text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring',
        className,
      )}
      activeProps={{ className: 'font-medium text-foreground' }}
    >
      <Library className="size-4" aria-hidden />
      Estante
      {count > 0 ? (
        <span
          key={count}
          className="rounded-full bg-muted px-1.5 text-xs tabular-nums text-muted-foreground duration-200 ease-spring animate-in zoom-in-75 motion-reduce:animate-none"
        >
          {count}
        </span>
      ) : null}
    </Link>
  )
}
