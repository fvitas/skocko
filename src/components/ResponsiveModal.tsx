import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { Drawer } from 'vaul'

type ResponsiveModalProps = {
  open: boolean
  title: string
  closeLabel: string
  children: ReactNode
  onOpenChange: (open: boolean) => void
}

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(() => window.matchMedia('(min-width: 640px)').matches)

  useEffect(() => {
    const query = window.matchMedia('(min-width: 640px)')
    const onChange = (event: MediaQueryListEvent) => setIsDesktop(event.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  return isDesktop
}

const SURFACE_CLASS =
  'border border-white/10 bg-linear-to-b from-[#16307f] to-[#0a1a5c] shadow-2xl outline-none'

export function ResponsiveModal({ open, title, closeLabel, children, onOpenChange }: ResponsiveModalProps) {
  const isDesktop = useIsDesktop()

  if (isDesktop) {
    return (
      <Dialog.Root open={open} onOpenChange={onOpenChange}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out" />
          <Dialog.Content
            aria-describedby={undefined}
            // transform (not translate-*) so the open/close animation replaces it instead of stacking
            className={`fixed top-1/2 left-1/2 z-40 max-h-[85dvh] w-full max-w-md overflow-y-auto [transform:translate(-50%,-50%)] rounded-2xl p-6 data-[state=open]:animate-dialog-in data-[state=closed]:animate-dialog-out ${SURFACE_CLASS}`}
          >
            <Dialog.Title className="text-lg leading-none font-bold text-ink">{title}</Dialog.Title>
            <Dialog.Close
              aria-label={closeLabel}
              className="absolute top-4 right-4 rounded-md p-1 text-ink-dim opacity-70 transition-opacity duration-150 hover:opacity-100"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </Dialog.Close>
            {children}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    )
  }

  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm" />
        <Drawer.Content
          aria-describedby={undefined}
          className={`fixed inset-x-0 bottom-0 z-40 max-h-[85dvh] rounded-t-2xl p-6 pt-3 pb-[calc(24px+env(safe-area-inset-bottom))] ${SURFACE_CLASS}`}
        >
          <div aria-hidden="true" className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-white/20" />
          <div className="max-h-[calc(85dvh-70px)] overflow-y-auto">
            <Drawer.Title className="text-lg leading-none font-bold text-ink">{title}</Drawer.Title>
            {children}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
