import type { Book } from '@/types/book'
import { useBookshelfStore } from '../store/bookshelf-store'
import type { BookshelfItem } from '../types/bookshelf'

export interface UseBookshelfResult {
  items: BookshelfItem[]
  count: number
  add: (book: Book, status?: BookshelfItem['status']) => void
  remove: (bookId: string) => void
  setStatus: (bookId: string, status: BookshelfItem['status']) => void
}

export function useBookshelf(): UseBookshelfResult {
  const items = useBookshelfStore((state) => state.items)
  const add = useBookshelfStore((state) => state.add)
  const remove = useBookshelfStore((state) => state.remove)
  const setStatus = useBookshelfStore((state) => state.setStatus)

  return { items, count: items.length, add, remove, setStatus }
}

export function useShelfEntry(bookId: string): BookshelfItem | undefined {
  return useBookshelfStore((state) =>
    state.items.find((item) => item.book.id === bookId),
  )
}
