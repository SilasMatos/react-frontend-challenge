import { getRouteApi, useRouter } from '@tanstack/react-router'
import { LoginForm } from '../components/login-form'

const route = getRouteApi('/(auth)/login')

export function LoginPage() {
  const router = useRouter()
  const { redirect: redirectTo } = route.useSearch()

  return (
    <main className="grid min-h-dvh place-items-center bg-background px-6 py-10 text-foreground">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-lg enter-rise duration-slower sm:p-8">
        <header className="mb-6 text-center">
          <h1 className="text-xl font-semibold tracking-tight">Libris</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Entre para acessar sua estante virtual.
          </p>
        </header>

        <LoginForm
          onSuccess={() => {
            router.history.push(redirectTo ?? '/')
          }}
        />

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Login simulado: qualquer e-mail válido e senha com mais de 6 caracteres.
        </p>
      </div>
    </main>
  )
}
