import { z } from 'zod'

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

export const isDev = import.meta.env.DEV && import.meta.env.MODE !== 'test'
