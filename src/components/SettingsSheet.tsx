import * as Dialog from '@radix-ui/react-dialog'
import * as Switch from '@radix-ui/react-switch'
import * as ToggleGroup from '@radix-ui/react-toggle-group'
import { X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Drawer } from 'vaul'
import { TIMER_OPTIONS } from '../game/logic'
import type { TimerSeconds } from '../game/logic'
import type { Lang, Strings } from '../i18n'

type SettingsSheetProps = {
  open: boolean
  lang: Lang
  timerEnabled: boolean
  timerSeconds: TimerSeconds
  strings: Strings
  onOpenChange: (open: boolean) => void
  onLangChange: (lang: Lang) => void
  onTimerChange: (enabled: boolean) => void
  onTimerSecondsChange: (seconds: TimerSeconds) => void
}

type SettingsBodyProps = Omit<SettingsSheetProps, 'open' | 'onOpenChange'>

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

function SettingsBody({
  lang,
  timerEnabled,
  timerSeconds,
  strings,
  onLangChange,
  onTimerChange,
  onTimerSecondsChange,
}: SettingsBodyProps) {
  return (
    <>
      <div className="mt-6 flex items-center justify-between">
        <span className="text-sm font-medium text-ink">{strings.language}</span>
        <ToggleGroup.Root
          type="single"
          value={lang}
          onValueChange={(value) => {
            if (value) onLangChange(value as Lang)
          }}
          className="inline-flex rounded-lg border border-white/10 bg-[#0b1d66] p-1"
        >
          {(['sr', 'en'] as const).map((code) => (
            <ToggleGroup.Item
              key={code}
              value={code}
              className="rounded-md px-4 py-1.5 text-sm font-medium text-ink-dim uppercase transition-colors duration-150 data-[state=on]:bg-gold data-[state=on]:text-[#3a2500]"
            >
              {code}
            </ToggleGroup.Item>
          ))}
        </ToggleGroup.Root>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="pr-4">
          <label htmlFor="timer-switch" className="text-sm font-medium text-ink">
            {strings.timer}
          </label>
          <p className="text-xs text-ink-dim">{strings.timerHint}</p>
        </div>
        <Switch.Root
          id="timer-switch"
          checked={timerEnabled}
          onCheckedChange={onTimerChange}
          className="inline-flex h-6 w-11 shrink-0 items-center rounded-full border-2 border-transparent transition-colors duration-150 data-[state=checked]:bg-gold data-[state=unchecked]:bg-[#0b1d66]"
        >
          <Switch.Thumb className="pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg transition-transform duration-150 data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0" />
        </Switch.Root>
      </div>

      <div className={`mt-3 flex justify-end transition-opacity duration-150 ${timerEnabled ? '' : 'pointer-events-none opacity-40'}`}>
        <ToggleGroup.Root
          type="single"
          value={String(timerSeconds)}
          disabled={!timerEnabled}
          onValueChange={(value) => {
            if (value) onTimerSecondsChange(Number(value) as TimerSeconds)
          }}
          className="inline-flex rounded-lg border border-white/10 bg-[#0b1d66] p-1"
        >
          {TIMER_OPTIONS.map((seconds) => (
            <ToggleGroup.Item
              key={seconds}
              value={String(seconds)}
              className="rounded-md px-3.5 py-1.5 text-sm font-medium text-ink-dim transition-colors duration-150 data-[state=on]:bg-gold data-[state=on]:text-[#3a2500]"
            >
              {seconds}s
            </ToggleGroup.Item>
          ))}
        </ToggleGroup.Root>
      </div>

      <div className="mt-6 border-t border-white/10 pt-4">
        <h3 className="mb-2 text-xs font-bold tracking-widest text-ink-dim uppercase">
          {strings.rulesTitle}
        </h3>
        <ul className="space-y-1.5 text-sm leading-snug text-ink/90">
          {strings.rules.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ul>
        <div className="mt-3 space-y-1.5 text-sm text-ink/90">
          <p className="flex items-center gap-2">
            <span className="h-3.5 w-3.5 shrink-0 rounded-full bg-[radial-gradient(circle_at_35%_30%,#ff7d90,#ff3d5a_60%)]" />
            {strings.legendRed}
          </p>
          <p className="flex items-center gap-2">
            <span className="h-3.5 w-3.5 shrink-0 rounded-full bg-[radial-gradient(circle_at_35%_30%,#ffe89a,#ffd23c_60%)]" />
            {strings.legendYellow}
          </p>
        </div>
      </div>
    </>
  )
}

export function SettingsSheet({ open, onOpenChange, ...bodyProps }: SettingsSheetProps) {
  const isDesktop = useIsDesktop()

  if (isDesktop) {
    return (
      <Dialog.Root open={open} onOpenChange={onOpenChange}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out" />
          <Dialog.Content
            aria-describedby={undefined}
            // transform (not translate-*) so the open/close animation replaces it instead of stacking
            className={`fixed top-1/2 left-1/2 z-40 w-full max-w-md [transform:translate(-50%,-50%)] rounded-2xl p-6 data-[state=open]:animate-dialog-in data-[state=closed]:animate-dialog-out ${SURFACE_CLASS}`}
          >
            <Dialog.Title className="text-lg leading-none font-bold text-ink">{bodyProps.strings.settings}</Dialog.Title>
            <Dialog.Close
              aria-label={bodyProps.strings.close}
              className="absolute top-4 right-4 rounded-md p-1 text-ink-dim opacity-70 transition-opacity duration-150 hover:opacity-100"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </Dialog.Close>
            <SettingsBody {...bodyProps} />
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
          className={`fixed inset-x-0 bottom-0 z-40 rounded-t-2xl p-6 pt-3 pb-[calc(24px+env(safe-area-inset-bottom))] ${SURFACE_CLASS}`}
        >
          <div aria-hidden="true" className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-white/20" />
          <Drawer.Title className="text-lg leading-none font-bold text-ink">{bodyProps.strings.settings}</Drawer.Title>
          <SettingsBody {...bodyProps} />
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
