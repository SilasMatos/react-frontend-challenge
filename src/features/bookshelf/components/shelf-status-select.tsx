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

export interface ShelfStatusSelectProps {
  value: BookStatus
  onChange: (value: BookStatus) => void
  /** Rótulo acessível — a célula da tabela não tem `<label>` visível. */
  ariaLabel?: string
  className?: string
}

/** Editor de status na linha da Estante (_Quero ler_ / _Lendo_ / _Concluído_). */
export function ShelfStatusSelect({
  value,
  onChange,
  ariaLabel,
  className,
}: ShelfStatusSelectProps) {
  return (
    <Select value={value} onValueChange={(next) => onChange(next as BookStatus)}>
      <SelectTrigger
        data-slot="shelf-status-select"
        size="sm"
        aria-label={ariaLabel}
        className={twMerge('w-36', className)}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {BOOK_STATUSES.map((status) => (
          <SelectItem key={status} value={status}>
            {BOOK_STATUS_LABELS[status]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
