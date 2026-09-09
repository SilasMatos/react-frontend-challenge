import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// jsdom não implementa `matchMedia` — necessário para o hook de tema (`use-theme`).
if (typeof window !== 'undefined' && typeof window.matchMedia !== 'function') {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as unknown as MediaQueryList
}

// jsdom só tem um stub de `scrollTo` que loga "Not implemented" — o TanStack
// Router chama no scroll restoration. Substituímos por um no-op silencioso.
window.scrollTo = () => {}

afterEach(() => {
  cleanup()
})
