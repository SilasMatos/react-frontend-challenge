const DIACRITICS = /\p{Diacritic}/gu

export function normalizeText(value: string): string {
  return value
    .normalize('NFD')
    .replace(DIACRITICS, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
}

export function compareText(a: string, b: string): number {
  return normalizeText(a).localeCompare(normalizeText(b), 'pt-BR')
}
