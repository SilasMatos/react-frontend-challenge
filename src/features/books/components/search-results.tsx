import type { ReactNode } from 'react'
import { Frown, Library, Search, SearchX } from 'lucide-react'
import { AsyncBoundary } from '@/components/async-boundary'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/empty-state'
import type { Book } from '@/types/book'
import type { UseSearchBooksResult } from '../queries/use-search-books'
import { BOOKS_PAGE_SIZE } from '../types/search'
import { BookCard } from './book-card'
import { BookCardSkeleton } from './book-card-skeleton'
import { BookPagination } from './book-pagination'

export interface SearchResultsProps {
  search: UseSearchBooksResult
  onPageChange: (page: number) => void
  onSuggest?: (term: string) => void
  renderAction?: (book: Book) => ReactNode
}

const gridClass =
  'grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'

const SUGGESTIONS = ['Clean Code', 'Machado de Assis', 'Ficção científica', 'Design']

export function SearchResults({
  search,
  onPageChange,
  onSuggest,
  renderAction,
}: SearchResultsProps) {
  if (search.status === 'idle') {
    return (
      <EmptyState
        icon={Library}
        title="Sua próxima leitura começa aqui"
        description="Busque por um título, autor ou assunto para explorar o acervo do Google Books."
        action={
          onSuggest ? (
            <ul aria-label="Sugestões de busca" className="flex flex-wrap justify-center gap-2">
              {SUGGESTIONS.map((term) => (
                <li key={term}>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="rounded-full"
                    onClick={() => onSuggest(term)}
                  >
                    <Search aria-hidden />
                    {term}
                  </Button>
                </li>
              ))}
            </ul>
          ) : null
        }
      />
    )
  }

  return (
    <AsyncBoundary
      isLoading={search.status === 'loading'}
      isError={search.status === 'error'}
      data={search.status === 'error' ? undefined : search.books}
      error={search.error}
      onRetry={search.refetch}
      isEmpty={(books) => books.length === 0}
      pending={
        <div className={gridClass} aria-busy="true" aria-label="Carregando resultados">
          {Array.from({ length: BOOKS_PAGE_SIZE }, (_, index) => (
            <BookCardSkeleton key={index} />
          ))}
        </div>
      }
      empty={
        <EmptyState
          icon={SearchX}
          title="Nenhum livro encontrado"
          description="Revise o termo ou ajuste os filtros de tipo e ordenação."
        />
      }
      errorFallback={
        <EmptyState
          icon={Frown}
          title="Não deu para buscar agora"
          description={search.error?.message ?? 'Tente novamente em instantes.'}
          action={
            <Button type="button" variant="outline" size="sm" onClick={search.refetch}>
              Tentar de novo
            </Button>
          }
        />
      }
    >
      {(books) => (
        <div className="flex flex-col gap-5">
          <ul className={gridClass}>
            {books.map((book, index) => (
              <li
                key={book.id}
                className="animate-in fade-in slide-in-from-bottom-1 fill-mode-both duration-300 ease-out-quart motion-reduce:animate-none"
                style={{ animationDelay: `${Math.min(index, 10) * 30}ms` }}
              >
                <BookCard book={book} action={renderAction?.(book)} className="h-full" />
              </li>
            ))}
          </ul>

          {search.pageCount > 1 ? (
            <BookPagination
              page={search.page}
              pageCount={search.pageCount}
              hasPreviousPage={search.hasPreviousPage}
              hasNextPage={search.hasNextPage}
              rangeStart={search.rangeStart}
              rangeEnd={search.rangeEnd}
              totalItems={search.totalItems}
              onPageChange={onPageChange}
              busy={search.isFetching}
            />
          ) : null}
        </div>
      )}
    </AsyncBoundary>
  )
}
