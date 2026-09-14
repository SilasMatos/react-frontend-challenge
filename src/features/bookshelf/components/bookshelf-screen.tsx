import { lazy, Suspense } from 'react'
import { Frown, Library } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/empty-state'
import { ErrorBoundary } from '@/components/error-boundary'
import { useBookshelf } from '../hooks/use-bookshelf'

const BookshelfTable = lazy(() =>
  import('./bookshelf-table').then((module) => ({
    default: module.BookshelfTable,
  })),
)

export function BookshelfScreen() {
  const { items, count } = useBookshelf()

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 enter-fade sm:px-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Minha estante</h1>
        <p className="text-sm text-muted-foreground" aria-live="polite">
          {count === 0
            ? 'Os livros que você salvar aparecem aqui.'
            : `${count} ${count === 1 ? 'livro salvo' : 'livros salvos'}.`}
        </p>
      </header>

      {count === 0 ? (
        <EmptyState
          icon={Library}
          title="Sua estante está vazia"
          description="Adicione livros pela tela de descoberta para começar."
          action={
            <Button render={<Link to="/" />} variant="outline" size="sm">
              Descobrir livros
            </Button>
          }
        />
      ) : (
        <ErrorBoundary
          fallback={(_, reset) => (
            <EmptyState
              icon={Frown}
              title="Não foi possível carregar a estante"
              description="Algo deu errado ao montar a tabela. Tente de novo."
              action={
                <Button type="button" variant="outline" size="sm" onClick={reset}>
                  Tentar de novo
                </Button>
              }
            />
          )}
        >
          <Suspense fallback={<TableSkeleton rows={count} />}>
            <BookshelfTable items={items} />
          </Suspense>
        </ErrorBoundary>
      )}
    </main>
  )
}

function TableSkeleton({ rows }: { rows: number }) {
  return (
    <div
      aria-busy="true"
      aria-label="Carregando estante"
      className="overflow-hidden rounded-lg border border-border bg-background"
    >
      <div className="flex h-10 items-center gap-3 border-b border-border bg-muted/50 px-3">
        <Skeleton className="ml-[3.75rem] h-3 w-12" />
        <Skeleton className="ml-auto hidden h-3 w-12 md:block" />
        <Skeleton className="hidden h-3 w-16 sm:block" />
        <Skeleton className="h-3 w-12" />
        <div className="w-14" />
      </div>
      {Array.from({ length: Math.min(rows, 10) }, (_, index) => (
        <div
          key={index}
          className="flex h-20 items-center gap-3 border-b border-border px-3 last:border-0"
        >
          <Skeleton className="h-16 w-11 shrink-0 rounded-md" />
          <div className="flex min-w-0 flex-1 flex-col gap-1.5">
            <Skeleton className="h-3.5 w-3/5 max-w-64" />
            <Skeleton className="h-3 w-2/5 max-w-40 md:hidden" />
          </div>
          <Skeleton className="hidden h-3 w-32 md:block" />
          <Skeleton className="hidden h-3 w-10 sm:block" />
          <Skeleton className="h-7 w-[7.5rem] rounded-full" />
          <Skeleton className="size-7 shrink-0 rounded-md" />
        </div>
      ))}
    </div>
  )
}
