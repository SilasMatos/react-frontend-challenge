import { BookOpen } from 'lucide-react'
import { tv, type VariantProps } from 'tailwind-variants'
import { twMerge } from 'tailwind-merge'
import { CoverImage, type CoverImageProps } from '@/components/cover-image'
import type { Book } from '@/types/book'
import {
  isGoogleBooksPlaceholder,
  sanitizeCoverUrl,
} from '@/utils/sanitize-cover-url'

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
  extends Omit<
      CoverImageProps,
      'src' | 'fallbackSrc' | 'alt' | 'sanitize' | 'reject' | 'fallback'
    >,
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
  const sharp = book.thumbnail ? sanitizeCoverUrl(book.thumbnail) : null
  const original = book.thumbnail
    ? sanitizeCoverUrl(book.thumbnail, { upgradeZoom: false })
    : null

  return (
    <CoverImage
      data-slot="book-cover"
      src={sharp}
      fallbackSrc={original}
      reject={isGoogleBooksPlaceholder}
      alt={`Capa de ${book.title}`}
      ratio={ratio}
      radius={radius}
      fit={fit}
      fallback={<BookOpen aria-hidden />}
      className={twMerge(cover({ size }), className)}
      {...props}
    />
  )
}
