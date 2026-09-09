const MONTHS_PT = [
  'janeiro',
  'fevereiro',
  'março',
  'abril',
  'maio',
  'junho',
  'julho',
  'agosto',
  'setembro',
  'outubro',
  'novembro',
  'dezembro',
]

const UNKNOWN = 'Data desconhecida'

/**
 * Formata o `publishedDate` da Google Books, que chega em granularidade variável:
 * `"2011"`, `"2011-03"` ou `"2011-03-01"` (e às vezes ausente).
 */
export function formatPublishedDate(value: string | null | undefined): string {
  if (!value) return UNKNOWN

  const [rawYear, rawMonth, rawDay] = value.split('-')
  const year = Number(rawYear)
  if (rawYear.length !== 4 || !Number.isInteger(year)) return UNKNOWN

  const month = MONTHS_PT[Number(rawMonth) - 1]
  if (!month) return String(year)

  const day = Number(rawDay)
  if (!Number.isInteger(day) || day < 1 || day > 31) {
    return `${month} de ${year}`
  }

  return `${day} de ${month} de ${year}`
}

/**
 * Ano de publicação como número — para ordenar a Estante por data.
 * `null` quando ausente ou inválido.
 */
export function getPublishedYear(
  value: string | null | undefined,
): number | null {
  if (!value) return null
  const rawYear = value.slice(0, 4)
  const year = Number(rawYear)
  return rawYear.length === 4 && Number.isInteger(year) ? year : null
}
