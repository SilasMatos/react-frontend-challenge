import { LogOut } from 'lucide-react'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { AppHeader } from '@/components/layout/app-header'
import { Button } from '@/components/ui/button'
import { getAuthSession, useAuth } from '@/features/auth'
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
      <AppHeader
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
