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
        'relative inline-flex h-7 items-center gap-1.5 rounded-md px-2 text-[0.8rem] text-muted-foreground outline-none transition-colors duration-200 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring after:absolute after:inset-x-2 after:-bottom-px after:h-0.5 after:scale-x-0 after:rounded-full after:bg-primary after:transition-transform after:duration-300 after:ease-out-quart hover:after:scale-x-100 motion-reduce:after:transition-none',
        className,
      )}
      activeProps={{ className: 'font-medium text-foreground after:scale-x-100' }}
    >
      <Library className="size-3.5" aria-hidden />
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
