import { useState, type ComponentProps } from 'react'
import { BookOpen } from 'lucide-react'
import { tv, type VariantProps } from 'tailwind-variants'
import { twMerge } from 'tailwind-merge'
import type { Book } from '@/types/book'

const cover = tv({
  base: 'relative flex shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-muted text-muted-foreground',
  variants: {
    size: {
      sm: 'h-24 w-16 [&_svg]:size-5',
      md: 'h-40 w-28 [&_svg]:size-7',
      lg: 'h-60 w-40 [&_svg]:size-10',
    },
  },
  defaultVariants: { size: 'md' },
})

export interface BookCoverProps
  extends Omit<ComponentProps<'div'>, 'children'>,
    VariantProps<typeof cover> {
  book: Pick<Book, 'title' | 'thumbnail'>
}

export function BookCover({ book, size, className, ...props }: BookCoverProps) {
  const [failed, setFailed] = useState(false)
  const showImage = book.thumbnail != null && !failed

  return (
    <div
      data-slot="book-cover"
      data-placeholder={showImage ? undefined : ''}
      className={twMerge(cover({ size }), className)}
      {...props}
    >
      {showImage ? (
        <img
          src={book.thumbnail ?? undefined}
          alt={`Capa de ${book.title}`}
          loading="lazy"
          className="h-full w-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <BookOpen aria-hidden />
      )}
    </div>
  )
}
