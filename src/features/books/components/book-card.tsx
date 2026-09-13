import type { ReactNode } from 'react'
import { Link } from '@tanstack/react-router'
import { twMerge } from 'tailwind-merge'
import { BookCover } from '@/components/book-cover'
import type { Book } from '@/types/book'
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

  return (
    <article
      data-slot="book-card"
      className={twMerge(
        'group relative flex gap-3 rounded-lg border border-border bg-card p-3 text-left',
        'transition-[transform,background-color,border-color,box-shadow] duration-200 ease-out-quart',
        'hover:-translate-y-0.5 hover:border-ring/40 hover:bg-muted/40 hover:shadow-sm',
        'active:translate-y-0 active:duration-75',
        'focus-within:border-ring/40 focus-within:ring-2 focus-within:ring-ring',
        'motion-reduce:transition-none motion-reduce:hover:translate-y-0',
        className,
      )}
    >
      <BookCover book={book} size="sm" />

      <div className="flex min-w-0 flex-col gap-1 py-0.5">
        <h2 className="line-clamp-2 text-sm font-medium leading-snug text-foreground">
          <Link
            to="/book/$bookId"
            params={{ bookId: book.id }}
            className="rounded-sm outline-none after:absolute after:inset-0 after:rounded-lg"
          >
            {book.title}
          </Link>
        </h2>
        <p className="line-clamp-1 text-xs text-muted-foreground">
          {authorLine(book.authors)}
        </p>
        {year != null ? (
          <p className="mt-auto text-xs tabular-nums text-muted-foreground">
            {year}
          </p>
        ) : null}
      </div>

      {action ? (
        <div className="relative z-10 ml-auto shrink-0">{action}</div>
      ) : null}
    </article>
  )
}
