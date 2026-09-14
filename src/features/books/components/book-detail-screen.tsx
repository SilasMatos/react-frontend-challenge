import { ArrowLeft, ExternalLink, Frown } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { BookCover } from '@/components/book-cover'
import { EmptyState } from '@/components/empty-state'
import { Skel, SkeletonMorph } from '@/components/skeleton-morph'
import type { Book } from '@/types/book'
import { formatPublishedDate } from '@/utils/format-date'
import { stripHtml } from '@/utils/strip-html'
import { useBook } from '../queries/use-book'

export interface BookDetailScreenProps {
  bookId: string
  renderAction?: (book: Book) => ReactNode
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

export function BookDetailScreen({ bookId, renderAction }: BookDetailScreenProps) {
  const { book, isLoading, isError, error, refetch } = useBook(bookId)

  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-8 enter-fade sm:px-6">
      {backLink}

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
      ) : (
        <SkeletonMorph
          loading={isLoading}
          className="flex flex-col gap-6 enter-fade sm:flex-row sm:gap-8"
        >
          <Skel
            as="div"
            className="mx-auto w-40 shrink-0 self-start overflow-visible rounded-md data-loading:aspect-2/3 sm:mx-0"
          >
            {book ? (
              <BookCover
                book={book}
                size="lg"
                ratio="auto"
                loading="eager"
                className="h-auto w-full shadow-md"
              />
            ) : null}
          </Skel>

          <div className="flex min-w-0 flex-1 flex-col gap-4">
            <header className="flex flex-col gap-1.5">
              <h1 className="text-2xl font-semibold tracking-tight text-balance">
                <Skel as="span" className="max-w-full data-loading:h-7 data-loading:w-64">
                  {book?.title}
                </Skel>
              </h1>
              {book?.subtitle ? (
                <p className="text-base text-muted-foreground">{book.subtitle}</p>
              ) : null}
              <p className="text-sm text-foreground">
                <Skel as="span" className="max-w-full data-loading:h-4 data-loading:w-40">
                  {book
                    ? book.authors.length > 0
                      ? book.authors.join(', ')
                      : 'Autor desconhecido'
                    : null}
                </Skel>
              </p>
            </header>

            {book && renderAction ? <div>{renderAction(book)}</div> : null}

            <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:max-w-md">
              <Meta label="Editora" value={book?.publisher ?? null} />
              <Meta
                label="Publicação"
                value={book ? formatPublishedDate(book.publishedDate) : null}
              />
              <Meta
                label="Páginas"
                value={book?.pageCount ? String(book.pageCount) : null}
              />
              <Meta label="Idioma" value={book?.language?.toUpperCase() ?? null} />
            </dl>

            {book && book.categories.length > 0 ? (
              <ul className="flex flex-wrap gap-1.5">
                {book.categories.map((category) => (
                  <li key={category}>
                    <Badge variant="secondary">{category}</Badge>
                  </li>
                ))}
              </ul>
            ) : null}

            <Skel as="div" className="w-full data-loading:h-24">
              {book ? (
                book.description ? (
                  <p className="text-sm leading-relaxed whitespace-pre-line text-foreground/90">
                    {stripHtml(book.description)}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Sem sinopse disponível para este título.
                  </p>
                )
              ) : null}
            </Skel>

            {book && (book.previewLink || book.infoLink) ? (
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
        </SkeletonMorph>
      )}
    </main>
  )
}

function Meta({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="flex flex-col">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-foreground">
        <Skel as="span" className="max-w-full data-loading:h-4 data-loading:w-20">
          {value ?? '—'}
        </Skel>
      </dd>
    </div>
  )
}
