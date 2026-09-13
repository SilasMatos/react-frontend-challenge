import { useEffect, useRef, useState, type ReactNode } from 'react'
import { toast } from 'sonner'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { Book } from '@/types/book'
import { useSearchBooks } from '../queries/use-search-books'
import type { BookSearchFilters } from '../types/search'
import { SearchFilters } from './search-filters'
import { SearchInput } from './search-input'
import { SearchResults } from './search-results'

export interface DiscoveryScreenProps {
  query: string
  filters: BookSearchFilters
  onQueryChange: (query: string) => void
  onFiltersChange: (filters: BookSearchFilters) => void
  renderAction?: (book: Book) => ReactNode
}

export function DiscoveryScreen({
  query,
  filters,
  onQueryChange,
  onFiltersChange,
  renderAction,
}: DiscoveryScreenProps) {
  const [inputValue, setInputValue] = useState(query)
  const lastSyncedQuery = useRef(query)
  const [scrollRoot, setScrollRoot] = useState<HTMLDivElement | null>(null)

  useEffect(() => {
    if (query !== lastSyncedQuery.current) {
      lastSyncedQuery.current = query
      setInputValue(query)
    }
  }, [query])

  const search = useSearchBooks({ query: inputValue, ...filters })

  useEffect(() => {
    if (scrollRoot) scrollRoot.scrollTop = 0
  }, [scrollRoot, inputValue, filters.printType, filters.orderBy])

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

  return (
    <main className="mx-auto flex h-[calc(100dvh-var(--header-height))] max-w-6xl flex-col gap-6 px-4 pt-8 duration-300 ease-out-quart animate-in fade-in motion-reduce:animate-none sm:px-6">
      <header className="flex shrink-0 flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Descobrir livros</h1>
        <p className="text-sm text-muted-foreground">
          Pesquise no acervo do Google Books e monte a sua estante.
        </p>
      </header>

      <div className="flex shrink-0 flex-wrap items-center gap-2">
        <SearchInput
          value={inputValue}
          onChange={handleQueryChange}
          busy={
            search.isDebouncing ||
            (search.isFetching && !search.isFetchingNextPage && search.status !== 'loading')
          }
          className="min-w-56 flex-1 basis-72"
        />
        <SearchFilters value={filters} onChange={onFiltersChange} className="ml-auto" />
      </div>

      <ScrollArea
        viewportRef={setScrollRoot}
        className="-mx-1 min-h-0 flex-1"
        viewportClassName="overscroll-contain pl-1 pr-3 scroll-fade-y scroll-fade-10"
      >
        <div className="pt-1 pb-8">
          <SearchResults
            search={search}
            scrollRoot={scrollRoot}
            onSuggest={handleQueryChange}
            renderAction={renderAction}
          />
        </div>
      </ScrollArea>
    </main>
  )
}
