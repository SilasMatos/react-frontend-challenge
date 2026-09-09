import { lazy, Suspense } from 'react'
import { Library } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/empty-state'
import { useBookshelf } from '../hooks/use-bookshelf'

// A Data Grid carrega o TanStack Table (~60 kB gzip) — só quando a Estante tem
// livros. Mantém o import de `@/features/bookshelf` leve para o resto do app.
const BookshelfTable = lazy(() =>
  import('./bookshelf-table').then((module) => ({
    default: module.BookshelfTable,
  })),
)

/** A Estante: tabela dos livros salvos ou estado vazio. */
export function BookshelfScreen() {
  const { items, count } = useBookshelf()

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 duration-300 ease-out-quart animate-in fade-in motion-reduce:animate-none sm:px-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold tracking-tight">Minha estante</h1>
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
          description="Busque no acervo e adicione livros para acompanhar o que quer ler, o que está lendo e o que já concluiu."
          action={
            <Button render={<Link to="/" />} variant="outline" size="sm">
              Descobrir livros
            </Button>
          }
        />
      ) : (
        <Suspense fallback={<TableSkeleton rows={count} />}>
          <BookshelfTable items={items} />
        </Suspense>
      )}
    </main>
  )
}

function TableSkeleton({ rows }: { rows: number }) {
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-border p-3">
      <Skeleton className="h-8 w-full" />
      {Array.from({ length: Math.min(rows, 8) }, (_, index) => (
        <Skeleton key={index} className="h-12 w-full" />
      ))}
    </div>
  )
}
