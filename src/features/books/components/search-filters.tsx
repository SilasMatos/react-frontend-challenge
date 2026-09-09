import { useForm } from '@tanstack/react-form'
import { twMerge } from 'tailwind-merge'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
  defaultValue: BookSearchFilters
  onChange: (filters: BookSearchFilters) => void
  className?: string
}

/**
 * Filtros da busca (`printType` / `orderBy`) com **TanStack Form**. Os selects
 * aplicam na hora: cada mudança de campo dispara `onSubmit`, que reporta os
 * valores ao componente pai.
 */
export function SearchFilters({
  defaultValue,
  onChange,
  className,
}: SearchFiltersProps) {
  const form = useForm({
    defaultValues: defaultValue,
    onSubmit: ({ value }) => onChange(value),
  })

  return (
    <form
      data-slot="search-filters"
      className={twMerge('flex flex-wrap items-end gap-3', className)}
      onSubmit={(event) => event.preventDefault()}
    >
      <form.Field name="printType">
        {(field) => (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={field.name} className="text-xs text-muted-foreground">
              Tipo
            </Label>
            <Select
              value={field.state.value}
              onValueChange={(value) => {
                field.handleChange(value as PrintType)
                void form.handleSubmit()
              }}
            >
              <SelectTrigger id={field.name} size="sm" className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PRINT_TYPES.map((option) => (
                  <SelectItem key={option} value={option}>
                    {PRINT_TYPE_LABELS[option]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </form.Field>

      <form.Field name="orderBy">
        {(field) => (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={field.name} className="text-xs text-muted-foreground">
              Ordenar
            </Label>
            <Select
              value={field.state.value}
              onValueChange={(value) => {
                field.handleChange(value as SortOrder)
                void form.handleSubmit()
              }}
            >
              <SelectTrigger id={field.name} size="sm" className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SORT_ORDERS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {SORT_ORDER_LABELS[option]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </form.Field>
    </form>
  )
}
