import type { Book } from '@/types/book'
import type { Paginated } from '@/types/common'
import type {
  GoogleBooksListResponse,
  GoogleVolume,
  GoogleVolumeInfo,
} from '../schemas/google-books-schema'

function toSecureUrl(url: string | undefined): string | null {
  if (!url) return null
  return url.replace(/^http:\/\//i, 'https://')
}

function cleanString(value: string | undefined): string | null {
  const trimmed = value?.trim()
  return trimmed ? trimmed : null
}

function cleanStringList(value: string[] | undefined): string[] {
  return value?.map((item) => item.trim()).filter(Boolean) ?? []
}

function pickThumbnail(info: GoogleVolumeInfo): string | null {
  const links = info.imageLinks
  if (!links) return null

  return toSecureUrl(
    links.thumbnail ??
      links.smallThumbnail ??
      links.small ??
      links.medium ??
      links.large ??
      links.extraLarge,
  )
}

export function toBook(volume: GoogleVolume): Book {
  const info = volume.volumeInfo

  return {
    id: volume.id,
    title: cleanString(info.title) ?? 'Título não informado',
    subtitle: cleanString(info.subtitle),
    authors: cleanStringList(info.authors),
    publisher: cleanString(info.publisher),
    publishedDate: cleanString(info.publishedDate),
    description: cleanString(info.description),
    pageCount:
      typeof info.pageCount === 'number' && info.pageCount > 0
        ? info.pageCount
        : null,
    categories: cleanStringList(info.categories),
    thumbnail: pickThumbnail(info),
    previewLink: toSecureUrl(info.previewLink),
    infoLink: toSecureUrl(info.infoLink),
    language: cleanString(info.language),
  }
}

export function toBookPage(
  response: GoogleBooksListResponse,
  startIndex: number,
  pageSize: number,
): Paginated<Book> {
  return {
    items: response.items.map(toBook),
    totalItems: response.totalItems,
    startIndex,
    pageSize,
  }
}
