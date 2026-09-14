import { httpClient } from '@/http/http-client'
import {
  googleBooksListSchema,
  googleVolumeSchema,
  type GoogleBooksListResponse,
  type GoogleVolume,
} from '../schemas/google-books-schema'
import type { PrintType, SortOrder } from '../types/search'

export interface SearchVolumesParams {
  query: string
  printType: PrintType
  orderBy: SortOrder
  startIndex: number
  maxResults: number
  signal?: AbortSignal
}

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
      printType: printType === 'all' ? undefined : printType,
      orderBy,
      startIndex,
      maxResults,
    },
    signal,
  })

  return googleBooksListSchema.parse(raw)
}

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
