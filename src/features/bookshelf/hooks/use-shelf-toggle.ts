import type { Book } from '@/types/book'
import { useBookshelf, useShelfEntry } from './use-bookshelf'
import { useShelfToast } from './use-shelf-toast'

export interface UseShelfToggleResult {
  inShelf: boolean
  label: string
  toggle: () => void
}

export function useShelfToggle(book: Book): UseShelfToggleResult {
  const entry = useShelfEntry(book.id)
  const { add, remove } = useBookshelf()
  const { notifyAdded, notifyRemoved } = useShelfToast()
  const inShelf = entry != null

  function toggle() {
    if (entry) {
      remove(book.id)
      notifyRemoved(book, entry.status)
      return
    }

    add(book)
    notifyAdded(book)
  }

  return {
    inShelf,
    label: inShelf ? 'Remover da estante' : 'Adicionar à estante',
    toggle,
  }
}
