import { useEffect, useRef, useState, type ReactNode } from 'react'
import { toast } from 'sonner'
import type { Book } from '@/types/book'
import { useSearchBooks } from '../queries/use-search-books'
import {
  DEFAULT_BOOK_SEARCH_FILTERS,
  type BookSearchFilters,
} from '../types/search'
import { SearchFilters } from './search-filters'
import { SearchInput } from './search-input'
import { SearchResults } from './search-results'

export interface DiscoveryScreenProps {
  /** Ação por card (ex.: adicionar à estante). Injetada pela rota. */
  renderAction?: (book: Book) => ReactNode
}

/**
 * Módulo de Descoberta: busca com debounce, filtros (TanStack Form) e paginação
 * por `startIndex`. Todo o estado de busca vive aqui; a rota só monta a tela.
 */
export function DiscoveryScreen({ renderAction }: DiscoveryScreenProps) {
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState<BookSearchFilters>(
    DEFAULT_BOOK_SEARCH_FILTERS,
  )
  const [page, setPage] = useState(0)

  const search = useSearchBooks({ query, page, ...filters })

  const notifiedError = useRef<string | null>(null)
  useEffect(() => {
    if (search.status === 'error' && search.error) {
      if (notifiedError.current !== search.error.message) {
        notifiedError.current = search.error.message
        toast.error('Erro na busca', { description: search.error.message })
      }
    } else if (search.status !== 'error') {
      notifiedError.current = null
    }
  }, [search.status, search.error])

  function handleQueryChange(value: string) {
    setQuery(value)
    setPage(0)
  }

  function handleFiltersChange(next: BookSearchFilters) {
    setFilters(next)
    setPage(0)
  }

  function handlePageChange(next: number) {
    setPage(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 duration-300 ease-out-quart animate-in fade-in motion-reduce:animate-none sm:px-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold tracking-tight">Descobrir livros</h1>
        <p className="text-sm text-muted-foreground">
          Pesquise no acervo do Google Books e monte a sua estante.
        </p>
      </header>

      <div className="flex flex-col gap-3">
        <SearchInput
          value={query}
          onChange={handleQueryChange}
          busy={search.isDebouncing || (search.isFetching && search.status !== 'loading')}
          className="max-w-xl"
        />
        <SearchFilters
          defaultValue={DEFAULT_BOOK_SEARCH_FILTERS}
          onChange={handleFiltersChange}
        />
      </div>

      <SearchResults
        search={search}
        onPageChange={handlePageChange}
        renderAction={renderAction}
      />
    </main>
  )
}
