export function sanitizeCoverUrl(url: string): string {
  let out = url.trim()
  if (out.startsWith('//')) out = `https:${out}`
  out = out.replace(/^http:\/\//i, 'https://')

  if (/\bbooks\.google(?:usercontent)?\./i.test(out)) {
    out = out
      .replace(/([?&])edge=curl(?:&|$)/i, '$1')
      .replace(/([?&])zoom=1(?=&|$)/i, '$1zoom=2')
      .replace(/[?&]$/, '')
  }
  return out
}
