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

export function getPublishedYear(
  value: string | null | undefined,
): number | null {
  if (!value) return null
  const rawYear = value.slice(0, 4)
  const year = Number(rawYear)
  return rawYear.length === 4 && Number.isInteger(year) ? year : null
}

export function formatPublishedYear(value: string | null | undefined): string {
  const year = getPublishedYear(value)
  return year == null ? '—' : String(year)
}
