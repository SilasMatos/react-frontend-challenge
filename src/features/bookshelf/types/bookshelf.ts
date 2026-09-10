import type { Book } from '@/types/book'

export const BOOK_STATUSES = ['want-to-read', 'reading', 'read'] as const

export type BookStatus = (typeof BOOK_STATUSES)[number]

export const BOOK_STATUS_LABELS: Record<BookStatus, string> = {
  'want-to-read': 'Quero ler',
  reading: 'Lendo',
  read: 'Concluído',
}

export const BOOK_STATUS_ORDER: Record<BookStatus, number> = {
  'want-to-read': 0,
  reading: 1,
  read: 2,
}

export const DEFAULT_BOOK_STATUS: BookStatus = 'want-to-read'

export interface BookshelfItem {
  book: Book
  status: BookStatus
  addedAt: number
}
