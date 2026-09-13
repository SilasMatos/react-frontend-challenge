import { Library } from 'lucide-react'
import { NavLink } from '@/components/layout/nav-link'
import { useBookshelfStore } from '../store/bookshelf-store'

export interface ShelfNavLinkProps {
  className?: string
}

export function ShelfNavLink({ className }: ShelfNavLinkProps) {
  const count = useBookshelfStore((state) => state.items.length)

  return (
    <NavLink to="/estante" data-slot="shelf-nav-link" className={className}>
      <Library className="size-3.5" aria-hidden />
      Estante
      {count > 0 ? (
        <span
          key={count}
          className="rounded-full bg-foreground/10 px-1.5 text-[0.7rem] tabular-nums duration-200 ease-spring animate-in zoom-in-75 motion-reduce:animate-none"
        >
          {count}
        </span>
      ) : null}
    </NavLink>
  )
}
