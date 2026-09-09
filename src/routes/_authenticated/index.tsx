import { createFileRoute } from '@tanstack/react-router'
import { useAuth } from '@/features/auth'

export const Route = createFileRoute('/_authenticated/')({
  component: HomePage,
})

function HomePage() {
  const { user } = useAuth()

  return (
    <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="text-xl font-semibold tracking-tight">
        Olá, {user?.name ?? 'leitor'}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        A busca de livros e a sua estante entram aqui nos próximos incrementos.
      </p>
    </main>
  )
}
