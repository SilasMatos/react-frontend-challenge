import { useEffect, type ReactNode } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import type { Book } from '@/types/book'
import { useGridColumns } from '../hooks/use-grid-columns'
import { BookCard } from './book-card'
import { BookCardSkeleton } from './book-card-skeleton'

const CARD_HEIGHT = 122
const GAP = 12
const OVERSCAN_ROWS = 3
const STAGGER_MS = 30

export interface VirtualBookGridProps {
  books: Book[]
  windowStart?: number
  scrollRoot?: Element | null
  renderAction?: (book: Book) => ReactNode
  onReachStart?: () => void
}

export function VirtualBookGrid({
  books,
  windowStart = 0,
  scrollRoot = null,
  renderAction,
  onReachStart,
}: VirtualBookGridProps) {
  const columns = useGridColumns()
  const count = windowStart + books.length
  const rowCount = Math.ceil(count / columns)

  const virtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => scrollRoot,
    estimateSize: () => CARD_HEIGHT,
    gap: GAP,
    overscan: OVERSCAN_ROWS,
  })

  const measured = (virtualizer.scrollRect?.height ?? 0) > 0
  const rows = measured
    ? virtualizer.getVirtualItems()
    : Array.from({ length: rowCount }, (_, index) => ({
        index,
        key: index,
        start: 0,
      }))

  const firstIndex = (rows[0]?.index ?? 0) * columns
  const reachedStart = windowStart > 0 && firstIndex < windowStart

  useEffect(() => {
    if (reachedStart) onReachStart?.()
  }, [reachedStart, onReachStart])

  function renderCell(index: number) {
    if (index >= count) return null
    const column = index % columns
    if (index < windowStart) {
      return (
        <div key={`pending-${index}`} role="listitem" aria-busy="true">
          <BookCardSkeleton />
        </div>
      )
    }
    const book = books[index - windowStart]
    return (
      <div
        key={book.id}
        role="listitem"
        className="enter-rise"
        style={{ animationDelay: `${column * STAGGER_MS}ms` }}
      >
        <BookCard book={book} action={renderAction?.(book)} className="h-full" />
      </div>
    )
  }

  const gridStyle = { gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }

  if (!measured) {
    return (
      <div role="list" className="grid gap-3" style={gridStyle}>
        {Array.from({ length: count }, (_, index) => renderCell(index))}
      </div>
    )
  }

  return (
    <div
      role="list"
      data-slot="virtual-book-grid"
      className="relative w-full"
      style={{ height: virtualizer.getTotalSize() }}
    >
      {rows.map((row) => (
        <div
          key={row.key}
          data-index={row.index}
          ref={virtualizer.measureElement}
          className="absolute inset-x-0 top-0 grid gap-3"
          style={{ ...gridStyle, transform: `translateY(${row.start}px)` }}
        >
          {Array.from({ length: columns }, (_, column) =>
            renderCell(row.index * columns + column),
          )}
        </div>
      ))}
    </div>
  )
}
