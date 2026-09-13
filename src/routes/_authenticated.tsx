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
  'relative inline-flex h-7 items-center gap-1.5 rounded-md px-2 text-[0.8rem] text-muted-foreground outline-none transition-colors duration-200 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring after:absolute after:inset-x-2 after:-bottom-px after:h-0.5 after:scale-x-0 after:rounded-full after:bg-primary after:transition-transform after:duration-300 after:ease-out-quart hover:after:scale-x-100 motion-reduce:after:transition-none'

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
              activeProps={{ className: 'font-medium text-foreground after:scale-x-100' }}
            >
              Descobrir
            </Link>
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
      <Outlet />
    </div>
  )
}
