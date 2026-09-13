import { useEffect } from 'react'
import { useForm } from '@tanstack/react-form'
import { ArrowUpDown } from 'lucide-react'
import { twMerge } from 'tailwind-merge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import {
  PRINT_TYPES,
  PRINT_TYPE_LABELS,
  SORT_ORDERS,
  SORT_ORDER_LABELS,
  type BookSearchFilters,
  type PrintType,
  type SortOrder,
} from '../types/search'

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
          <ToggleGroup
            aria-label="Tipo"
            value={[field.state.value]}
            onValueChange={(next) => {
              const [selected] = next as PrintType[]
              if (!selected) return
              field.handleChange(selected)
              void form.handleSubmit()
            }}
            spacing={1}
            className="h-9 rounded-lg bg-muted p-0.5"
          >
            {PRINT_TYPES.map((option) => (
              <ToggleGroupItem
                key={option}
                value={option}
                className="h-8 rounded-md border border-transparent px-3 text-[0.8rem] text-muted-foreground hover:bg-background/50 hover:text-foreground aria-pressed:bg-background aria-pressed:text-foreground aria-pressed:shadow-xs dark:aria-pressed:border-input dark:aria-pressed:bg-input/30"
              >
                {PRINT_TYPE_LABELS[option]}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        )}
      </form.Field>

      <form.Field name="orderBy">
        {(field) => (
          <Select
            value={field.state.value}
            onValueChange={(value) => {
              field.handleChange(value as SortOrder)
              void form.handleSubmit()
            }}
          >
            <SelectTrigger
              aria-label="Ordenar"
              className="gap-2 rounded-lg border-border bg-background px-3 hover:bg-muted data-[size=default]:h-9 dark:border-input dark:bg-input/30 dark:hover:bg-input/50"
            >
              <ArrowUpDown aria-hidden className="text-muted-foreground" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="end">
              {SORT_ORDERS.map((option) => (
                <SelectItem key={option} value={option}>
                  {SORT_ORDER_LABELS[option]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </form.Field>
    </form>
  )
}
