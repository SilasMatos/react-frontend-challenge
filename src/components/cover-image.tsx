import { ImageOff } from 'lucide-react'
import { type ComponentProps, type ReactNode, useEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { tv, type VariantProps } from 'tailwind-variants'
import { sanitizeCoverUrl } from '@/utils/sanitize-cover-url'

const coverImageVariants = tv({
  base: 'not-prose relative block overflow-hidden bg-muted text-muted-foreground',
  variants: {
    ratio: {
      book: 'aspect-2/3',
      portrait: 'aspect-3/4',
      square: 'aspect-square',
      auto: 'data-[status=loading]:aspect-2/3',
    },
    radius: {
      none: 'rounded-none',
      sm: 'rounded-md',
      md: 'rounded-lg',
    },
  },
  defaultVariants: { ratio: 'book', radius: 'sm' },
})

type CoverImageStatus = 'empty' | 'loading' | 'loaded' | 'error'

export interface CoverImageProps
  extends Omit<ComponentProps<'div'>, 'children' | 'onError' | 'onLoad'>,
    VariantProps<typeof coverImageVariants> {
  src?: string | null
  fallbackSrc?: string | null
  alt: string
  sanitize?: boolean
  reject?: (img: HTMLImageElement) => boolean
  fallback?: ReactNode
  fit?: 'cover' | 'contain'
  loading?: 'lazy' | 'eager'
}

export function CoverImage({
  className,
  ratio,
  radius,
  src,
  fallbackSrc,
  alt,
  sanitize = false,
  reject,
  fallback,
  fit = 'cover',
  loading = 'lazy',
  ...props
}: CoverImageProps) {
  const resolved = src ? (sanitize ? sanitizeCoverUrl(src) : src.trim()) : ''
  const secondary = fallbackSrc && fallbackSrc !== resolved ? fallbackSrc : ''
  const [attempt, setAttempt] = useState(0)
  const [status, setStatus] = useState<CoverImageStatus>(resolved ? 'loading' : 'empty')

  useEffect(() => {
    setAttempt(0)
    setStatus(resolved ? 'loading' : 'empty')
  }, [resolved, secondary])

  const current = attempt === 0 ? resolved : secondary

  function fail() {
    if (attempt === 0 && secondary) {
      setAttempt(1)
      setStatus('loading')
      return
    }
    setStatus('error')
  }

  const showFallback = status === 'empty' || status === 'error'

  return (
    <div
      data-slot="cover-image"
      data-status={status}
      className={twMerge(coverImageVariants({ ratio, radius }), className)}
      {...props}
    >
      {current && !showFallback ? (
        <img
          key={current}
          src={current}
          alt={alt}
          loading={loading}
          decoding="async"
          onLoad={(event) =>
            reject?.(event.currentTarget) ? fail() : setStatus('loaded')
          }
          onError={fail}
          className={twMerge(
            'transition-[opacity,scale,filter] duration-slower ease-out-quart motion-reduce:transition-none',
            status === 'loaded'
              ? 'scale-100 opacity-100 blur-0'
              : 'scale-105 opacity-0 blur-sm',
            ratio === 'auto'
              ? 'h-auto w-full'
              : fit === 'cover'
                ? 'size-full object-cover'
                : 'size-full object-contain',
          )}
        />
      ) : null}

      <span
        aria-hidden="true"
        className={twMerge(
          'shimmer-sweep pointer-events-none absolute inset-0 transition-opacity duration-slow ease-out-quart',
          status === 'loading' ? 'opacity-100' : 'opacity-0',
        )}
      />

      {showFallback ? (
        <div
          role="img"
          aria-label={alt}
          className={twMerge(
            'enter-fade grid size-full place-items-center [&_svg]:size-[28%] [&_svg]:max-h-10 [&_svg]:min-h-5 [&_svg]:max-w-10',
            ratio === 'auto' && 'aspect-2/3',
          )}
        >
          {fallback ?? <ImageOff strokeWidth={1.5} aria-hidden="true" />}
        </div>
      ) : null}
    </div>
  )
}
