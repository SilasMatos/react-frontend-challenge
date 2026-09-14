import { Toaster } from '@/components/ui/sonner'
import { useTheme } from '../hooks/use-theme'

export function AppToaster() {
  const { theme } = useTheme()

  return (
    <Toaster
      theme={theme}
      position="bottom-right"
      closeButton
      toastOptions={{
        duration: 4000,
        classNames: {
          toast:
            'w-(--width) font-sans [&[data-expanded=false][data-front=false]>*]:opacity-0',
        },
      }}
    />
  )
}
