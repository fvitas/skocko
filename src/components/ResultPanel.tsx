import { Share2 } from 'lucide-react'
import { useState } from 'react'
import { SymbolIcon } from './SymbolIcon'
import type { Strings } from '../i18n'

type ResultPanelProps = {
  status: 'won' | 'lost' | 'timeout'
  strings: Strings
  onNewGame: () => void
  onShare: () => Promise<void>
}

export function ResultPanel({ status, strings, onNewGame, onShare }: ResultPanelProps) {
  const [sharing, setSharing] = useState(false)

  async function handleShare() {
    if (sharing) return
    setSharing(true)
    try {
      await onShare()
    } finally {
      setSharing(false)
    }
  }

  return (
    <div className="animate-rise border-t border-ink-dim/30 pt-4">
      {status === 'won' ? (
        <div className="mb-4 flex items-center justify-center gap-3">
          <SymbolIcon symbol="skocko" className="h-12 w-12 drop-shadow-[0_3px_5px_rgba(0,0,0,0.4)]" />
          <h2 className="font-display text-2xl leading-tight font-bold tracking-wide text-gold">
            {strings.winTitle}
          </h2>
        </div>
      ) : (
        <h2 className="mb-4 text-center font-display text-2xl leading-tight font-bold tracking-wide text-ink-dim">
          {status === 'timeout' ? strings.timeoutTitle : strings.loseTitle}
        </h2>
      )}
      <div className="grid grid-cols-[1fr_1.4fr] gap-2">
        <button
          type="button"
          // click, not pointerdown — navigator.share needs a real activation event on ios
          onClick={handleShare}
          className={`flex items-center justify-center gap-2 rounded-2xl bg-linear-to-b from-[#22409f] to-[#152e80] py-3.5 font-display text-lg font-semibold tracking-wide text-ink-dim shadow-[0_4px_0_#0a1a5c] transition-transform duration-150 active:translate-y-[2px] active:shadow-none active:duration-0 ${
            sharing ? 'opacity-60' : ''
          }`}
        >
          <Share2 className="h-4.5 w-4.5" aria-hidden="true" />
          {strings.share}
        </button>
        <button
          type="button"
          onPointerDown={onNewGame}
          className="rounded-2xl bg-linear-to-b from-gold-hi to-gold py-3.5 font-display text-lg font-semibold tracking-wide text-[#3a2500] shadow-[0_4px_0_#b8860b,inset_0_1px_0_rgba(255,255,255,0.5)] transition-transform duration-150 active:translate-y-[2px] active:duration-0"
        >
          {strings.newGame}
        </button>
      </div>
    </div>
  )
}
