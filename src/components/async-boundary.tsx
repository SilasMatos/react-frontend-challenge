import type { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

type Phase = 'pending' | 'error' | 'empty' | 'success'

function defaultIsEmpty(data: unknown): boolean {
  return data == null || (Array.isArray(data) && data.length === 0)
}

export interface AsyncBoundaryProps<T> {
  isLoading: boolean
  isError: boolean
  data: T | undefined
  error?: unknown
  onRetry?: () => void
  isEmpty?: (data: T) => boolean
  pending?: ReactNode
  empty?: ReactNode
  errorFallback?: ReactNode | ((error: unknown, retry: () => void) => ReactNode)
  className?: string
  children: ReactNode | ((data: T) => ReactNode)
}

export function AsyncBoundary<T>({
  isLoading,
  isError,
  data,
  error,
  onRetry,
  isEmpty = defaultIsEmpty,
  pending,
  empty,
  errorFallback,
  className,
  children,
}: AsyncBoundaryProps<T>) {
  const phase: Phase = isLoading
    ? 'pending'
    : isError
      ? 'error'
      : isEmpty(data as T)
        ? 'empty'
        : 'success'

  const retry = () => onRetry?.()

  let body: ReactNode
  if (phase === 'pending') {
    body = pending
  } else if (phase === 'error') {
    body = typeof errorFallback === 'function' ? errorFallback(error, retry) : (errorFallback ?? null)
  } else if (phase === 'empty') {
    body = empty
  } else {
    body = typeof children === 'function' ? (children as (data: T) => ReactNode)(data as T) : children
  }

  return (
    <div
      key={phase}
      data-slot="async-boundary"
      data-phase={phase}
      aria-busy={phase === 'pending' || undefined}
      className={twMerge(
        'enter-fade duration-normal',
        className,
      )}
    >
      {body}
    </div>
  )
}
