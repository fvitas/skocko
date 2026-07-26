import { SYMBOLS } from '../game/logic'
import type { GameSymbol } from '../game/logic'
import { SymbolIcon } from './SymbolIcon'

type SymbolTrayProps = {
  ready: boolean
  confirmLabel: string
  clearLabel: string
  clearText: string
  symbolNames: Record<GameSymbol, string>
  onPick: (symbol: GameSymbol) => void
  onClear: () => void
  onConfirm: () => void
}

export function SymbolTray({ ready, confirmLabel, clearLabel, clearText, symbolNames, onPick, onClear, onConfirm }: SymbolTrayProps) {
  return (
    <div className="rounded-[22px] border border-cell-edge bg-linear-to-b from-[#10267c]/90 to-[#081444]/95 p-3 shadow-[0_-8px_30px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-md">
      <div className="mb-2.5 grid grid-cols-6 gap-2">
        {SYMBOLS.map((symbol) => (
          <button
            key={symbol}
            type="button"
            onPointerDown={() => onPick(symbol)}
            aria-label={symbolNames[symbol]}
            className="grid aspect-square place-items-center rounded-2xl border-[1.5px] border-[#5a7df0]/50 bg-linear-to-b from-[#1d3cae] to-panel-lo shadow-[0_3px_0_#0a1a5c] transition-transform duration-150 active:translate-y-[2px] active:shadow-none active:duration-0"
          >
            <SymbolIcon symbol={symbol} className="h-[62%] w-[62%] drop-shadow-[0_2px_2px_rgba(0,0,0,0.45)]" />
          </button>
        ))}
      </div>
      <div className="grid grid-cols-[1fr_1.4fr] gap-2">
        <button
          type="button"
          onPointerDown={onClear}
          aria-label={clearLabel}
          className="rounded-2xl bg-linear-to-b from-[#22409f] to-[#152e80] py-3.5 font-display text-lg font-semibold tracking-wide text-ink-dim shadow-[0_4px_0_#0a1a5c] transition-transform duration-150 active:translate-y-[2px] active:shadow-none active:duration-0"
        >
          {clearText}
        </button>
        <button
          type="button"
          onPointerDown={onConfirm}
          className={`rounded-2xl bg-linear-to-b from-gold-hi to-gold py-3.5 font-display text-lg font-semibold tracking-wide text-[#3a2500] transition-all duration-150 active:translate-y-[2px] active:shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] active:duration-0 ${
            ready
              ? 'shadow-[0_4px_0_#b8860b,0_0_26px_rgba(255,201,60,0.5),inset_0_1px_0_rgba(255,255,255,0.5)]'
              : 'opacity-85 shadow-[0_4px_0_#b8860b,inset_0_1px_0_rgba(255,255,255,0.5)]'
          }`}
        >
          {confirmLabel}
        </button>
      </div>
    </div>
  )
}
