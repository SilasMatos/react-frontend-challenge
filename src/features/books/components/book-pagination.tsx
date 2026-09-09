import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export interface BookPaginationProps {
  page: number
  pageCount: number
  hasPreviousPage: boolean
  hasNextPage: boolean
  rangeStart: number
  rangeEnd: number
  totalItems: number
  onPageChange: (page: number) => void
  busy?: boolean
}

const formatCount = (value: number) => value.toLocaleString('pt-BR')

/** Navegação por páginas da busca (paginação por `startIndex` na API). */
export function BookPagination({
  page,
  pageCount,
  hasPreviousPage,
  hasNextPage,
  rangeStart,
  rangeEnd,
  totalItems,
  onPageChange,
  busy = false,
}: BookPaginationProps) {
  return (
    <nav
      data-slot="book-pagination"
      aria-label="Paginação dos resultados"
      className="flex flex-wrap items-center justify-between gap-3 text-sm"
    >
      <p className="text-muted-foreground" aria-live="polite">
        <span className="tabular-nums">
          {formatCount(rangeStart)}–{formatCount(rangeEnd)}
        </span>{' '}
        de <span className="tabular-nums">{formatCount(totalItems)}</span>
      </p>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={!hasPreviousPage || busy}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft />
          Anterior
        </Button>
        <span className="tabular-nums text-muted-foreground">
          {page + 1} / {pageCount}
        </span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={!hasNextPage || busy}
          onClick={() => onPageChange(page + 1)}
        >
          Próxima
          <ChevronRight />
        </Button>
      </div>
    </nav>
  )
}
