import { SYMBOLS } from '../game/logic'
import type { GameSymbol } from '../game/logic'
import type { Strings } from '../i18n'
import { ResponsiveModal } from './ResponsiveModal'
import { SymbolIcon } from './SymbolIcon'

type RulesSheetProps = {
  open: boolean
  strings: Strings
  onOpenChange: (open: boolean) => void
}

function MiniRow({ symbols }: { symbols: GameSymbol[] }) {
  return (
    <div className="flex gap-1">
      {symbols.map((symbol, i) => (
        <span key={i} className="grid h-7 w-7 place-items-center rounded-md border border-cell-edge/40 bg-cell-lo">
          <SymbolIcon symbol={symbol} className="h-4.5 w-4.5" />
        </span>
      ))}
    </div>
  )
}

function MiniPegs({ red, yellow }: { red: number; yellow: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 4 }, (_, i) => (
        <span
          key={i}
          className={`h-2.5 w-2.5 rounded-full ${
            i < red ? 'bg-peg-red' : i < red + yellow ? 'bg-peg-yellow' : 'border border-white/15 bg-[#081444]'
          }`}
        />
      ))}
    </div>
  )
}

type ExampleProps = {
  secret: GameSymbol[]
  guess: GameSymbol[]
  red: number
  yellow: number
  secretLabel: string
  guessLabel: string
}

function Example({ secret, guess, red, yellow, secretLabel, guessLabel }: ExampleProps) {
  return (
    <div className="mt-2 space-y-1.5 rounded-xl bg-[#0b1d66]/60 p-2.5">
      <div className="flex items-center gap-2">
        <span className="w-16 text-[11px] font-bold tracking-wide text-ink-dim uppercase">{secretLabel}</span>
        <MiniRow symbols={secret} />
      </div>
      <div className="flex items-center gap-2">
        <span className="w-16 text-[11px] font-bold tracking-wide text-ink-dim uppercase">{guessLabel}</span>
        <MiniRow symbols={guess} />
        <span className="text-ink-dim">→</span>
        <MiniPegs red={red} yellow={yellow} />
      </div>
    </div>
  )
}

export function RulesSheet({ open, strings, onOpenChange }: RulesSheetProps) {
  return (
    <ResponsiveModal open={open} title={strings.rulesTitle} closeLabel={strings.close} onOpenChange={onOpenChange}>
      <ul className="mt-6 space-y-1.5 text-sm leading-snug text-ink/90">
        {strings.rules.map((rule) => (
          <li key={rule}>{rule}</li>
        ))}
      </ul>

      <div className="mt-5">
        <h3 className="mb-2 text-xs font-bold tracking-widest text-ink-dim uppercase">{strings.rulesSymbols}</h3>
        <div className="flex gap-2">
          {SYMBOLS.map((symbol) => (
            <span key={symbol} className="grid h-10 w-10 place-items-center rounded-xl border border-cell-edge/40 bg-cell-lo">
              <SymbolIcon symbol={symbol} className="h-6 w-6" />
            </span>
          ))}
        </div>
      </div>

      <div className="mt-5">
        <h3 className="mb-2 text-xs font-bold tracking-widest text-ink-dim uppercase">{strings.rulesFeedback}</h3>
        <div className="space-y-1.5 text-sm text-ink/90">
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

      <div className="mt-5 border-t border-white/10 pt-4">
        <h3 className="mb-2 text-xs font-bold tracking-widest text-ink-dim uppercase">{strings.rulesGotchas}</h3>
        <p className="mb-3 text-sm leading-snug font-semibold text-ink">{strings.gotchasIntro}</p>

        <p className="text-sm leading-snug text-ink/90">{strings.gotchaSorted}</p>
        <Example
          secret={['heart', 'spade', 'club', 'diamond']}
          guess={['star', 'star', 'club', 'diamond']}
          red={2}
          yellow={0}
          secretLabel={strings.solution}
          guessLabel={strings.guessLabel}
        />

        <p className="mt-4 text-sm leading-snug text-ink/90">{strings.gotchaOnce}</p>
        <Example
          secret={['heart', 'spade', 'club', 'diamond']}
          guess={['heart', 'heart', 'heart', 'heart']}
          red={1}
          yellow={0}
          secretLabel={strings.solution}
          guessLabel={strings.guessLabel}
        />
      </div>
    </ResponsiveModal>
  )
}
