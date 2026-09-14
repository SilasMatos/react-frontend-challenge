import type { ReactNode } from 'react'
import { Link } from '@tanstack/react-router'
import { twMerge } from 'tailwind-merge'
import { BookCover } from '@/components/book-cover'
import type { Book } from '@/types/book'
import { usePrefetchBook } from '../queries/use-prefetch-book'
import { getPublishedYear } from '@/utils/format-date'

export interface BookCardProps {
  book: Book
  action?: ReactNode
  className?: string
}

function authorLine(authors: string[]): string {
  if (authors.length === 0) return 'Autor desconhecido'
  if (authors.length <= 2) return authors.join(' e ')
  return `${authors[0]} +${authors.length - 1}`
}

export function BookCard({ book, action, className }: BookCardProps) {
  const year = getPublishedYear(book.publishedDate)
  const { prefetch, cancel } = usePrefetchBook()

  return (
    <article
      data-slot="book-card"
      onMouseEnter={() => prefetch(book.id)}
      onMouseLeave={cancel}
      onFocus={() => prefetch(book.id)}
      onBlur={cancel}
      className={twMerge(
        'group relative flex gap-3 rounded-lg border border-border bg-card p-3 text-left',
        'hover-lift hover:border-ring/40 hover:bg-muted/40',
        'has-[a:focus-visible]:border-ring has-[a:focus-visible]:ring-3 has-[a:focus-visible]:ring-ring/50',
        className,
      )}
    >
      <BookCover book={book} size="sm" />

      <div className="flex min-w-0 flex-1 flex-col gap-1 py-0.5">
        <h2 className="line-clamp-2 text-sm font-medium leading-snug text-foreground">
          <Link
            to="/book/$bookId"
            params={{ bookId: book.id }}
            title={book.title}
            className="rounded-sm outline-none after:absolute after:inset-0 after:rounded-lg"
          >
            {book.title}
          </Link>
        </h2>
        <p className="line-clamp-1 text-sm text-muted-foreground">
          {authorLine(book.authors)}
        </p>
        {year != null ? (
          <p className="mt-auto text-xs tabular-nums text-muted-foreground/70">
            {year}
          </p>
        ) : null}
      </div>

      {action ? (
        <div className="absolute right-3 bottom-3 z-10">{action}</div>
      ) : null}
    </article>
  )
}
