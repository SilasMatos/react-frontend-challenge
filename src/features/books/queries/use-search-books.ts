import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useDebounce } from '@/hooks/use-debounce'
import type { Book } from '@/types/book'
import { toBookPage } from '../mappers/book-mapper'
import { booksKeys } from '../query-keys'
import { searchVolumes } from '../services/books-service'
import {
  BOOKS_MAX_RESULT_WINDOW,
  BOOKS_PAGE_SIZE,
  DEFAULT_BOOK_SEARCH_FILTERS,
  type BookSearchFilters,
} from '../types/search'

/** Espera o termo ficar estável por 400ms antes de bater na API (requisito do case). */
const SEARCH_DEBOUNCE_MS = 400

export type BookSearchStatus =
  | 'idle' // nada pesquisado ainda
  | 'loading' // primeira busca em andamento, sem dados
  | 'error' // primeira busca falhou
  | 'empty' // busca concluída, zero resultados
  | 'success' // há resultados para mostrar

export interface UseSearchBooksParams extends Partial<BookSearchFilters> {
  /** Termo cru vindo do input — o hook aplica o debounce internamente. */
  query: string
  /** Página 0-based. `startIndex = page * BOOKS_PAGE_SIZE`. */
  page?: number
}

export interface UseSearchBooksResult {
  books: Book[]
  status: BookSearchStatus
  isFetching: boolean
  isDebouncing: boolean
  error: Error | null
  totalItems: number
  page: number
  pageCount: number
  pageSize: number
  hasNextPage: boolean
  hasPreviousPage: boolean
  /** Faixa exibida, para o rótulo "mostrando X–Y de Z". */
  rangeStart: number
  rangeEnd: number
  refetch: () => void
}

/**
 * Busca de livros na Google Books API com debounce no termo e paginação por
 * `startIndex`. Usa `placeholderData: keepPreviousData` para a lista não "piscar"
 * ao trocar de página.
 *
 * A query só dispara quando há um termo — nada de request no primeiro render.
 */
export function useSearchBooks({
  query,
  page = 0,
  printType = DEFAULT_BOOK_SEARCH_FILTERS.printType,
  orderBy = DEFAULT_BOOK_SEARCH_FILTERS.orderBy,
}: UseSearchBooksParams): UseSearchBooksResult {
  const trimmedQuery = query.trim()
  const debouncedQuery = useDebounce(trimmedQuery, SEARCH_DEBOUNCE_MS)

  const startIndex = page * BOOKS_PAGE_SIZE
  const enabled = debouncedQuery.length > 0

  const result = useQuery({
    queryKey: booksKeys.search({ query: debouncedQuery, page, printType, orderBy }),
    queryFn: async ({ signal }) => {
      const response = await searchVolumes({
        query: debouncedQuery,
        printType,
        orderBy,
        startIndex,
        maxResults: BOOKS_PAGE_SIZE,
        signal,
      })
      return toBookPage(response, startIndex, BOOKS_PAGE_SIZE)
    },
    enabled,
    placeholderData: keepPreviousData,
  })

  const data = result.data
  const totalItems = data?.totalItems ?? 0
  const navigableTotal = Math.min(totalItems, BOOKS_MAX_RESULT_WINDOW)
  const pageCount = Math.max(1, Math.ceil(navigableTotal / BOOKS_PAGE_SIZE))
  const books = data?.items ?? []

  let status: BookSearchStatus
  if (!enabled) {
    status = 'idle'
  } else if (!data) {
    status = result.isError ? 'error' : 'loading'
  } else if (books.length === 0) {
    status = 'empty'
  } else {
    status = 'success'
  }

  return {
    books,
    status,
    isFetching: result.isFetching,
    isDebouncing: trimmedQuery !== debouncedQuery,
    error: result.error,
    totalItems,
    page,
    pageCount,
    pageSize: BOOKS_PAGE_SIZE,
    hasNextPage: page + 1 < pageCount,
    hasPreviousPage: page > 0,
    rangeStart: totalItems === 0 ? 0 : startIndex + 1,
    rangeEnd: Math.min(startIndex + BOOKS_PAGE_SIZE, navigableTotal),
    refetch: () => void result.refetch(),
  }
}
