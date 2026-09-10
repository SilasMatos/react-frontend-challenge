import { env } from '@/config/env'

export type HttpRequestParams = Record<
  string,
  string | number | boolean | null | undefined
>

export interface HttpRequestOptions {
  params?: HttpRequestParams
  signal?: AbortSignal
}

export class HttpError extends Error {
  readonly status: number
  readonly statusText: string

  constructor(status: number, statusText: string, message?: string) {
    super(message ?? friendlyMessageForStatus(status))
    this.name = 'HttpError'
    this.status = status
    this.statusText = statusText
  }
}

function friendlyMessageForStatus(status: number): string {
  if (status === 0) {
    return 'Não foi possível conectar à Google Books API. Verifique sua internet.'
  }
  if (status === 429) {
    return 'Muitas buscas em pouco tempo. Aguarde alguns segundos e tente novamente.'
  }
  if (status === 404) {
    return 'Não encontramos nada para essa busca.'
  }
  if (status >= 500) {
    return 'A Google Books API está instável agora. Tente novamente em instantes.'
  }
  if (status >= 400) {
    return 'Não foi possível completar a requisição. Revise os filtros e tente de novo.'
  }
  return 'Algo deu errado ao consultar a Google Books API.'
}

export function buildRequestUrl(
  baseUrl: string,
  path: string,
  params?: HttpRequestParams,
  apiKey?: string,
): string {
  const normalizedBase = baseUrl.replace(/\/+$/, '')
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  const url = new URL(`${normalizedBase}${normalizedPath}`)

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value === undefined || value === null || value === '') continue
      url.searchParams.set(key, String(value))
    }
  }

  if (apiKey) {
    url.searchParams.set('key', apiKey)
  }

  return url.toString()
}

function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError'
}

async function request<T>(
  path: string,
  options: HttpRequestOptions = {},
): Promise<T> {
  const url = buildRequestUrl(
    env.VITE_GOOGLE_BOOKS_BASE_URL,
    path,
    options.params,
    env.VITE_GOOGLE_BOOKS_API_KEY,
  )

  let response: Response
  try {
    response = await fetch(url, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal: options.signal,
    })
  } catch (error) {
    if (isAbortError(error)) throw error
    throw new HttpError(0, 'Network Error')
  }

  if (!response.ok) {
    throw new HttpError(response.status, response.statusText)
  }

  try {
    return (await response.json()) as T
  } catch {
    throw new HttpError(
      response.status,
      response.statusText,
      'A Google Books API devolveu uma resposta inesperada.',
    )
  }
}

export const httpClient = {
  get: <T>(path: string, options?: HttpRequestOptions): Promise<T> =>
    request<T>(path, options),
}
