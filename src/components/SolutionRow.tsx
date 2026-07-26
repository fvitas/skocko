import type { GameSymbol } from '../game/logic'
import { SymbolIcon } from './SymbolIcon'

type SolutionRowProps = {
  secret: GameSymbol[]
  label: string
}

export function SolutionRow({ secret, label }: SolutionRowProps) {
  return (
    <div className="grid animate-rise grid-cols-[repeat(4,1fr)_144px] items-center gap-2">
      {secret.map((symbol, i) => (
        <div
          key={i}
          className="grid aspect-square place-items-center rounded-2xl border-[1.5px] border-gold bg-linear-to-b from-cell-hi to-[#0e2270] shadow-[inset_0_2px_6px_rgba(0,0,0,0.3),0_0_12px_rgba(255,201,60,0.25)] in-data-capturing:shadow-[inset_0_2px_6px_rgba(0,0,0,0.3)]"
        >
          <SymbolIcon symbol={symbol} className="h-[58%] w-[58%] animate-pop drop-shadow-[0_2px_2px_rgba(0,0,0,0.4)]" />
        </div>
      ))}
      <span className="text-center text-xs font-bold tracking-widest text-ink-dim uppercase">{label}</span>
    </div>
  )
}
