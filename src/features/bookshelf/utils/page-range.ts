export const PAGE_GAP = 'gap'

export type PageRangeItem = number | typeof PAGE_GAP

export function getPageRange(
  pageIndex: number,
  pageCount: number,
  siblings = 1,
): PageRangeItem[] {
  const maxVisible = siblings * 2 + 5
  if (pageCount <= maxVisible) {
    return Array.from({ length: pageCount }, (_, index) => index)
  }

  const last = pageCount - 1
  const start = Math.max(1, Math.min(pageIndex - siblings, last - siblings * 2 - 2))
  const end = Math.min(last - 1, Math.max(pageIndex + siblings, siblings * 2 + 2))

  const range: PageRangeItem[] = [0]
  if (start > 1) range.push(PAGE_GAP)
  for (let page = start; page <= end; page += 1) range.push(page)
  if (end < last - 1) range.push(PAGE_GAP)
  range.push(last)
  return range
}
