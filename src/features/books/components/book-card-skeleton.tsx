import { Skeleton } from '@/components/ui/skeleton'

/** Placeholder de carregamento com a mesma silhueta do `BookCard`. */
export function BookCardSkeleton() {
  return (
    <div
      data-slot="book-card-skeleton"
      className="flex gap-3 rounded-lg border border-border bg-card p-3"
    >
      <Skeleton className="h-24 w-16 shrink-0 rounded-md" />
      <div className="flex flex-1 flex-col gap-2 py-1">
        <Skeleton className="h-3.5 w-4/5" />
        <Skeleton className="h-3.5 w-3/5" />
        <Skeleton className="mt-auto h-3 w-10" />
      </div>
    </div>
  )
}
