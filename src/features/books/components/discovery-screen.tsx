import { useEffect, useRef, useState, type ReactNode } from 'react'
import { toast } from 'sonner'
import type { Book } from '@/types/book'
import { useSearchBooks } from '../queries/use-search-books'
import type { BookSearchFilters } from '../types/search'
import { SearchFilters } from './search-filters'
import { SearchInput } from './search-input'
import { SearchResults } from './search-results'

export interface DiscoveryScreenProps {
  query: string
  filters: BookSearchFilters
  page: number
  onQueryChange: (query: string) => void
  onFiltersChange: (filters: BookSearchFilters) => void
  onPageChange: (page: number) => void
  renderAction?: (book: Book) => ReactNode
}

export function DiscoveryScreen({
  query,
  filters,
  page,
  onQueryChange,
  onFiltersChange,
  onPageChange,
  renderAction,
}: DiscoveryScreenProps) {
  const [inputValue, setInputValue] = useState(query)
  const lastSyncedQuery = useRef(query)

  useEffect(() => {
    if (query !== lastSyncedQuery.current) {
      lastSyncedQuery.current = query
      setInputValue(query)
    }
  }, [query])

  const search = useSearchBooks({ query: inputValue, page, ...filters })

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
    lastSyncedQuery.current = value
    setInputValue(value)
    onQueryChange(value)
  }

  function handlePageChange(next: number) {
    onPageChange(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 duration-300 ease-out-quart animate-in fade-in motion-reduce:animate-none sm:px-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Descobrir livros</h1>
        <p className="text-sm text-muted-foreground">
          Pesquise no acervo do Google Books e monte a sua estante.
        </p>
      </header>

      <div className="flex flex-wrap items-center gap-2">
        <SearchInput
          value={inputValue}
          onChange={handleQueryChange}
          busy={search.isDebouncing || (search.isFetching && search.status !== 'loading')}
          className="min-w-56 flex-1 basis-72"
        />
        <SearchFilters value={filters} onChange={onFiltersChange} className="ml-auto" />
      </div>

      <SearchResults
        search={search}
        onPageChange={handlePageChange}
        onSuggest={handleQueryChange}
        renderAction={renderAction}
      />
    </main>
  )
}
