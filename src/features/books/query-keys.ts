import type { BookSearchFilters } from './types/search'

export interface BookSearchKey extends BookSearchFilters {
  query: string
  page: number
}

export const booksKeys = {
  all: ['books'] as const,
  searches: () => [...booksKeys.all, 'search'] as const,
  search: (params: BookSearchKey) =>
    [...booksKeys.searches(), params] as const,
  details: () => [...booksKeys.all, 'detail'] as const,
  detail: (bookId: string) => [...booksKeys.details(), bookId] as const,
}
