import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { DiscoveryScreen, PRINT_TYPES, SORT_ORDERS } from '@/features/books'
import { ShelfToggleButton } from '@/features/bookshelf'

const discoverySearchSchema = z.object({
  q: z.string().trim().min(1).optional().catch(undefined),
  printType: z.enum(PRINT_TYPES).optional().catch(undefined),
  orderBy: z.enum(SORT_ORDERS).optional().catch(undefined),
})

export const Route = createFileRoute('/_authenticated/')({
  validateSearch: discoverySearchSchema,
  component: DiscoveryRoute,
})

function DiscoveryRoute() {
  const { q, printType, orderBy } = Route.useSearch()
  const navigate = Route.useNavigate()

  return (
    <DiscoveryScreen
      query={q ?? ''}
      filters={{
        printType: printType ?? 'all',
        orderBy: orderBy ?? 'relevance',
      }}
      onQueryChange={(value) =>
        void navigate({
          search: (prev) => ({ ...prev, q: value.trim() || undefined }),
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
          }),
          replace: true,
        })
      }
      renderAction={(book) => <ShelfToggleButton book={book} />}
    />
  )
}
