import * as Switch from '@radix-ui/react-switch'
import * as ToggleGroup from '@radix-ui/react-toggle-group'
import { TIMER_OPTIONS } from '../game/logic'
import type { TimerSeconds } from '../game/logic'
import type { Lang, Strings } from '../i18n'
import { ResponsiveModal } from './ResponsiveModal'

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

export function SettingsSheet({
  open,
  lang,
  timerEnabled,
  timerSeconds,
  strings,
  onOpenChange,
  onLangChange,
  onTimerChange,
  onTimerSecondsChange,
}: SettingsSheetProps) {
  return (
    <ResponsiveModal open={open} title={strings.settings} closeLabel={strings.close} onOpenChange={onOpenChange}>
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
          {(['en', 'sr'] as const).map((code) => (
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
    </ResponsiveModal>
  )
}
