import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { ChevronDown, ChevronUp, ChevronsUpDown } from 'lucide-react'
import {
  createColumnHelper,
  createSortedRowModel,
  rowSortingFeature,
  tableFeatures,
  useTable,
  type SortDirection,
  type SortingState,
} from '@tanstack/react-table'
import { twMerge } from 'tailwind-merge'
import { ConfirmButton } from '@/components/confirm-button'
import { BookCover } from '@/components/book-cover'
import { formatPublishedDate } from '@/utils/format-date'
import { normalizeText } from '@/utils/normalize-text'
import { useBookshelf } from '../hooks/use-bookshelf'
import { useShelfToast } from '../hooks/use-shelf-toast'
import { BOOK_STATUS_ORDER, type BookshelfItem } from '../types/bookshelf'
import { ShelfStatusSelect } from './shelf-status-select'

const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
})

const helper = createColumnHelper<typeof features, BookshelfItem>()

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
    cell: ({ row }) => (
      <Link
        to="/book/$bookId"
        params={{ bookId: row.original.book.id }}
        className="font-medium text-foreground underline-offset-2 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring"
      >
        {row.original.book.title}
      </Link>
    ),
  }),
  helper.accessor((item) => item.book.authors.join(', '), {
    id: 'authors',
    header: 'Autor',
    enableSorting: false,
    cell: ({ getValue }) => (
      <span className="text-muted-foreground">
        {getValue() || 'Autor desconhecido'}
      </span>
    ),
  }),
  helper.accessor((item) => item.book.publishedDate ?? '', {
    id: 'publishedDate',
    header: 'Publicação',
    enableSorting: false,
    cell: ({ row }) => (
      <span className="tabular-nums text-muted-foreground">
        {formatPublishedDate(row.original.book.publishedDate)}
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
  const [sorting, setSorting] = useState<SortingState>([])

  const table = useTable({
    features,
    columns,
    data: items,
    getRowId: (item) => item.book.id,
    state: { sorting },
    onSortingChange: setSorting,
  })

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full min-w-[720px] border-collapse text-sm">
        <caption className="sr-only">Livros salvos na sua estante</caption>
        <thead>
          {table.getHeaderGroups().map((group) => (
            <tr key={group.id} className="border-b border-border bg-muted/40">
              {group.headers.map((header) => {
                const canSort = header.column.getCanSort()
                const sorted = header.column.getIsSorted()

                return (
                  <th
                    key={header.id}
                    scope="col"
                    aria-sort={canSort ? ARIA_SORT[String(sorted)] : undefined}
                    className="px-3 py-2.5 text-left font-medium text-muted-foreground"
                  >
                    {header.isPlaceholder ? null : canSort ? (
                      <button
                        type="button"
                        onClick={header.column.getToggleSortingHandler()}
                        className="-mx-1 inline-flex items-center gap-1 rounded px-1 py-0.5 outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
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
              className={twMerge(
                'border-b border-border transition-[opacity,background-color] duration-200 ease-out last:border-0 hover:bg-muted/30',
                'has-[[data-removing]]:pointer-events-none has-[[data-removing]]:opacity-40',
                'motion-reduce:transition-none',
              )}
            >
              {row.getAllCells().map((cell) => (
                <td key={cell.id} className="px-3 py-2 align-middle">
                  <table.FlexRender cell={cell} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
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
        'size-3.5 duration-150 animate-in fade-in motion-reduce:animate-none',
        direction ? 'text-foreground' : 'text-muted-foreground/50',
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
        confirmLabel="Confirmar remoção"
        cancelLabel="Cancelar remoção"
      />
    </div>
  )
}
