import { type ComponentPropsWithoutRef, forwardRef } from 'react'
import { createLink } from '@tanstack/react-router'
import { twMerge } from 'tailwind-merge'

const NavAnchor = forwardRef<HTMLAnchorElement, ComponentPropsWithoutRef<'a'>>(
  function NavAnchor({ className, ...props }, ref) {
    return (
      <a
        ref={ref}
        data-slot="nav-link"
        className={twMerge(
          'inline-flex h-7 items-center gap-1.5 rounded-md px-2.5 text-[0.8rem] text-muted-foreground outline-none transition-colors duration-200 ease-out-quart',
          'hover:bg-muted/60 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring',
          'data-[status=active]:bg-muted data-[status=active]:font-medium data-[status=active]:text-foreground',
          className,
        )}
        {...props}
      />
    )
  },
)

export const NavLink = createLink(NavAnchor)
