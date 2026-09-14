import { BookmarkCheck, BookmarkPlus } from 'lucide-react'
import { type ComponentProps, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import type { Book } from '@/types/book'
import { useShelfToggle } from '../hooks/use-shelf-toggle'

export interface ShelfBookmarkButtonProps
  extends Omit<ComponentProps<'button'>, 'onClick' | 'children' | 'type'> {
  book: Book
}

const iconLayerClass =
  'col-start-1 row-start-1 size-4 transition-[opacity,scale,rotate] duration-slower ease-spring-soft motion-reduce:transition-none'

export function ShelfBookmarkButton({
  book,
  className,
  ...props
}: ShelfBookmarkButtonProps) {
  const { inShelf, label, toggle } = useShelfToggle(book)
  const [bursts, setBursts] = useState(0)

  function handleClick() {
    if (!inShelf) setBursts((count) => count + 1)
    toggle()
  }

  return (
    <button
      type="button"
      data-slot="shelf-bookmark-button"
      data-state={inShelf ? 'in' : 'out'}
      aria-pressed={inShelf}
      aria-label={label}
      title={label}
      onClick={handleClick}
      className={twMerge(
        'relative isolate grid size-8 place-items-center rounded-md border outline-none',
        'transition-[background-color,border-color,color,scale] duration-slower ease-out-quart hover-delay press',
        'focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50',
        'motion-reduce:transition-none',
        inShelf
          ? 'border-emerald-600/25 bg-emerald-500/12 text-emerald-700 hover:bg-emerald-500/20 dark:border-emerald-400/25 dark:bg-emerald-400/12 dark:text-emerald-300 dark:hover:bg-emerald-400/20'
          : 'border-border bg-background text-muted-foreground hover:border-ring/40 hover:bg-muted hover:text-foreground',
        className,
      )}
      {...props}
    >
      {bursts > 0 ? (
        <span
          key={bursts}
          aria-hidden="true"
          data-slot="shelf-bookmark-burst"
          className="pointer-events-none absolute inset-0 -z-10 animate-burst rounded-full border-2 border-emerald-500/60 motion-reduce:hidden"
        />
      ) : null}
      <BookmarkPlus
        aria-hidden="true"
        className={twMerge(
          iconLayerClass,
          inShelf ? 'scale-50 -rotate-30 opacity-0' : 'scale-100 rotate-0 opacity-100',
        )}
      />
      <BookmarkCheck
        aria-hidden="true"
        className={twMerge(
          iconLayerClass,
          inShelf ? 'scale-100 rotate-0 opacity-100' : 'scale-50 rotate-30 opacity-0',
        )}
      />
    </button>
  )
}
