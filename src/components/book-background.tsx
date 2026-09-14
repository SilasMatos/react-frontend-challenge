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
    glow: `${id}-glow`,
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
          width="22"
          height="22"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="11" cy="11" r="0.9" fill="currentColor" />
        </pattern>

        <linearGradient id={ids.fadeLeft} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="white" />
          <stop offset="0.35" stopColor="white" stopOpacity="0.6" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={ids.fadeRight} x1="1" y1="0" x2="0" y2="0">
          <stop offset="0" stopColor="white" />
          <stop offset="0.35" stopColor="white" stopOpacity="0.6" />
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

        <radialGradient id={ids.glow}>
          <stop offset="0" stopColor="currentColor" stopOpacity="0.12" />
          <stop offset="0.6" stopColor="currentColor" stopOpacity="0.04" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>

        <mask id={ids.mask}>
          <rect x="0" y="0" width="420" height="800" fill={`url(#${ids.fadeLeft})`} />
          <rect x="1020" y="0" width="420" height="800" fill={`url(#${ids.fadeRight})`} />
          <rect x="0" y="0" width="1440" height="140" fill={`url(#${ids.fadeTop})`} />
          <rect x="0" y="660" width="1440" height="140" fill={`url(#${ids.fadeBottom})`} />
        </mask>
      </defs>

      <g className="opacity-90 dark:opacity-70">
        <circle cx="96" cy="700" r="380" fill={`url(#${ids.glow})`} />
        <circle cx="1350" cy="150" r="340" fill={`url(#${ids.glow})`} />
      </g>

      <g className="opacity-30 dark:opacity-22">
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
        className="opacity-50 **:[vector-effect:non-scaling-stroke] dark:opacity-40"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <Bookmark transform="translate(112 92) scale(1.1)" />
        <StandingBooks transform="translate(22 362) scale(0.95)" />
        <OpenBook transform="translate(98 722) scale(1.35)" opacity={0.6} />

        <StackedBooks transform="translate(1318 184) scale(1.05)" />
        <Glasses transform="translate(1372 336) scale(1.1)" />
        <StandingBooks transform="translate(1320 566) scale(0.9)" />
      </g>
    </svg>
  )
}

interface GlyphProps {
  transform: string
  opacity?: number
}

function StandingBooks({ transform, opacity }: GlyphProps) {
  return (
    <g transform={transform} opacity={opacity}>
      <path d="M-16 0H122" />
      <rect x="0" y="-84" width="16" height="84" rx="2" />
      <path d="M5 -66H11M5 -60H11" />
      <rect x="20" y="-100" width="22" height="100" rx="2" />
      <path d="M20 -86H42M20 -80H42" />
      <rect x="46" y="-76" width="14" height="76" rx="2" />
      <path d="M50 -60H56" />
      <path d="M72 0H88L74 -94H58Z" />
      <path d="M63 -60H79" />
    </g>
  )
}

function StackedBooks({ transform, opacity }: GlyphProps) {
  return (
    <g transform={transform} opacity={opacity}>
      <rect x="0" y="-18" width="100" height="18" rx="3" />
      <path d="M8 -13V-5" />
      <rect x="6" y="-34" width="92" height="16" rx="3" />
      <path d="M90 -30V-22" />
      <rect x="2" y="-52" width="98" height="18" rx="3" />
      <path d="M10 -47V-39" />
      <rect x="14" y="-66" width="80" height="14" rx="3" />
    </g>
  )
}

function OpenBook({ transform, opacity }: GlyphProps) {
  return (
    <g transform={transform} opacity={opacity}>
      <path d="M-66 -4C-44 2 -22 3 0 -1C22 3 44 2 66 -4" />
      <path d="M0 -1C-20 -9 -42 -10 -62 -4V-47C-42 -53 -20 -52 0 -44Z" />
      <path d="M0 -1C20 -9 42 -10 62 -4V-47C42 -53 20 -52 0 -44Z" />
      <path d="M0 -1V-44" />
      <path d="M-48 -36C-36 -40 -24 -40 -12 -37M-48 -26C-36 -30 -24 -30 -12 -27" />
      <path d="M12 -37C24 -40 36 -40 48 -36M12 -27C24 -30 36 -30 48 -26" />
    </g>
  )
}

function Glasses({ transform, opacity }: GlyphProps) {
  return (
    <g transform={transform} opacity={opacity}>
      <circle cx="-15" cy="0" r="11" />
      <circle cx="15" cy="0" r="11" />
      <path d="M-4 -2C-2 -5 2 -5 4 -2" />
      <path d="M-26 -3L-38 -10M26 -3L38 -10" />
    </g>
  )
}

function Bookmark({ transform, opacity }: GlyphProps) {
  return (
    <g transform={transform} opacity={opacity}>
      <path d="M0 0H20V48L10 40L0 48Z" />
      <path d="M6 10H14" />
    </g>
  )
}
