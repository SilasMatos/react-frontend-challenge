export type PrintType = 'all' | 'books' | 'magazines'

export type SortOrder = 'relevance' | 'newest'

export const PRINT_TYPES = ['all', 'books', 'magazines'] as const satisfies readonly PrintType[]
export const SORT_ORDERS = ['relevance', 'newest'] as const satisfies readonly SortOrder[]

export const PRINT_TYPE_LABELS: Record<PrintType, string> = {
  all: 'Tudo',
  books: 'Livros',
  magazines: 'Revistas',
}

export const SORT_ORDER_LABELS: Record<SortOrder, string> = {
  relevance: 'Relevância',
  newest: 'Mais recentes',
}

export const BOOKS_PAGE_SIZE = 20

export const BOOKS_MAX_RESULT_WINDOW = 1000

export interface BookSearchFilters {
  printType: PrintType
  orderBy: SortOrder
}

export const DEFAULT_BOOK_SEARCH_FILTERS: BookSearchFilters = {
  printType: 'all',
  orderBy: 'relevance',
}
