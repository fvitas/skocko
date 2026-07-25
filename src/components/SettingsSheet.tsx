import * as Dialog from '@radix-ui/react-dialog'
import * as Switch from '@radix-ui/react-switch'
import * as ToggleGroup from '@radix-ui/react-toggle-group'
import { X } from 'lucide-react'
import type { Lang, Strings } from '../i18n'

type SettingsSheetProps = {
  open: boolean
  lang: Lang
  timerEnabled: boolean
  strings: Strings
  onOpenChange: (open: boolean) => void
  onLangChange: (lang: Lang) => void
  onTimerChange: (enabled: boolean) => void
}

export function SettingsSheet({
  open,
  lang,
  timerEnabled,
  strings,
  onOpenChange,
  onLangChange,
  onTimerChange,
}: SettingsSheetProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-md animate-rise rounded-t-2xl border border-white/10 bg-linear-to-b from-[#16307f] to-[#0a1a5c] p-6 pb-[calc(24px+env(safe-area-inset-bottom))] shadow-2xl outline-none sm:top-1/2 sm:bottom-auto sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-2xl sm:pb-6"
        >
          <Dialog.Title className="text-lg leading-none font-bold text-ink">{strings.settings}</Dialog.Title>
          <Dialog.Close
            aria-label={strings.close}
            className="absolute top-4 right-4 rounded-md p-1 text-ink-dim opacity-70 transition-opacity hover:opacity-100"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </Dialog.Close>

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
                  className="rounded-md px-4 py-1.5 text-sm font-medium text-ink-dim uppercase transition-colors data-[state=on]:bg-gold data-[state=on]:text-[#3a2500]"
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
              className="inline-flex h-6 w-11 shrink-0 items-center rounded-full border-2 border-transparent transition-colors data-[state=checked]:bg-gold data-[state=unchecked]:bg-[#0b1d66]"
            >
              <Switch.Thumb className="pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0" />
            </Switch.Root>
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
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
