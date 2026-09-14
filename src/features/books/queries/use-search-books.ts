import { useCallback } from 'react'
import {
  keepPreviousData,
  useInfiniteQuery,
  type InfiniteData,
} from '@tanstack/react-query'
import { useDebounce } from '@/hooks/use-debounce'
import type { Book } from '@/types/book'
import type { Paginated } from '@/types/common'
import { toBookPage } from '../mappers/book-mapper'
import { booksKeys } from '../query-keys'
import { searchVolumes } from '../services/books-service'
import {
  BOOKS_MAX_RESULT_WINDOW,
  BOOKS_PAGE_SIZE,
  DEFAULT_BOOK_SEARCH_FILTERS,
  type BookSearchFilters,
  type SortOrder,
} from '../types/search'

const SEARCH_DEBOUNCE_MS = 400

export const BOOKS_MAX_PAGES = 10

export type BookSearchStatus =
  | 'idle'
  | 'loading'
  | 'error'
  | 'empty'
  | 'success'

export interface UseSearchBooksParams extends Partial<BookSearchFilters> {
  query: string
  maxPages?: number
}

export interface UseSearchBooksResult {
  books: Book[]
  status: BookSearchStatus
  isFetching: boolean
  isDebouncing: boolean
  error: Error | null
  totalItems: number
  windowStart: number
  hasNextPage: boolean
  isFetchingNextPage: boolean
  nextPageError: Error | null
  fetchNextPage: () => void
  hasPreviousPage: boolean
  isFetchingPreviousPage: boolean
  fetchPreviousPage: () => void
  refetch: () => void
}

interface SearchSelection {
  books: Book[]
  totalItems: number
  windowStart: number
}

export function getNextStartIndex(lastPage: Paginated<Book>): number | undefined {
  const next = lastPage.startIndex + lastPage.pageSize
  const limit = Math.min(lastPage.totalItems, BOOKS_MAX_RESULT_WINDOW)
  return lastPage.items.length > 0 && next < limit ? next : undefined
}

export function getPreviousStartIndex(firstPage: Paginated<Book>): number | undefined {
  return firstPage.startIndex > 0
    ? Math.max(firstPage.startIndex - firstPage.pageSize, 0)
    : undefined
}

export function compareByNewest(a: Book, b: Book): number {
  return (b.publishedDate ?? '').localeCompare(a.publishedDate ?? '')
}

export function selectBooks(
  data: InfiniteData<Paginated<Book>>,
  orderBy: SortOrder,
): SearchSelection {
  const seen = new Set<string>()
  const books: Book[] = []
  for (const page of data.pages) {
    for (const book of page.items) {
      if (seen.has(book.id)) continue
      seen.add(book.id)
      books.push(book)
    }
  }
  if (orderBy === 'newest') books.sort(compareByNewest)
  return {
    books,
    totalItems: data.pages[0]?.totalItems ?? 0,
    windowStart: data.pages[0]?.startIndex ?? 0,
  }
}

export function useSearchBooks({
  query,
  printType = DEFAULT_BOOK_SEARCH_FILTERS.printType,
  orderBy = DEFAULT_BOOK_SEARCH_FILTERS.orderBy,
  maxPages = BOOKS_MAX_PAGES,
}: UseSearchBooksParams): UseSearchBooksResult {
  const trimmedQuery = query.trim()
  const debouncedQuery = useDebounce(trimmedQuery, SEARCH_DEBOUNCE_MS)
  const enabled = debouncedQuery.length > 0

  const select = useCallback(
    (data: InfiniteData<Paginated<Book>>) => selectBooks(data, orderBy),
    [orderBy],
  )

  const result = useInfiniteQuery({
    queryKey: booksKeys.search({ query: debouncedQuery, printType, orderBy }),
    queryFn: async ({ pageParam, signal }) => {
      const response = await searchVolumes({
        query: debouncedQuery,
        printType,
        orderBy,
        startIndex: pageParam,
        maxResults: BOOKS_PAGE_SIZE,
        signal,
      })
      return toBookPage(response, pageParam, BOOKS_PAGE_SIZE)
    },
    initialPageParam: 0,
    getNextPageParam: getNextStartIndex,
    getPreviousPageParam: getPreviousStartIndex,
    maxPages,
    select,
    enabled,
    placeholderData: keepPreviousData,
  })

  const data = result.data
  const books = data?.books ?? []

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
    totalItems: data?.totalItems ?? 0,
    windowStart: data?.windowStart ?? 0,
    hasNextPage: result.hasNextPage && !result.isPlaceholderData,
    isFetchingNextPage: result.isFetchingNextPage,
    nextPageError: result.isFetchNextPageError ? result.error : null,
    fetchNextPage: () => void result.fetchNextPage(),
    hasPreviousPage: result.hasPreviousPage && !result.isPlaceholderData,
    isFetchingPreviousPage: result.isFetchingPreviousPage,
    fetchPreviousPage: () => void result.fetchPreviousPage(),
    refetch: () => void result.refetch(),
  }
}
