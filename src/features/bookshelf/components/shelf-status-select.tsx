import { Bookmark, BookOpen, CircleCheck, type LucideIcon } from 'lucide-react'
import { twMerge } from 'tailwind-merge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  BOOK_STATUSES,
  BOOK_STATUS_LABELS,
  type BookStatus,
} from '../types/bookshelf'

const STATUS_STYLES: Record<
  BookStatus,
  { icon: LucideIcon; pill: string; accent: string }
> = {
  'want-to-read': {
    icon: Bookmark,
    pill: 'bg-muted text-foreground/80 border-border hover:bg-muted/70 dark:bg-muted dark:hover:bg-muted/70',
    accent: 'text-muted-foreground',
  },
  reading: {
    icon: BookOpen,
    pill: 'bg-sky-500/10 text-sky-800 border-sky-600/20 hover:bg-sky-500/15 dark:bg-sky-400/10 dark:text-sky-200 dark:border-sky-400/25 dark:hover:bg-sky-400/15',
    accent: 'text-sky-600 dark:text-sky-400',
  },
  read: {
    icon: CircleCheck,
    pill: 'bg-emerald-500/10 text-emerald-800 border-emerald-600/20 hover:bg-emerald-500/15 dark:bg-emerald-400/10 dark:text-emerald-200 dark:border-emerald-400/25 dark:hover:bg-emerald-400/15',
    accent: 'text-emerald-600 dark:text-emerald-400',
  },
}

export interface ShelfStatusSelectProps {
  value: BookStatus
  onChange: (value: BookStatus) => void
  ariaLabel?: string
  className?: string
}

export function ShelfStatusSelect({
  value,
  onChange,
  ariaLabel,
  className,
}: ShelfStatusSelectProps) {
  const current = STATUS_STYLES[value]

  return (
    <Select
      items={BOOK_STATUS_LABELS}
      value={value}
      onValueChange={(next) => onChange(next as BookStatus)}
    >
      <SelectTrigger
        data-slot="shelf-status-select"
        data-status={value}
        size="sm"
        aria-label={ariaLabel}
        className={twMerge(
          'w-fit gap-1 pr-1.5 pl-2 text-xs font-medium transition-[background-color,border-color] data-[size=sm]:rounded-full [&>svg:last-child]:size-3.5 [&>svg:last-child]:text-current [&>svg:last-child]:opacity-60',
          current.pill,
          className,
        )}
      >
        <SelectValue>
          {(selected: BookStatus) => {
            const { icon: Icon, accent } = STATUS_STYLES[selected]
            return (
              <>
                <Icon
                  key={selected}
                  aria-hidden
                  className={twMerge(
                    'size-3.5 duration-200 ease-spring animate-in zoom-in-50 motion-reduce:animate-none',
                    accent,
                  )}
                />
                {BOOK_STATUS_LABELS[selected]}
              </>
            )
          }}
        </SelectValue>
      </SelectTrigger>
      <SelectContent align="start" alignItemWithTrigger={false}>
        {BOOK_STATUSES.map((status) => {
          const { icon: Icon, accent } = STATUS_STYLES[status]
          return (
            <SelectItem key={status} value={status} className="py-1.5">
              <Icon aria-hidden className={twMerge('size-4', accent)} />
              {BOOK_STATUS_LABELS[status]}
            </SelectItem>
          )
        })}
      </SelectContent>
    </Select>
  )
}
