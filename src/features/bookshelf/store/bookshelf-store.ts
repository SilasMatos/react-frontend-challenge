import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Book } from '@/types/book'
import {
  DEFAULT_BOOK_STATUS,
  type BookStatus,
  type BookshelfItem,
} from '../types/bookshelf'

interface BookshelfStore {
  items: BookshelfItem[]
  add: (book: Book, status?: BookStatus) => void
  remove: (bookId: string) => void
  setStatus: (bookId: string, status: BookStatus) => void
}

export const useBookshelfStore = create<BookshelfStore>()(
  persist(
    (set) => ({
      items: [],
      add: (book, status = DEFAULT_BOOK_STATUS) =>
        set((state) =>
          state.items.some((item) => item.book.id === book.id)
            ? state
            : {
                items: [
                  ...state.items,
                  { book, status, addedAt: Date.now() },
                ],
              },
        ),
      remove: (bookId) =>
        set((state) => ({
          items: state.items.filter((item) => item.book.id !== bookId),
        })),
      setStatus: (bookId, status) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.book.id === bookId ? { ...item, status } : item,
          ),
        })),
    }),
    { name: 'libris:bookshelf', version: 1 },
  ),
)
