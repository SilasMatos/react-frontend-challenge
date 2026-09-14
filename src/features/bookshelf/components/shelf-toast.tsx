import { Link } from '@tanstack/react-router'
import {
  ArrowRight,
  BookmarkCheck,
  BookmarkMinus,
  type LucideIcon,
  X,
} from 'lucide-react'
import { toast } from 'sonner'
import { BookCover } from '@/components/book-cover'
import { Button, buttonVariants } from '@/components/ui/button'
import type { Book } from '@/types/book'

export type ShelfToastKind = 'added' | 'removed'

const SHELF_TOAST_COPY: Record<
  ShelfToastKind,
  { title: string; icon: LucideIcon }
> = {
  added: { title: 'Adicionado à estante', icon: BookmarkCheck },
  removed: { title: 'Removido da estante', icon: BookmarkMinus },
}

export interface ShelfToastProps {
  toastId: string | number
  kind: ShelfToastKind
  book: Book
  onUndo: () => void
}

export function ShelfToast({ toastId, kind, book, onUndo }: ShelfToastProps) {
  const { title, icon: Icon } = SHELF_TOAST_COPY[kind]

  function dismiss() {
    toast.dismiss(toastId)
  }

  function handleUndo() {
    onUndo()
    dismiss()
  }

  return (
    <div
      data-slot="shelf-toast"
      data-kind={kind}
      className="relative flex w-full items-center gap-3 rounded-lg border border-border bg-popover p-3 pr-10 text-popover-foreground shadow-lg"
    >
      <BookCover book={book} size="xs" loading="eager" />

      <div className="flex min-w-0 flex-1 flex-col">
        <p className="flex items-center gap-1.5 text-sm leading-5 font-medium">
          <Icon
            className="size-4 shrink-0 pop-in duration-slow"
            aria-hidden
          />
          {title}
        </p>
        <p className="truncate text-[0.8rem] leading-5 text-muted-foreground">
          {book.title}
        </p>

        <div className="mt-2 flex items-center gap-1.5">
          <Button
            type="button"
            variant="outline"
            size="xs"
            onClick={handleUndo}
          >
            Desfazer
          </Button>
          {kind === 'added' ? (
            <Link
              to="/estante"
              className={buttonVariants({ variant: 'ghost', size: 'xs' })}
              onClick={dismiss}
            >
              Ver estante
              <ArrowRight data-icon="inline-end" />
            </Link>
          ) : null}
        </div>
      </div>

      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        aria-label="Fechar notificação"
        onClick={dismiss}
        className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
      >
        <X />
      </Button>
    </div>
  )
}
