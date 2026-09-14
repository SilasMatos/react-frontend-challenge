import { BookmarkCheck, BookmarkPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Book } from '@/types/book'
import { useShelfToggle } from '../hooks/use-shelf-toggle'

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
  const { inShelf, label, toggle } = useShelfToggle(book)
  const Icon = inShelf ? BookmarkCheck : BookmarkPlus

  return (
    <Button
      type="button"
      data-slot="shelf-toggle-button"
      variant={inShelf ? 'secondary' : 'outline'}
      size={withLabel ? 'default' : 'icon-sm'}
      onClick={toggle}
      aria-pressed={inShelf}
      aria-label={withLabel ? undefined : label}
      className={className}
    >
      <Icon key={inShelf ? 'in' : 'out'} className={inShelf ? 'pop-in' : undefined} />
      {withLabel ? label : null}
    </Button>
  )
}
