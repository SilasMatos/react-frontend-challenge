import { Link } from '@tanstack/react-router'
import { twMerge } from 'tailwind-merge'
import type { Book } from '@/types/book'
import { getPublishedYear } from '@/utils/format-date'
import { BookCover } from './book-cover'

export interface BookCardProps {
  book: Book
  className?: string
}

function authorLine(authors: string[]): string {
  if (authors.length === 0) return 'Autor desconhecido'
  if (authors.length <= 2) return authors.join(' e ')
  return `${authors[0]} +${authors.length - 1}`
}

/** Item do grid de resultados. Leva ao detalhe (`/book/$bookId`). */
export function BookCard({ book, className }: BookCardProps) {
  const year = getPublishedYear(book.publishedDate)

  return (
    <Link
      to="/book/$bookId"
      params={{ bookId: book.id }}
      data-slot="book-card"
      className={twMerge(
        'group flex gap-3 rounded-lg border border-border bg-card p-3 text-left transition-colors',
        'hover:border-ring/40 hover:bg-muted/40',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        className,
      )}
    >
      <BookCover book={book} size="sm" />

      <div className="flex min-w-0 flex-col gap-1 py-0.5">
        <h3 className="line-clamp-2 text-sm font-medium leading-snug text-foreground">
          {book.title}
        </h3>
        <p className="line-clamp-1 text-xs text-muted-foreground">
          {authorLine(book.authors)}
        </p>
        {year != null ? (
          <p className="mt-auto text-xs tabular-nums text-muted-foreground">
            {year}
          </p>
        ) : null}
      </div>
    </Link>
  )
}
