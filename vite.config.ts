import path from 'node:path'
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Roteamento (TanStack Router): o pacote e o plugin já estão instalados.
// Após criar `src/routes/__root.tsx`, importe `tanstackRouter` de
// `@tanstack/router-plugin/vite` e adicione-o como PRIMEIRO plugin com:
//   routesDirectory: 'src/routes'
//   generatedRouteTree: 'src/routeTree.gen.ts'
//   autoCodeSplitting: true

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
  },
})
