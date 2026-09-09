import '@testing-library/jest-dom/vitest'
import { cleanup, configure } from '@testing-library/react'
import { afterEach } from 'vitest'

// Os testes de integração de rota montam a árvore real do TanStack Router (com
// `autoCodeSplitting`, cada rota é um import dinâmico). Sob carga da suíte
// inteira, o primeiro render passa dos 1000ms padrão do `findBy*` — subimos a
// folga para o mesmo patamar do timeout de teste.
configure({ asyncUtilTimeout: 5000 })

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
