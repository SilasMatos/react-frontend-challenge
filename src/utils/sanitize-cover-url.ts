export interface SanitizeCoverUrlOptions {
  upgradeZoom?: boolean
}

const GOOGLE_BOOKS_HOST = /\bbooks\.google(?:usercontent)?\./i

const GOOGLE_PLACEHOLDER_SIZES = [
  { width: 128, height: 170 },
  { width: 300, height: 391 },
]

export function sanitizeCoverUrl(
  url: string,
  { upgradeZoom = true }: SanitizeCoverUrlOptions = {},
): string {
  let out = url.trim()
  if (out.startsWith('//')) out = `https:${out}`
  out = out.replace(/^http:\/\//i, 'https://')

  if (GOOGLE_BOOKS_HOST.test(out)) {
    out = out.replace(/([?&])edge=curl(?:&|$)/i, '$1')
    if (upgradeZoom) out = out.replace(/([?&])zoom=1(?=&|$)/i, '$1zoom=2')
    out = out.replace(/[?&]$/, '')
  }
  return out
}

export function isGoogleBooksPlaceholder(
  img: Pick<HTMLImageElement, 'src' | 'naturalWidth' | 'naturalHeight'>,
): boolean {
  return (
    GOOGLE_BOOKS_HOST.test(img.src) &&
    GOOGLE_PLACEHOLDER_SIZES.some(
      (size) =>
        img.naturalWidth === size.width && img.naturalHeight === size.height,
    )
  )
}
