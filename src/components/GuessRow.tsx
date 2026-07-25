import { CODE_LENGTH } from '../game/logic'
import type { Feedback, GameSymbol } from '../game/logic'
import { SymbolIcon } from './SymbolIcon'

type GuessRowProps = {
  symbols: GameSymbol[]
  feedback?: Feedback
  active?: boolean
  shake?: boolean
}

function pegClass(feedback: Feedback | undefined, index: number): string {
  if (feedback && index < feedback.red) {
    return 'animate-peg-in border-[#a8172f] bg-[radial-gradient(circle_at_35%_30%,#ff7d90,#ff3d5a_60%)]'
  }
  if (feedback && index < feedback.red + feedback.yellow) {
    return 'animate-peg-in border-[#b8860b] bg-[radial-gradient(circle_at_35%_30%,#ffe89a,#ffd23c_60%)]'
  }
  return 'border-[#1d2f80]/60 bg-[#0c1a60] shadow-[inset_0_2px_4px_rgba(0,0,0,0.55)]'
}

export function GuessRow({ symbols, feedback, active = false, shake = false }: GuessRowProps) {
  return (
    <div
      className={`grid grid-cols-[repeat(4,1fr)_144px] items-center gap-2 transition-transform ${
        active ? 'scale-[1.02]' : ''
      } ${shake ? 'animate-shake' : ''}`}
    >
      {Array.from({ length: CODE_LENGTH }, (_, i) => {
        const symbol = symbols[i]
        return (
          <div
            key={i}
            className={`grid aspect-square place-items-center rounded-2xl border-[1.5px] bg-linear-to-b shadow-[inset_0_2px_6px_rgba(0,0,0,0.35)] ${
              active
                ? 'border-gold from-cell-hi to-[#0e2270] shadow-[inset_0_2px_6px_rgba(0,0,0,0.3),0_0_12px_rgba(255,201,60,0.25)]'
                : 'border-cell-edge/45 from-[#10267c] to-cell-lo'
            }`}
          >
            {symbol && (
              <SymbolIcon
                symbol={symbol}
                className="h-[58%] w-[58%] animate-pop drop-shadow-[0_2px_2px_rgba(0,0,0,0.4)]"
              />
            )}
          </div>
        )
      })}
      <div
        className={`flex items-center justify-center gap-1.5 rounded-full px-1.5 py-1.5 ${
          feedback ? 'bg-[#060e46]/60' : 'bg-[#060e46]/30'
        }`}
      >
        {Array.from({ length: CODE_LENGTH }, (_, i) => (
          <div
            key={feedback ? `f${i}` : `e${i}`}
            style={{ animationDelay: `${i * 90}ms` }}
            className={`h-7 w-7 rounded-full border ${pegClass(feedback, i)}`}
          />
        ))}
      </div>
    </div>
  )
}
