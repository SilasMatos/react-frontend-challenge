import { BookmarkCheck, BookmarkPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Book } from '@/types/book'
import { useBookshelf, useShelfEntry } from '../hooks/use-bookshelf'
import { useShelfToast } from '../hooks/use-shelf-toast'

export interface ShelfToggleButtonProps {
  book: Book
  withLabel?: boolean
  className?: string
}

export function ShelfToggleButton({
  book,
  withLabel = false,
  className,
}: ShelfToggleButtonProps) {
  const entry = useShelfEntry(book.id)
  const { add, remove } = useBookshelf()
  const { notifyAdded, notifyRemoved } = useShelfToast()
  const inShelf = entry != null

  function handleClick() {
    if (entry) {
      remove(book.id)
      notifyRemoved(book, entry.status)
      return
    }

    add(book)
    notifyAdded(book)
  }

  const label = inShelf ? 'Remover da estante' : 'Adicionar à estante'
  const Icon = inShelf ? BookmarkCheck : BookmarkPlus

  return (
    <Button
      type="button"
      data-slot="shelf-toggle-button"
      variant={inShelf ? 'secondary' : 'outline'}
      size={withLabel ? 'default' : 'icon-sm'}
      onClick={handleClick}
      aria-pressed={inShelf}
      aria-label={withLabel ? undefined : label}
      className={className}
    >
      <Icon
        key={inShelf ? 'in' : 'out'}
        className={
          inShelf
            ? 'duration-200 ease-spring animate-in zoom-in-75 motion-reduce:animate-none'
            : undefined
        }
      />
      {withLabel ? label : null}
    </Button>
  )
}
