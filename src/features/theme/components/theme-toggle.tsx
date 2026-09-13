import type { ComponentProps } from 'react'
import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from '../hooks/use-theme'

export type ThemeToggleProps = Omit<
  ComponentProps<typeof Button>,
  'onClick' | 'children'
>

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
      <span
        key={theme}
        className="inline-flex animate-in zoom-in-50 spin-in-45 duration-300 ease-out-quart motion-reduce:animate-none"
      >
        {theme === 'dark' ? <Sun /> : <Moon />}
      </span>
    </Button>
  )
}
