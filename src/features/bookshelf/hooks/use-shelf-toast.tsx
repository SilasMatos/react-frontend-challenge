import { toast } from 'sonner'
import type { Book } from '@/types/book'
import { ShelfToast, type ShelfToastKind } from '../components/shelf-toast'
import type { BookStatus } from '../types/bookshelf'
import { useBookshelf } from './use-bookshelf'

function showShelfToast(kind: ShelfToastKind, book: Book, onUndo: () => void) {
  return toast.custom((id) => (
    <ShelfToast toastId={id} kind={kind} book={book} onUndo={onUndo} />
  ))
}

export interface UseShelfToastResult {
  notifyAdded: (book: Book) => void
  notifyRemoved: (book: Book, previousStatus: BookStatus) => void
}

export function useShelfToast(): UseShelfToastResult {
  const { add, remove } = useBookshelf()

  return {
    notifyAdded: (book) => showShelfToast('added', book, () => remove(book.id)),
    notifyRemoved: (book, previousStatus) =>
      showShelfToast('removed', book, () => add(book, previousStatus)),
  }
}
