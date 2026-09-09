import { ArrowLeft, ExternalLink, Frown } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/empty-state'
import { formatPublishedDate } from '@/utils/format-date'
import { stripHtml } from '@/utils/strip-html'
import { useBook } from '../queries/use-book'
import { BookCover } from './book-cover'

export interface BookDetailScreenProps {
  bookId: string
}

const backLink = (
  <Link
    to="/"
    className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
  >
    <ArrowLeft className="size-4" />
    Voltar para a busca
  </Link>
)

export function BookDetailScreen({ bookId }: BookDetailScreenProps) {
  const { book, isLoading, isError, error, refetch } = useBook(bookId)

  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-8 sm:px-6">
      {backLink}

      {isLoading ? <BookDetailSkeleton /> : null}

      {isError ? (
        <EmptyState
          icon={Frown}
          title="Não encontramos esse livro"
          description={error?.message ?? 'Tente novamente em instantes.'}
          action={
            <Button type="button" variant="outline" size="sm" onClick={refetch}>
              Tentar de novo
            </Button>
          }
        />
      ) : null}

      {book ? (
        <article className="flex flex-col gap-6 sm:flex-row sm:gap-8">
          <BookCover book={book} size="lg" className="mx-auto sm:mx-0" />

          <div className="flex min-w-0 flex-1 flex-col gap-4">
            <header className="flex flex-col gap-1.5">
              <h1 className="text-2xl font-semibold tracking-tight text-balance">
                {book.title}
              </h1>
              {book.subtitle ? (
                <p className="text-base text-muted-foreground">{book.subtitle}</p>
              ) : null}
              <p className="text-sm text-foreground">
                {book.authors.length > 0
                  ? book.authors.join(', ')
                  : 'Autor desconhecido'}
              </p>
            </header>

            <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:max-w-md">
              <Meta label="Editora" value={book.publisher} />
              <Meta label="Publicação" value={formatPublishedDate(book.publishedDate)} />
              <Meta
                label="Páginas"
                value={book.pageCount ? String(book.pageCount) : null}
              />
              <Meta label="Idioma" value={book.language?.toUpperCase() ?? null} />
            </dl>

            {book.categories.length > 0 ? (
              <ul className="flex flex-wrap gap-1.5">
                {book.categories.map((category) => (
                  <li key={category}>
                    <Badge variant="secondary">{category}</Badge>
                  </li>
                ))}
              </ul>
            ) : null}

            {book.description ? (
              <p className="text-sm leading-relaxed whitespace-pre-line text-foreground/90">
                {stripHtml(book.description)}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                Sem sinopse disponível para este título.
              </p>
            )}

            {book.previewLink || book.infoLink ? (
              <div className="flex flex-wrap gap-2 pt-1">
                {book.previewLink ? (
                  <Button
                    variant="outline"
                    size="sm"
                    render={
                      <a
                        href={book.previewLink}
                        target="_blank"
                        rel="noreferrer noopener"
                      />
                    }
                  >
                    Ver prévia
                    <ExternalLink />
                  </Button>
                ) : null}
                {book.infoLink ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    render={
                      <a
                        href={book.infoLink}
                        target="_blank"
                        rel="noreferrer noopener"
                      />
                    }
                  >
                    Mais informações
                    <ExternalLink />
                  </Button>
                ) : null}
              </div>
            ) : null}
          </div>
        </article>
      ) : null}
    </main>
  )
}

function Meta({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="flex flex-col">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-foreground">{value ?? '—'}</dd>
    </div>
  )
}

function BookDetailSkeleton() {
  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:gap-8">
      <Skeleton className="mx-auto h-60 w-40 shrink-0 rounded-md sm:mx-0" />
      <div className="flex flex-1 flex-col gap-4">
        <Skeleton className="h-7 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="grid grid-cols-2 gap-2 sm:max-w-md">
          <Skeleton className="h-9" />
          <Skeleton className="h-9" />
          <Skeleton className="h-9" />
          <Skeleton className="h-9" />
        </div>
        <Skeleton className="h-24 w-full" />
      </div>
    </div>
  )
}
