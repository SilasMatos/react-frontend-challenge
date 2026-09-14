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
  hint?: string
  confirmLabel?: string
  cancelLabel?: string
  icon?: ReactNode
  disabled?: boolean
}

const iconButtonClass =
  'grid size-7 place-items-center rounded-md outline-none transition-[background-color,color,opacity,scale] duration-normal ease-out-quart hover-delay focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 motion-reduce:transition-none [&_svg]:size-4'

const layerClass =
  'col-start-1 row-start-1 transition-[opacity,scale] duration-slow ease-out-quart motion-reduce:transition-none'

export function ConfirmButton({
  onConfirm,
  onCancel,
  label,
  hint = label,
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
  const restoreFocus = useRef(false)
  const idle = phase === 'idle'

  function arm() {
    if (disabled) return
    setPhase('armed')
  }

  const cancel = useCallback(() => {
    restoreFocus.current = true
    setPhase('idle')
    onCancel?.()
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
    if (phase === 'armed') {
      cancelRef.current?.focus()
    } else if (phase === 'idle' && restoreFocus.current) {
      restoreFocus.current = false
      triggerRef.current?.focus()
    }
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
      className={twMerge(
        'grid w-8 shrink-0 grid-cols-[minmax(0,1fr)] items-center justify-items-end overflow-hidden rounded-lg p-0.5 transition-[width] duration-slow ease-out-quart motion-reduce:transition-none',
        !idle && 'w-16',
        className,
      )}
      {...props}
    >
      <button
        ref={triggerRef}
        type="button"
        onClick={arm}
        disabled={disabled || !idle}
        aria-hidden={!idle}
        aria-label={label}
        title={idle ? hint : undefined}
        className={twMerge(
          iconButtonClass,
          layerClass,
          'text-muted-foreground hover:bg-muted hover:text-destructive',
          !idle && 'pointer-events-none scale-75 opacity-0 disabled:opacity-0',
        )}
      >
        {icon ?? <Trash2 />}
      </button>

      <div
        role="group"
        aria-label={`${label} — confirmar?`}
        aria-hidden={idle}
        className={twMerge(
          layerClass,
          'flex items-center gap-1',
          idle && 'pointer-events-none scale-90 opacity-0',
        )}
      >
        <button
          type="button"
          onClick={confirm}
          disabled={phase !== 'armed'}
          aria-label={confirmLabel}
          title={confirmLabel}
          className={twMerge(
            iconButtonClass,
            'bg-destructive/10 text-destructive hover:bg-destructive/20',
          )}
        >
          {phase === 'pending' ? <Loader2 className="animate-spin" /> : <Check />}
        </button>
        <button
          ref={cancelRef}
          type="button"
          onClick={cancel}
          disabled={phase !== 'armed'}
          aria-label={cancelLabel}
          title={cancelLabel}
          className={twMerge(
            iconButtonClass,
            'text-muted-foreground hover:bg-muted hover:text-foreground',
          )}
        >
          <X />
        </button>
      </div>

      <output aria-live="polite" className="sr-only">
        {phase === 'armed' ? `${label} — confirmar?` : ''}
      </output>
    </div>
  )
}
