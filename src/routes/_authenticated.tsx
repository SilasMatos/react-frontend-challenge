import { LogOut } from 'lucide-react'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { AppHeader } from '@/components/layout/app-header'
import { NavLink } from '@/components/layout/nav-link'
import { Button } from '@/components/ui/button'
import { getAuthSession, useAuth } from '@/features/auth'
import { ShelfNavLink } from '@/features/bookshelf'
import { ThemeToggle } from '@/features/theme'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: ({ location }) => {
    if (!getAuthSession()) {
      throw redirect({ to: '/login', search: { redirect: location.href } })
    }
  },
  component: AuthenticatedLayout,
})

function AuthenticatedLayout() {
  const navigate = Route.useNavigate()
  const { user, logout } = useAuth()

  function handleLogout() {
    logout()
    void navigate({ to: '/login' })
  }

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <a
        href="#conteudo"
        className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-2 focus-visible:left-2 focus-visible:z-50 focus-visible:rounded-md focus-visible:bg-background focus-visible:px-3 focus-visible:py-2 focus-visible:text-sm focus-visible:font-medium focus-visible:shadow-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        Pular para o conteúdo
      </a>
      <AppHeader
        nav={
          <>
            <NavLink to="/" activeOptions={{ exact: true, includeSearch: false }}>
              Descobrir
            </NavLink>
            <ShelfNavLink />
          </>
        }
        actions={
          <>
            <ThemeToggle size="icon-sm" />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              aria-label={`Sair da conta de ${user?.name ?? 'usuário'}`}
            >
              <LogOut />
              Sair
            </Button>
          </>
        }
      />
      <div id="conteudo" tabIndex={-1} className="outline-none">
        <Outlet />
      </div>
    </div>
  )
}
