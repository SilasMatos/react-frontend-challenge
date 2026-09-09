import { useEffect, useState } from 'react'

/**
 * Adia a propagação de `value` até ele ficar estável por `delayMs`.
 * Usado na busca de livros para não floodar a Google Books API.
 */
export function useDebounce<T>(value: T, delayMs = 400): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timeoutId = setTimeout(() => setDebouncedValue(value), delayMs)
    return () => clearTimeout(timeoutId)
  }, [value, delayMs])

  return debouncedValue
}
