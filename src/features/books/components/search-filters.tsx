import { useEffect } from 'react'
import { useForm } from '@tanstack/react-form'
import { Clock, Sparkles, type LucideIcon } from 'lucide-react'
import { twMerge } from 'tailwind-merge'
import {
  SegmentedControl,
  SegmentedControlItem,
} from '@/components/segmented-control'
import { Separator } from '@/components/ui/separator'
import {
  PRINT_TYPES,
  PRINT_TYPE_LABELS,
  SORT_ORDERS,
  SORT_ORDER_LABELS,
  type BookSearchFilters,
  type SortOrder,
} from '../types/search'

const SORT_ORDER_ICONS: Record<SortOrder, LucideIcon> = {
  relevance: Sparkles,
  newest: Clock,
}

export interface SearchFiltersProps {
  value: BookSearchFilters
  onChange: (filters: BookSearchFilters) => void
  className?: string
}

export function SearchFilters({
  value,
  onChange,
  className,
}: SearchFiltersProps) {
  const form = useForm({
    defaultValues: value,
    onSubmit: ({ value: next }) => onChange(next),
  })

  useEffect(() => {
    form.reset({ printType: value.printType, orderBy: value.orderBy })
  }, [form, value.printType, value.orderBy])

  return (
    <form
      data-slot="search-filters"
      className={twMerge('flex flex-wrap items-center gap-2', className)}
      onSubmit={(event) => event.preventDefault()}
    >
      <form.Field name="printType">
        {(field) => (
          <SegmentedControl
            aria-label="Tipo"
            value={field.state.value}
            onValueChange={(next) => {
              field.handleChange(next)
              void form.handleSubmit()
            }}
          >
            {PRINT_TYPES.map((option) => (
              <SegmentedControlItem key={option} value={option}>
                {PRINT_TYPE_LABELS[option]}
              </SegmentedControlItem>
            ))}
          </SegmentedControl>
        )}
      </form.Field>

      <Separator
        orientation="vertical"
        className="h-5 data-vertical:self-center max-sm:hidden"
      />

      <form.Field name="orderBy">
        {(field) => (
          <SegmentedControl
            aria-label="Ordenar"
            value={field.state.value}
            onValueChange={(next) => {
              field.handleChange(next)
              void form.handleSubmit()
            }}
          >
            {SORT_ORDERS.map((option) => {
              const Icon = SORT_ORDER_ICONS[option]
              return (
                <SegmentedControlItem key={option} value={option}>
                  <Icon aria-hidden />
                  {SORT_ORDER_LABELS[option]}
                </SegmentedControlItem>
              )
            })}
          </SegmentedControl>
        )}
      </form.Field>
    </form>
  )
}
