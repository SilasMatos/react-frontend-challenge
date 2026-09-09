import { httpClient } from '@/http/http-client'
import {
  googleBooksListSchema,
  googleVolumeSchema,
  type GoogleBooksListResponse,
  type GoogleVolume,
} from '../schemas/google-books-schema'
import type { PrintType, SortOrder } from '../types/search'

export interface SearchVolumesParams {
  /** Termo de busca (`q`). Obrigatório — a API responde 400 sem ele. */
  query: string
  printType: PrintType
  orderBy: SortOrder
  /** Deslocamento na lista de resultados (paginação da API). */
  startIndex: number
  /** Quantidade de volumes a retornar (teto da API: 40). */
  maxResults: number
  signal?: AbortSignal
}

/**
 * Busca volumes na Google Books API.
 *
 * Só faz HTTP + validação do envelope de resposta com Zod; a transformação para
 * o modelo de domínio (`Book`) é responsabilidade do mapper.
 */
export async function searchVolumes({
  query,
  printType,
  orderBy,
  startIndex,
  maxResults,
  signal,
}: SearchVolumesParams): Promise<GoogleBooksListResponse> {
  const raw = await httpClient.get<unknown>('/volumes', {
    params: {
      q: query,
      // `all` é o default da API — não precisa ir na URL.
      printType: printType === 'all' ? undefined : printType,
      orderBy,
      startIndex,
      maxResults,
    },
    signal,
  })

  return googleBooksListSchema.parse(raw)
}

/**
 * Detalhe de um volume (`GET /volumes/:id`). Só HTTP + validação Zod; o mapper
 * transforma no modelo de domínio.
 */
export async function getVolume(
  bookId: string,
  signal?: AbortSignal,
): Promise<GoogleVolume> {
  const raw = await httpClient.get<unknown>(
    `/volumes/${encodeURIComponent(bookId)}`,
    { signal },
  )

  return googleVolumeSchema.parse(raw)
}
