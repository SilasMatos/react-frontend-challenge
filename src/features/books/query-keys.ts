import type { BookSearchFilters } from './types/search'

export interface BookSearchKey extends BookSearchFilters {
  query: string
  page: number
}

/**
 * Query keys centralizadas da feature `books`. Estrutura hierárquica para
 * invalidação seletiva (`booksKeys.all` invalida tudo, `booksKeys.searches()`
 * só as buscas, etc.).
 */
export const booksKeys = {
  all: ['books'] as const,
  searches: () => [...booksKeys.all, 'search'] as const,
  search: (params: BookSearchKey) =>
    [...booksKeys.searches(), params] as const,
  details: () => [...booksKeys.all, 'detail'] as const,
  detail: (bookId: string) => [...booksKeys.details(), bookId] as const,
}
