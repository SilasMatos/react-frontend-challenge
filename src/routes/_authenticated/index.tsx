import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { DiscoveryScreen, PRINT_TYPES, SORT_ORDERS } from '@/features/books'
import { ShelfToggleButton } from '@/features/bookshelf'

const discoverySearchSchema = z.object({
  q: z.string().trim().min(1).optional().catch(undefined),
  printType: z.enum(PRINT_TYPES).optional().catch(undefined),
  orderBy: z.enum(SORT_ORDERS).optional().catch(undefined),
  page: z.coerce.number().int().min(2).optional().catch(undefined),
})

export const Route = createFileRoute('/_authenticated/')({
  validateSearch: discoverySearchSchema,
  component: DiscoveryRoute,
})

function DiscoveryRoute() {
  const { q, printType, orderBy, page } = Route.useSearch()
  const navigate = Route.useNavigate()

  return (
    <DiscoveryScreen
      query={q ?? ''}
      filters={{
        printType: printType ?? 'all',
        orderBy: orderBy ?? 'relevance',
      }}
      page={(page ?? 1) - 1}
      onQueryChange={(value) =>
        void navigate({
          search: (prev) => ({
            ...prev,
            q: value.trim() || undefined,
            page: undefined,
          }),
          replace: true,
        })
      }
      onFiltersChange={(filters) =>
        void navigate({
          search: (prev) => ({
            ...prev,
            printType: filters.printType === 'all' ? undefined : filters.printType,
            orderBy:
              filters.orderBy === 'relevance' ? undefined : filters.orderBy,
            page: undefined,
          }),
          replace: true,
        })
      }
      onPageChange={(nextPage) =>
        void navigate({
          search: (prev) => ({
            ...prev,
            page: nextPage > 0 ? nextPage + 1 : undefined,
          }),
        })
      }
      renderAction={(book) => <ShelfToggleButton book={book} />}
    />
  )
}
