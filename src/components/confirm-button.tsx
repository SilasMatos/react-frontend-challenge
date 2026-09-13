import { Check, Loader2, Trash2, X } from 'lucide-react'
import {
  type ComponentProps,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { twMerge } from 'tailwind-merge'

type Phase = 'idle' | 'armed' | 'pending'

export interface ConfirmButtonProps
  extends Omit<ComponentProps<'div'>, 'children' | 'onSelect'> {
  onConfirm: () => void | Promise<void>
  onCancel?: () => void
  label: string
  confirmLabel?: string
  cancelLabel?: string
  icon?: ReactNode
  disabled?: boolean
}

export function ConfirmButton({
  onConfirm,
  onCancel,
  label,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  icon,
  disabled = false,
  className,
  ...props
}: ConfirmButtonProps) {
  const [phase, setPhase] = useState<Phase>('idle')
  const triggerRef = useRef<HTMLButtonElement>(null)
  const cancelRef = useRef<HTMLButtonElement>(null)

  function arm() {
    if (disabled) return
    setPhase('armed')
  }

  const cancel = useCallback(() => {
    setPhase('idle')
    onCancel?.()
    triggerRef.current?.focus()
  }, [onCancel])

  async function confirm() {
    const result = onConfirm()
    if (result instanceof Promise) {
      setPhase('pending')
      await result
    }
    setPhase('idle')
  }

  useEffect(() => {
    if (phase === 'armed') cancelRef.current?.focus()
  }, [phase])

  useEffect(() => {
    if (phase !== 'armed') return
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') cancel()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [phase, cancel])

  return (
    <div
      data-slot="confirm-button"
      data-state={phase}
      className={twMerge('inline-flex w-fit items-center rounded-lg p-0.5', className)}
      {...props}
    >
      {phase === 'idle' ? (
        <button
          ref={triggerRef}
          type="button"
          onClick={arm}
          disabled={disabled}
          aria-label={label}
          className="grid size-7 place-items-center rounded-md text-muted-foreground outline-none hover:bg-muted hover:text-destructive focus-visible:ring-2 focus-visible:ring-ring [&_svg]:size-4"
        >
          {icon ?? <Trash2 />}
        </button>
      ) : (
        <div
          role="group"
          aria-label={`${label} — confirmar?`}
          className="flex items-center gap-1 duration-150 ease-out-quart animate-in fade-in zoom-in-95 motion-reduce:animate-none"
        >
          <button
            type="button"
            onClick={confirm}
            disabled={phase === 'pending'}
            aria-label={confirmLabel}
            className="grid size-7 place-items-center rounded-md bg-destructive/10 text-destructive outline-none hover:bg-destructive/20 focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 [&_svg]:size-4"
          >
            {phase === 'pending' ? <Loader2 className="animate-spin" /> : <Check />}
          </button>
          <button
            ref={cancelRef}
            type="button"
            onClick={cancel}
            disabled={phase === 'pending'}
            aria-label={cancelLabel}
            className="grid size-7 place-items-center rounded-md text-muted-foreground outline-none hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 [&_svg]:size-4"
          >
            <X />
          </button>
        </div>
      )}
      <output aria-live="polite" className="sr-only">
        {phase === 'armed' ? `${label} — confirmar?` : ''}
      </output>
    </div>
  )
}
