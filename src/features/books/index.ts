// API pública da feature `books`.
// Importe SEMPRE por `@/features/books` — caminhos internos são bloqueados pelo
// `no-restricted-imports` (eslint.config.js). Dentro da feature, use imports relativos.

export { DiscoveryScreen } from './components/discovery-screen'
export { BookDetailScreen } from './components/book-detail-screen'

export { useSearchBooks } from './queries/use-search-books'
export type {
  BookSearchStatus,
  UseSearchBooksParams,
  UseSearchBooksResult,
} from './queries/use-search-books'
export { useBook } from './queries/use-book'
export type { UseBookResult } from './queries/use-book'

export {
  BOOKS_PAGE_SIZE,
  DEFAULT_BOOK_SEARCH_FILTERS,
  PRINT_TYPES,
  PRINT_TYPE_LABELS,
  SORT_ORDERS,
  SORT_ORDER_LABELS,
} from './types/search'
export type {
  BookSearchFilters,
  PrintType,
  SortOrder,
} from './types/search'
