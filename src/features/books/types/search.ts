/** Tipos internos da busca de livros — o que os filtros e a paginação controlam. */

/** `printType` da Google Books API — filtro obrigatório do case. */
export type PrintType = 'all' | 'books' | 'magazines'

/** `orderBy` da Google Books API — filtro obrigatório do case. */
export type SortOrder = 'relevance' | 'newest'

export const PRINT_TYPES: readonly PrintType[] = ['all', 'books', 'magazines']
export const SORT_ORDERS: readonly SortOrder[] = ['relevance', 'newest']

/** Rótulos em pt-BR para os selects de filtro. */
export const PRINT_TYPE_LABELS: Record<PrintType, string> = {
  all: 'Tudo',
  books: 'Livros',
  magazines: 'Revistas',
}

export const SORT_ORDER_LABELS: Record<SortOrder, string> = {
  relevance: 'Relevância',
  newest: 'Mais recentes',
}

/**
 * Volumes por página. O teto da Google Books API é 40; 20 dá um grid cheio sem
 * pesar a resposta.
 */
export const BOOKS_PAGE_SIZE = 20

/**
 * A API não pagina de forma confiável além de ~1000 resultados, mesmo quando
 * `totalItems` vem muito maior. Limitamos a janela navegável a isso.
 */
export const BOOKS_MAX_RESULT_WINDOW = 1000

/** O que o formulário de filtros controla. */
export interface BookSearchFilters {
  printType: PrintType
  orderBy: SortOrder
}

export const DEFAULT_BOOK_SEARCH_FILTERS: BookSearchFilters = {
  printType: 'all',
  orderBy: 'relevance',
}
