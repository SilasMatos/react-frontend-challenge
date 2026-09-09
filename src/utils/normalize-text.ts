/** Marcas de acento (combining diacritics) que sobram após `normalize('NFD')`. */
const DIACRITICS = /\p{Diacritic}/gu

/**
 * Remove acentos e padroniza caixa/espaços. Base para busca e ordenação
 * insensíveis a acento nos títulos e autores da Google Books.
 */
export function normalizeText(value: string): string {
  return value
    .normalize('NFD')
    .replace(DIACRITICS, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
}

/** Comparador para `Array.prototype.sort` — ordena textos ignorando acento e caixa. */
export function compareText(a: string, b: string): number {
  return normalizeText(a).localeCompare(normalizeText(b), 'pt-BR')
}
