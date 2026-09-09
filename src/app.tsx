import { AppProviders } from '@/providers/app-providers'

export function App() {
  return (
    <AppProviders>
      <main className="grid min-h-dvh place-items-center bg-background px-6 text-foreground">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Libris</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Setup inicial concluído — estrutura modular feature-based pronta para
            a implementação do case.
          </p>
        </div>
      </main>
    </AppProviders>
  )
}
