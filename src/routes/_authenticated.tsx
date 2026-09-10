import { LogOut } from 'lucide-react'
import {
  createFileRoute,
  Link,
  Outlet,
  redirect,
} from '@tanstack/react-router'
import { AppHeader } from '@/components/layout/app-header'
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

const navLinkClass =
  'inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-sm text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring'

function AuthenticatedLayout() {
  const navigate = Route.useNavigate()
  const { user, logout } = useAuth()

  function handleLogout() {
    logout()
    void navigate({ to: '/login' })
  }

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <AppHeader
        nav={
          <>
            <Link
              to="/"
              activeOptions={{ exact: true, includeSearch: false }}
              className={navLinkClass}
              activeProps={{ className: 'font-medium text-foreground' }}
            >
              Descobrir
            </Link>
            <ShelfNavLink />
          </>
        }
        actions={
          <>
            <ThemeToggle />
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
      <Outlet />
    </div>
  )
}
