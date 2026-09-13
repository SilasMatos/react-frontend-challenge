import { useEffect, useRef, useState } from 'react'

export interface UseIntersectionObserverOptions {
  enabled?: boolean
  root?: Element | null
  rootMargin?: string
  threshold?: number
}

export function useIntersectionObserver<T extends Element = HTMLDivElement>(
  onIntersect: () => void,
  {
    enabled = true,
    root = null,
    rootMargin = '0px',
    threshold = 0,
  }: UseIntersectionObserverOptions = {},
) {
  const [target, setTarget] = useState<T | null>(null)
  const callbackRef = useRef(onIntersect)

  useEffect(() => {
    callbackRef.current = onIntersect
  }, [onIntersect])

  useEffect(() => {
    if (!enabled || !target || typeof IntersectionObserver === 'undefined') {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          callbackRef.current()
        }
      },
      { root, rootMargin, threshold },
    )

    observer.observe(target)
    return () => observer.disconnect()
  }, [enabled, target, root, rootMargin, threshold])

  return setTarget
}
