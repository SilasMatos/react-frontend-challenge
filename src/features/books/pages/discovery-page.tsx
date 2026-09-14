import { useEffect, type ReactNode } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { BookBackground } from '@/components/book-background'
import type { Book } from '@/types/book'
import { DiscoveryScreen } from '../components/discovery-screen'
import { useLastSearchStore } from '../store/last-search-store'

const route = getRouteApi('/_authenticated/')

export interface DiscoveryPageProps {
  renderAction?: (book: Book) => ReactNode
}

export function DiscoveryPage({ renderAction }: DiscoveryPageProps) {
  const { q, printType, orderBy } = route.useSearch()
  const navigate = route.useNavigate()
  const remember = useLastSearchStore((state) => state.remember)

  useEffect(() => {
    remember({ q, printType, orderBy })
  }, [remember, q, printType, orderBy])

  return (
    <div className="relative isolate">
      <BookBackground className="fixed inset-0 -z-10 h-full w-full" />
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
              orderBy: filters.orderBy === 'relevance' ? undefined : filters.orderBy,
            }),
            replace: true,
          })
        }
        renderAction={renderAction}
      />
    </div>
  )
}
