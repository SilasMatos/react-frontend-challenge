import { Frown, Library, SearchX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/empty-state'
import type { UseSearchBooksResult } from '../queries/use-search-books'
import { BOOKS_PAGE_SIZE } from '../types/search'
import { BookCard } from './book-card'
import { BookCardSkeleton } from './book-card-skeleton'
import { BookPagination } from './book-pagination'

export interface SearchResultsProps {
  search: UseSearchBooksResult
  onPageChange: (page: number) => void
}

const gridClass =
  'grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'

export function SearchResults({ search, onPageChange }: SearchResultsProps) {
  if (search.status === 'idle') {
    return (
      <EmptyState
        icon={Library}
        title="Sua próxima leitura começa aqui"
        description="Busque por um título, autor ou assunto para explorar o acervo do Google Books."
      />
    )
  }

  if (search.status === 'loading') {
    return (
      <div className={gridClass} aria-busy="true" aria-label="Carregando resultados">
        {Array.from({ length: BOOKS_PAGE_SIZE }, (_, index) => (
          <BookCardSkeleton key={index} />
        ))}
      </div>
    )
  }

  if (search.status === 'error') {
    return (
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
    )
  }

  if (search.status === 'empty') {
    return (
      <EmptyState
        icon={SearchX}
        title="Nenhum livro encontrado"
        description="Revise o termo ou ajuste os filtros de tipo e ordenação."
      />
    )
  }

  return (
    <div className="flex flex-col gap-5">
      <ul className={gridClass}>
        {search.books.map((book) => (
          <li key={book.id}>
            <BookCard book={book} className="h-full" />
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
  )
}
