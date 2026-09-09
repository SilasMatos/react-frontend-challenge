import { z } from 'zod'

/**
 * Fonte única de acesso às variáveis de ambiente.
 * Nenhum outro módulo deve ler `import.meta.env` diretamente — importe `env` daqui.
 *
 * O app roda sem `.env`: a base URL tem default e a API key é opcional
 * (a Google Books API funciona sem chave, sujeita a rate limit).
 */
const envSchema = z.object({
  VITE_GOOGLE_BOOKS_BASE_URL: z
    .url()
    .default('https://www.googleapis.com/books/v1'),
  VITE_GOOGLE_BOOKS_API_KEY: z.string().min(1).optional(),
})

const parsed = envSchema.safeParse(import.meta.env)

if (!parsed.success) {
  console.error(
    'Variáveis de ambiente inválidas:',
    parsed.error.flatten().fieldErrors,
  )
  throw new Error('Configuração de ambiente inválida — confira o .env.example.')
}

export const env = parsed.data

/**
 * `true` só no dev server do Vite (o `vitest` roda com `MODE === 'test'`).
 * Ponto único de leitura de flags do Vite — gate para ferramentas de dev
 * como o React Query Devtools.
 */
export const isDev = import.meta.env.DEV && import.meta.env.MODE !== 'test'
