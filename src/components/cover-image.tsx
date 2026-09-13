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
  alt: string
  sanitize?: boolean
  fallback?: ReactNode
  fit?: 'cover' | 'contain'
  loading?: 'lazy' | 'eager'
}

export function CoverImage({
  className,
  ratio,
  radius,
  src,
  alt,
  sanitize = false,
  fallback,
  fit = 'cover',
  loading = 'lazy',
  ...props
}: CoverImageProps) {
  const resolved = src ? (sanitize ? sanitizeCoverUrl(src) : src.trim()) : ''
  const [status, setStatus] = useState<CoverImageStatus>(resolved ? 'loading' : 'empty')

  useEffect(() => {
    setStatus(resolved ? 'loading' : 'empty')
  }, [resolved])

  const showFallback = status === 'empty' || status === 'error'

  return (
    <div
      data-slot="cover-image"
      data-status={status}
      className={twMerge(coverImageVariants({ ratio, radius }), className)}
      {...props}
    >
      {resolved && !showFallback ? (
        <img
          key={resolved}
          src={resolved}
          alt={alt}
          loading={loading}
          decoding="async"
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('error')}
          className={twMerge(
            'duration-300 ease-out-quart animate-in fade-in motion-reduce:animate-none',
            ratio === 'auto'
              ? 'h-auto w-full'
              : fit === 'cover'
                ? 'size-full object-cover'
                : 'size-full object-contain',
          )}
        />
      ) : null}

      {showFallback ? (
        <div
          role="img"
          aria-label={alt}
          className={twMerge(
            'grid size-full place-items-center [&_svg]:size-[28%] [&_svg]:max-h-10 [&_svg]:min-h-5 [&_svg]:max-w-10',
            ratio === 'auto' && 'aspect-2/3',
          )}
        >
          {fallback ?? <ImageOff strokeWidth={1.5} aria-hidden="true" />}
        </div>
      ) : null}
    </div>
  )
}
