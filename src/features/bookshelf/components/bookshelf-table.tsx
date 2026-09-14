import { useEffect, useState, type MouseEvent } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { ChevronDown, ChevronUp, ChevronsUpDown } from 'lucide-react'
import {
  createColumnHelper,
  createPaginatedRowModel,
  createSortedRowModel,
  rowPaginationFeature,
  rowSortingFeature,
  tableFeatures,
  useTable,
  type PaginationState,
  type SortDirection,
  type SortingState,
} from '@tanstack/react-table'
import { twMerge } from 'tailwind-merge'
import { ConfirmButton } from '@/components/confirm-button'
import { BookCover } from '@/components/book-cover'
import { formatPublishedYear } from '@/utils/format-date'
import { normalizeText } from '@/utils/normalize-text'
import { useBookshelf } from '../hooks/use-bookshelf'
import { useShelfToast } from '../hooks/use-shelf-toast'
import { BOOK_STATUS_ORDER, type BookshelfItem } from '../types/bookshelf'
import { BookshelfPagination } from './bookshelf-pagination'
import { ShelfStatusSelect } from './shelf-status-select'

export const BOOKSHELF_PAGE_SIZE = 10

const features = tableFeatures({
  rowSortingFeature,
  rowPaginationFeature,
  sortedRowModel: createSortedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
})

const helper = createColumnHelper<typeof features, BookshelfItem>()

const COLUMN_CLASS: Record<string, string> = {
  cover: 'w-[4.5rem] pr-0',
  title: '',
  authors: 'hidden w-[26%] md:table-cell',
  publishedDate: 'hidden w-24 sm:table-cell',
  status: 'w-[8rem] sm:w-[9.5rem]',
  actions: 'w-14 pl-0 text-right',
}

function authorsOf(item: BookshelfItem): string {
  return item.book.authors.join(', ')
}

const columns = helper.columns([
  helper.display({
    id: 'cover',
    header: () => <span className="sr-only">Capa</span>,
    cell: ({ row }) => (
      <BookCover
        book={row.original.book}
        size="sm"
        className="h-16 w-11 [&_svg]:size-4"
      />
    ),
  }),
  helper.accessor((item) => normalizeText(item.book.title), {
    id: 'title',
    header: 'Título',
    cell: ({ row }) => {
      const authors = authorsOf(row.original)
      return (
        <div className="flex min-w-0 flex-col gap-0.5">
          <Link
            to="/book/$bookId"
            params={{ bookId: row.original.book.id }}
            title={row.original.book.title}
            className="line-clamp-2 max-w-[36ch] rounded-sm text-[0.9rem] leading-snug font-semibold break-words text-foreground underline-offset-3 outline-none group-hover/row:underline focus-visible:ring-2 focus-visible:ring-ring"
          >
            {row.original.book.title}
          </Link>
          <span className="truncate text-xs text-muted-foreground md:hidden">
            {authors || 'Autor desconhecido'}
          </span>
        </div>
      )
    },
  }),
  helper.accessor(authorsOf, {
    id: 'authors',
    header: 'Autor',
    enableSorting: false,
    cell: ({ getValue }) => {
      const authors = getValue()
      return (
        <span
          title={authors || undefined}
          className="block max-w-[24ch] truncate text-muted-foreground"
        >
          {authors || 'Autor desconhecido'}
        </span>
      )
    },
  }),
  helper.accessor((item) => item.book.publishedDate ?? '', {
    id: 'publishedDate',
    header: 'Publicação',
    enableSorting: false,
    cell: ({ row }) => (
      <span className="tabular-nums text-muted-foreground">
        {formatPublishedYear(row.original.book.publishedDate)}
      </span>
    ),
  }),
  helper.accessor((item) => BOOK_STATUS_ORDER[item.status], {
    id: 'status',
    header: 'Status',
    sortDescFirst: false,
    cell: ({ row }) => <StatusCell item={row.original} />,
  }),
  helper.display({
    id: 'actions',
    header: () => <span className="sr-only">Ações</span>,
    cell: ({ row }) => <ActionsCell item={row.original} />,
  }),
])

const ARIA_SORT: Record<string, 'ascending' | 'descending' | 'none'> = {
  asc: 'ascending',
  desc: 'descending',
  false: 'none',
}

export interface BookshelfTableProps {
  items: BookshelfItem[]
}

export function BookshelfTable({ items }: BookshelfTableProps) {
  const navigate = useNavigate()
  const [sorting, setSorting] = useState<SortingState>([])
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: BOOKSHELF_PAGE_SIZE,
  })

  const table = useTable({
    features,
    columns,
    data: items,
    getRowId: (item) => item.book.id,
    state: { sorting, pagination },
    onSortingChange: (updater) => {
      setSorting(updater)
      setPagination((prev) => ({ ...prev, pageIndex: 0 }))
    },
    onPaginationChange: setPagination,
    autoResetPageIndex: false,
  })

  const pageCount = table.getPageCount()
  const lastPageIndex = Math.max(pageCount - 1, 0)

  useEffect(() => {
    if (pagination.pageIndex > lastPageIndex) {
      setPagination((prev) => ({ ...prev, pageIndex: lastPageIndex }))
    }
  }, [pagination.pageIndex, lastPageIndex])

  const firstRow = pagination.pageIndex * pagination.pageSize + 1
  const lastRow = Math.min(firstRow + pagination.pageSize - 1, items.length)

  function openBook(event: MouseEvent<HTMLTableRowElement>, item: BookshelfItem) {
    const target = event.target as HTMLElement
    if (!event.currentTarget.contains(target)) return
    if (target.closest('a, button, [role="combobox"], [data-slot="confirm-button"]')) return
    if (window.getSelection()?.toString()) return
    void navigate({ to: '/book/$bookId', params: { bookId: item.book.id } })
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="overflow-x-auto rounded-lg border border-border bg-background">
        <table className="w-full table-fixed border-collapse text-sm">
          <caption className="sr-only">Livros salvos na sua estante</caption>
          <thead>
            {table.getHeaderGroups().map((group) => (
              <tr key={group.id} className="border-b border-border bg-muted/50">
                {group.headers.map((header) => {
                  const canSort = header.column.getCanSort()
                  const sorted = header.column.getIsSorted()

                  return (
                    <th
                      key={header.id}
                      scope="col"
                      aria-sort={
                        canSort ? ARIA_SORT[String(sorted)] : undefined
                      }
                      className={twMerge(
                        'h-10 px-3 text-left text-xs font-medium text-muted-foreground',
                        COLUMN_CLASS[header.column.id],
                      )}
                    >
                      {header.isPlaceholder ? null : canSort ? (
                        <button
                          type="button"
                          data-sorted={sorted || undefined}
                          onClick={header.column.getToggleSortingHandler()}
                          className="group/sort -mx-1.5 inline-flex h-7 items-center gap-1 rounded-md px-1.5 outline-none transition-colors hover:bg-foreground/5 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring data-sorted:text-foreground"
                        >
                          <table.FlexRender header={header} />
                          <SortIndicator direction={sorted} />
                        </button>
                      ) : (
                        <table.FlexRender header={header} />
                      )}
                    </th>
                  )
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                onClick={(event) => openBook(event, row.original)}
                className={twMerge(
                  'group/row cursor-pointer border-b border-border transition-[opacity,background-color] duration-normal last:border-0 hover:bg-muted/40',
                  'has-[[data-removing]]:pointer-events-none has-[[data-removing]]:opacity-40',
                  'motion-reduce:transition-none',
                )}
              >
                {row.getAllCells().map((cell) => (
                  <td
                    key={cell.id}
                    className={twMerge(
                      'h-20 px-3 py-2 align-middle',
                      COLUMN_CLASS[cell.column.id],
                    )}
                  >
                    <table.FlexRender cell={cell} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pageCount > 1 ? (
        <footer className="flex flex-wrap items-center justify-between gap-3 px-1">
          <p className="text-xs text-muted-foreground" aria-live="polite">
            <span className="tabular-nums">
              {firstRow}–{lastRow}
            </span>{' '}
            de <span className="tabular-nums">{items.length}</span> livros
          </p>
          <BookshelfPagination
            pageIndex={pagination.pageIndex}
            pageCount={pageCount}
            onPageChange={(pageIndex) => table.setPageIndex(pageIndex)}
          />
        </footer>
      ) : null}
    </div>
  )
}

function SortIndicator({ direction }: { direction: false | SortDirection }) {
  const Icon =
    direction === 'asc'
      ? ChevronUp
      : direction === 'desc'
        ? ChevronDown
        : ChevronsUpDown

  return (
    <Icon
      key={String(direction)}
      aria-hidden
      className={twMerge(
        'size-3.5 enter-fade duration-fast transition-colors',
        direction
          ? 'text-foreground'
          : 'text-muted-foreground/40 group-hover/sort:text-muted-foreground',
      )}
    />
  )
}

const ROW_EXIT_MS = 200

function StatusCell({ item }: { item: BookshelfItem }) {
  const { setStatus } = useBookshelf()
  const [flashes, setFlashes] = useState(0)

  function handleChange(status: BookshelfItem['status']) {
    if (status === item.status) return
    setStatus(item.book.id, status)
    setFlashes((count) => count + 1)
  }

  return (
    <div className="relative isolate -mx-1.5 w-fit rounded-md px-1.5">
      {flashes > 0 ? (
        <span
          key={flashes}
          aria-hidden
          className="animate-row-flash pointer-events-none absolute inset-0 -z-10 rounded-md motion-reduce:hidden"
        />
      ) : null}
      <ShelfStatusSelect
        value={item.status}
        onChange={handleChange}
        ariaLabel={`Status de ${item.book.title}`}
        className="w-fit sm:w-[7.5rem]"
      />
    </div>
  )
}

function ActionsCell({ item }: { item: BookshelfItem }) {
  const { remove } = useBookshelf()
  const { notifyRemoved } = useShelfToast()
  const [removing, setRemoving] = useState(false)

  function handleConfirm() {
    setRemoving(true)
    window.setTimeout(() => {
      remove(item.book.id)
      notifyRemoved(item.book, item.status)
    }, ROW_EXIT_MS)
  }

  return (
    <div className="flex justify-end">
      <ConfirmButton
        onConfirm={handleConfirm}
        disabled={removing}
        data-removing={removing ? '' : undefined}
        label={`Remover ${item.book.title} da estante`}
        hint="Remover da estante"
        confirmLabel="Confirmar remoção"
        cancelLabel="Cancelar remoção"
      />
    </div>
  )
}
