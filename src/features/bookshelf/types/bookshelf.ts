import type { Book } from '@/types/book'

/** Estados possíveis de um livro na Estante (ordem = progresso de leitura). */
export const BOOK_STATUSES = ['want-to-read', 'reading', 'read'] as const

export type BookStatus = (typeof BOOK_STATUSES)[number]

export const BOOK_STATUS_LABELS: Record<BookStatus, string> = {
  'want-to-read': 'Quero ler',
  reading: 'Lendo',
  read: 'Concluído',
}

/**
 * Peso de cada status para ordenar a tabela por progresso (e não por ordem
 * alfabética do rótulo).
 */
export const BOOK_STATUS_ORDER: Record<BookStatus, number> = {
  'want-to-read': 0,
  reading: 1,
  read: 2,
}

export const DEFAULT_BOOK_STATUS: BookStatus = 'want-to-read'

/** Um livro salvo: o modelo de domínio + os metadados locais da Estante. */
export interface BookshelfItem {
  book: Book
  status: BookStatus
  /** epoch ms — preserva a ordem de inclusão quando a tabela não está ordenada. */
  addedAt: number
}
