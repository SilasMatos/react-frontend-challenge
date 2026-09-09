import type { ComponentProps, ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { twMerge } from 'tailwind-merge'

export interface EmptyStateProps extends ComponentProps<'div'> {
  icon?: LucideIcon
  title: string
  description?: ReactNode
  /** Ação opcional (botão de retry, link, etc.). */
  action?: ReactNode
}

/**
 * Estado vazio / de erro genérico: ícone, título, descrição e uma ação opcional.
 * Usado na busca (ocioso / sem resultados / erro) e na Estante vazia.
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      data-slot="empty-state"
      className={twMerge(
        'flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border px-6 py-14 text-center',
        className,
      )}
      {...props}
    >
      {Icon ? (
        <div className="grid size-11 place-items-center rounded-full bg-muted text-muted-foreground [&_svg]:size-5">
          <Icon aria-hidden />
        </div>
      ) : null}
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium text-foreground">{title}</p>
        {description ? (
          <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  )
}
