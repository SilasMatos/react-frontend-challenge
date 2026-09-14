import { renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useGridColumns } from './use-grid-columns'

const original = window.matchMedia

function mockViewport(width: number) {
  window.matchMedia = (query: string) => {
    const min = Number(/min-width:\s*(\d+)px/.exec(query)?.[1] ?? 0)
    return {
      matches: width >= min,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: () => false,
    } as unknown as MediaQueryList
  }
}

afterEach(() => {
  window.matchMedia = original
})

describe('useGridColumns', () => {
  it('segue os breakpoints da grade (1 / sm 2 / lg 3 / xl 4)', () => {
    for (const [width, expected] of [
      [400, 1],
      [640, 2],
      [1024, 3],
      [1280, 4],
      [1920, 4],
    ] as const) {
      mockViewport(width)
      const { result, unmount } = renderHook(() => useGridColumns())
      expect(result.current).toBe(expected)
      unmount()
    }
  })
})
