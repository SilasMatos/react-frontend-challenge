import type { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

export interface SegmentedControlProps<T extends string>
  extends Omit<
    ComponentProps<typeof ToggleGroup>,
    'value' | 'defaultValue' | 'onValueChange' | 'multiple' | 'className'
  > {
  value: T
  onValueChange: (value: T) => void
  className?: string
}

export function SegmentedControl<T extends string>({
  value,
  onValueChange,
  className,
  ...props
}: SegmentedControlProps<T>) {
  return (
    <ToggleGroup
      data-slot="segmented-control"
      value={[value]}
      onValueChange={(next) => {
        const [selected] = next as T[]
        if (selected) onValueChange(selected)
      }}
      spacing={1}
      className={twMerge('h-9 rounded-lg bg-muted p-0.5', className)}
      {...props}
    />
  )
}

export function SegmentedControlItem({
  className,
  ...props
}: Omit<ComponentProps<typeof ToggleGroupItem>, 'className'> & {
  className?: string
}) {
  return (
    <ToggleGroupItem
      data-slot="segmented-control-item"
      className={twMerge(
        'h-8 gap-1.5 rounded-md border border-transparent px-3 text-[0.8rem] text-muted-foreground hover:bg-background/50 hover:text-foreground aria-pressed:bg-background aria-pressed:text-foreground aria-pressed:shadow-xs dark:aria-pressed:border-input dark:aria-pressed:bg-input/30 [&_svg]:size-3.5',
        className,
      )}
      {...props}
    />
  )
}
