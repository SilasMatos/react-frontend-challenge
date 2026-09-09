import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <main className="grid min-h-dvh place-items-center bg-background px-6 text-foreground">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Libris</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Roteamento configurado (TanStack Router, file-based). Próximos passos:
          autenticação simulada e o módulo de descoberta.
        </p>
      </div>
    </main>
  )
}
