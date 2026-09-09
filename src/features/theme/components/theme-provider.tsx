import { useEffect, type ReactNode } from 'react'
import { useTheme } from '../hooks/use-theme'

export interface ThemeProviderProps {
  children: ReactNode
}

/**
 * Sincroniza o tema resolvido com o DOM: classe `.dark` no `<html>` (contrato do
 * Tailwind v4 em `styles.css`) e `color-scheme` para os controles nativos.
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  const { theme } = useTheme()

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    root.style.colorScheme = theme
  }, [theme])

  return <>{children}</>
}
