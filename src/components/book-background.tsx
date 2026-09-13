import { type ComponentProps, useId } from 'react'
import { twMerge } from 'tailwind-merge'

export type BookBackgroundProps = ComponentProps<'svg'>

export function BookBackground({ className, ...props }: BookBackgroundProps) {
  const id = useId().replace(/:/g, '')
  const ids = {
    dots: `${id}-dots`,
    mask: `${id}-mask`,
    fadeLeft: `${id}-fade-left`,
    fadeRight: `${id}-fade-right`,
    fadeTop: `${id}-fade-top`,
    fadeBottom: `${id}-fade-bottom`,
  }

  return (
    <svg
      data-slot="book-background"
      viewBox="0 0 1440 800"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
      className={twMerge('pointer-events-none text-muted-foreground', className)}
      {...props}
    >
      <defs>
        <pattern
          id={ids.dots}
          width="18"
          height="18"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="9" cy="9" r="1" fill="currentColor" />
        </pattern>

        <linearGradient id={ids.fadeLeft} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="white" />
          <stop offset="0.45" stopColor="white" stopOpacity="0.55" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={ids.fadeRight} x1="1" y1="0" x2="0" y2="0">
          <stop offset="0" stopColor="white" />
          <stop offset="0.45" stopColor="white" stopOpacity="0.55" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={ids.fadeTop} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="black" />
          <stop offset="1" stopColor="black" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={ids.fadeBottom} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="black" />
          <stop offset="1" stopColor="black" stopOpacity="0" />
        </linearGradient>

        <mask id={ids.mask}>
          <rect x="0" y="0" width="480" height="800" fill={`url(#${ids.fadeLeft})`} />
          <rect x="960" y="0" width="480" height="800" fill={`url(#${ids.fadeRight})`} />
          <rect x="0" y="0" width="1440" height="110" fill={`url(#${ids.fadeTop})`} />
          <rect x="0" y="690" width="1440" height="110" fill={`url(#${ids.fadeBottom})`} />
        </mask>
      </defs>

      <g className="opacity-35 dark:opacity-28">
        <rect
          x="0"
          y="0"
          width="1440"
          height="800"
          fill={`url(#${ids.dots})`}
          mask={`url(#${ids.mask})`}
        />
      </g>

      <g
        className="opacity-55 **:[vector-effect:non-scaling-stroke] dark:opacity-45"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <Bookmark transform="translate(100 120)" />
        <StackedBooks transform="translate(24 268)" />
        <PageLines transform="translate(60 420)" />
        <StandingBooks transform="translate(14 668)" />

        <StandingBooks transform="translate(1318 290)" />
        <PageLines transform="translate(1350 396)" />
        <OpenBook transform="translate(1372 552)" />
        <StackedBooks transform="translate(1312 706)" />
      </g>
    </svg>
  )
}

interface GlyphProps {
  transform: string
}

function StandingBooks({ transform }: GlyphProps) {
  return (
    <g transform={transform}>
      <path d="M-14 0H112" />
      <rect x="0" y="-86" width="16" height="86" rx="2" />
      <rect x="21" y="-104" width="20" height="104" rx="2" />
      <rect x="46" y="-78" width="14" height="78" rx="2" />
      <path d="M72 0H88L74 -94H58Z" />
      <path d="M5 -70H11M5 -64H11" />
      <path d="M27 -88H35M27 -82H35" />
      <path d="M50 -60H56" />
    </g>
  )
}

function StackedBooks({ transform }: GlyphProps) {
  return (
    <g transform={transform}>
      <rect x="0" y="-18" width="100" height="18" rx="3" />
      <rect x="-4" y="-34" width="122" height="16" rx="3" />
      <rect x="4" y="-52" width="104" height="18" rx="3" />
      <rect x="12" y="-66" width="86" height="14" rx="3" />
      <path d="M12 -14V-4" />
      <path d="M16 -47V-39" />
      <path d="M104 -18V-2L110 -8L116 -2V-18" />
    </g>
  )
}

function OpenBook({ transform }: GlyphProps) {
  return (
    <g transform={transform}>
      <path d="M0 0C-20 -8 -42 -9 -62 -3V-46C-42 -52 -20 -51 0 -43Z" />
      <path d="M0 0C20 -8 42 -9 62 -3V-46C42 -52 20 -51 0 -43Z" />
      <path d="M0 0V-43" />
      <path d="M-48 -34C-36 -38 -24 -38 -12 -35M-48 -24C-36 -28 -24 -28 -12 -25" />
      <path d="M12 -35C24 -38 36 -38 48 -34M12 -25C24 -28 36 -28 48 -24" />
    </g>
  )
}

function PageLines({ transform }: GlyphProps) {
  return <path transform={transform} d="M0 0H64M0 11H44M0 22H56M0 33H32" />
}

function Bookmark({ transform }: GlyphProps) {
  return <path transform={transform} d="M0 0H18V46L9 38L0 46Z" />
}
