import type { ComponentProps } from 'react'
import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from '../hooks/use-theme'

export type ThemeToggleProps = Omit<
  ComponentProps<typeof Button>,
  'onClick' | 'children'
>

/** Alterna claro/escuro. Mostra o ícone do tema para o qual o clique leva. */
export function ThemeToggle(props: ThemeToggleProps) {
  const { theme, toggle } = useTheme()
  const label = theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label={label}
      title={label}
      onClick={toggle}
      {...props}
    >
      {theme === 'dark' ? <Sun /> : <Moon />}
    </Button>
  )
}
