import {
  createContext,
  useContext,
  type ComponentProps,
  type ElementType,
} from 'react'
import { twMerge } from 'tailwind-merge'

interface SkeletonMorphContextValue {
  loading: boolean
}

const SkeletonMorphContext = createContext<SkeletonMorphContextValue>({
  loading: false,
})

export interface SkeletonMorphProps extends ComponentProps<'div'> {
  loading: boolean
}

export function SkeletonMorph({ loading, className, children, ...props }: SkeletonMorphProps) {
  return (
    <SkeletonMorphContext.Provider value={{ loading }}>
      <div
        data-slot="skeleton-morph"
        data-loading={loading || undefined}
        aria-busy={loading || undefined}
        className={className}
        {...props}
      >
        {children}
      </div>
    </SkeletonMorphContext.Provider>
  )
}

export interface SkelProps extends ComponentProps<'span'> {
  loading?: boolean
  as?: 'span' | 'div'
}

export function Skel({
  className,
  children,
  loading: loadingProp,
  as = 'span',
  ...props
}: SkelProps) {
  const ctx = useContext(SkeletonMorphContext)
  const loading = loadingProp ?? ctx.loading
  const Comp = as as ElementType

  return (
    <Comp
      data-slot="skel"
      data-loading={loading || undefined}
      className={twMerge(
        'relative inline-block overflow-hidden rounded-md align-middle',
        className,
      )}
      {...props}
    >
      <span
        className={twMerge(
          'block h-full transition-opacity duration-200 ease-out-quart',
          loading ? 'opacity-0' : 'opacity-100',
        )}
        aria-hidden={loading || undefined}
      >
        {children}
      </span>
      <span
        aria-hidden="true"
        className={twMerge(
          'pointer-events-none absolute inset-0 rounded-[inherit] bg-foreground/10 transition-opacity duration-200 ease-out-quart',
          loading ? 'animate-pulse opacity-100' : 'opacity-0',
        )}
      />
    </Comp>
  )
}
