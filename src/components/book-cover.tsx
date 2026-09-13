import { BookOpen } from 'lucide-react'
import { tv, type VariantProps } from 'tailwind-variants'
import { twMerge } from 'tailwind-merge'
import { CoverImage, type CoverImageProps } from '@/components/cover-image'
import type { Book } from '@/types/book'

const cover = tv({
  base: 'shrink-0 border border-border',
  variants: {
    size: {
      xs: 'h-15 w-10',
      sm: 'h-24 w-16',
      md: 'h-40 w-28',
      lg: 'h-60 w-40',
    },
  },
  defaultVariants: { size: 'md' },
})

export interface BookCoverProps
  extends Omit<CoverImageProps, 'src' | 'alt' | 'sanitize' | 'fallback'>,
    VariantProps<typeof cover> {
  book: Pick<Book, 'title' | 'thumbnail'>
}

export function BookCover({
  book,
  size,
  ratio = 'book',
  radius = 'sm',
  fit = 'contain',
  className,
  ...props
}: BookCoverProps) {
  return (
    <CoverImage
      data-slot="book-cover"
      src={book.thumbnail}
      alt={`Capa de ${book.title}`}
      sanitize
      ratio={ratio}
      radius={radius}
      fit={fit}
      fallback={<BookOpen aria-hidden />}
      className={twMerge(cover({ size }), className)}
      {...props}
    />
  )
}
