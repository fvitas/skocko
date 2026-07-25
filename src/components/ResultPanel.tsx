import { press } from '../press'
import { SymbolIcon } from './SymbolIcon'
import type { Strings } from '../i18n'

type ResultPanelProps = {
  status: 'won' | 'lost' | 'timeout'
  strings: Strings
  onNewGame: () => void
}

export function ResultPanel({ status, strings, onNewGame }: ResultPanelProps) {
  return (
    <div className="animate-rise border-t border-ink-dim/30 pt-4">
      {status === 'won' && (
        <div className="mb-4 flex items-center justify-center gap-3">
          <SymbolIcon symbol="skocko" className="h-12 w-12 animate-bob drop-shadow-[0_3px_5px_rgba(0,0,0,0.4)]" />
          <h2 className="font-display text-2xl leading-tight font-bold tracking-wide text-gold">
            {strings.winTitle}
          </h2>
        </div>
      )}
      <button
        type="button"
        {...press(onNewGame)}
        className="w-full rounded-2xl bg-linear-to-b from-gold-hi to-gold py-3.5 font-display text-lg font-semibold tracking-wide text-[#3a2500] shadow-[0_4px_0_#b8860b,inset_0_1px_0_rgba(255,255,255,0.5)] transition-transform duration-150 active:translate-y-[2px] active:duration-0"
      >
        {strings.newGame}
      </button>
    </div>
  )
}
