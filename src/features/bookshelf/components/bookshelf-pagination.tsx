import { twMerge } from 'tailwind-merge'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { getPageRange, PAGE_GAP } from '../utils/page-range'

export interface BookshelfPaginationProps {
  pageIndex: number
  pageCount: number
  onPageChange: (pageIndex: number) => void
  className?: string
}

export function BookshelfPagination({
  pageIndex,
  pageCount,
  onPageChange,
  className,
}: BookshelfPaginationProps) {
  const canPrevious = pageIndex > 0
  const canNext = pageIndex < pageCount - 1

  return (
    <Pagination
      aria-label="Paginação da estante"
      className={twMerge('mx-0 w-auto', className)}
    >
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            text="Anterior"
            aria-label="Página anterior"
            aria-disabled={!canPrevious || undefined}
            className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
            onClick={() => canPrevious && onPageChange(pageIndex - 1)}
          />
        </PaginationItem>

        {getPageRange(pageIndex, pageCount).map((page, position) =>
          page === PAGE_GAP ? (
            <PaginationItem key={`gap-${position}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={page}>
              <PaginationLink
                isActive={page === pageIndex}
                aria-label={`Página ${page + 1}`}
                className="tabular-nums"
                onClick={() => onPageChange(page)}
              >
                {page + 1}
              </PaginationLink>
            </PaginationItem>
          ),
        )}

        <PaginationItem>
          <PaginationNext
            text="Próxima"
            aria-label="Próxima página"
            aria-disabled={!canNext || undefined}
            className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
            onClick={() => canNext && onPageChange(pageIndex + 1)}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
