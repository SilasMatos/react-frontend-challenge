import type { ReactNode } from 'react'
import { Frown, Library, Loader2, Search, SearchX } from 'lucide-react'
import { AsyncBoundary } from '@/components/async-boundary'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/empty-state'
import { useIntersectionObserver } from '@/hooks/use-intersection-observer'
import type { Book } from '@/types/book'
import type { UseSearchBooksResult } from '../queries/use-search-books'
import { BOOKS_PAGE_SIZE } from '../types/search'
import { BookCardSkeleton } from './book-card-skeleton'
import { VirtualBookGrid } from './virtual-book-grid'

export interface SearchResultsProps {
  search: UseSearchBooksResult
  scrollRoot?: Element | null
  onSuggest?: (term: string) => void
  renderAction?: (book: Book) => ReactNode
}

const gridClass =
  'grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'

const SUGGESTIONS = ['Clean Code', 'Machado de Assis', 'Ficção científica', 'Design']

const formatCount = (value: number) => value.toLocaleString('pt-BR')

export function SearchResults({
  search,
  scrollRoot = null,
  onSuggest,
  renderAction,
}: SearchResultsProps) {
  const sentinelRef = useIntersectionObserver(search.fetchNextPage, {
    enabled: search.hasNextPage && !search.isFetching && !search.nextPageError,
    root: scrollRoot,
    rootMargin: '240px',
  })
  const canFetchPrevious = search.hasPreviousPage && !search.isFetching

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
        <div className="flex flex-col gap-4">
          <p className="text-xs text-muted-foreground" aria-live="polite">
            <span className="tabular-nums">
              {formatCount(search.windowStart + books.length)}
            </span>{' '}
            de cerca de{' '}
            <span className="tabular-nums">{formatCount(search.totalItems)}</span>{' '}
            resultados
          </p>

          <VirtualBookGrid
            books={books}
            windowStart={search.windowStart}
            scrollRoot={scrollRoot}
            renderAction={renderAction}
            onReachStart={canFetchPrevious ? search.fetchPreviousPage : undefined}
          />

          {search.hasNextPage ? (
            <div ref={sentinelRef} className="flex min-h-12 items-center justify-center py-2">
              {search.isFetchingNextPage ? (
                <Loader2
                  aria-label="Carregando mais resultados"
                  role="status"
                  className="size-5 animate-spin text-muted-foreground"
                />
              ) : search.nextPageError ? (
                <div className="flex flex-col items-center gap-2 text-center">
                  <p className="text-sm text-muted-foreground">
                    {search.nextPageError.message}
                  </p>
                  <Button type="button" variant="outline" size="sm" onClick={search.fetchNextPage}>
                    Tentar de novo
                  </Button>
                </div>
              ) : (
                <Button type="button" variant="ghost" size="sm" onClick={search.fetchNextPage}>
                  Carregar mais
                </Button>
              )}
            </div>
          ) : (
            <p className="py-2 text-center text-xs text-muted-foreground">
              Você chegou ao fim dos resultados.
            </p>
          )}
        </div>
      )}
    </AsyncBoundary>
  )
}
