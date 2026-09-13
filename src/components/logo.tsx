import type { ComponentProps } from 'react'
import { BookOpen } from 'lucide-react'
import { twMerge } from 'tailwind-merge'

export interface LogoProps extends ComponentProps<'span'> {
  wordmark?: boolean
}

export function Logo({ wordmark = true, className, ...props }: LogoProps) {
  return (
    <span
      data-slot="logo"
      className={twMerge('inline-flex items-center gap-2', className)}
      {...props}
    >
      <span
        aria-hidden
        className="grid size-6 shrink-0 place-items-center rounded-md bg-primary text-primary-foreground"
      >
        <BookOpen className="size-3.5" strokeWidth={2.25} />
      </span>
      {wordmark ? (
        <span className="text-sm font-semibold tracking-tight">Libris</span>
      ) : null}
    </span>
  )
}
