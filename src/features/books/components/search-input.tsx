import { Loader2, Search, X } from 'lucide-react'
import { twMerge } from 'tailwind-merge'
import { Input } from '@/components/ui/input'

export interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  /** Mostra um spinner discreto enquanto a busca ainda não "assentou". */
  busy?: boolean
  className?: string
}

/** Campo de busca de livros. O debounce vive no hook `useSearchBooks`. */
export function SearchInput({
  value,
  onChange,
  busy = false,
  className,
}: SearchInputProps) {
  return (
    <div className={twMerge('relative', className)}>
      <Search
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
      />
      <Input
        type="search"
        role="searchbox"
        aria-label="Buscar livros"
        placeholder="Busque por título, autor ou assunto…"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-9 pr-9 pl-8"
      />
      {busy ? (
        <Loader2
          aria-hidden
          className="absolute top-1/2 right-2.5 size-4 -translate-y-1/2 animate-spin text-muted-foreground"
        />
      ) : value ? (
        <button
          type="button"
          aria-label="Limpar busca"
          onClick={() => onChange('')}
          className="absolute top-1/2 right-1.5 grid size-6 -translate-y-1/2 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <X className="size-4" />
        </button>
      ) : null}
    </div>
  )
}
