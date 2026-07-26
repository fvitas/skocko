import { CircleHelp, Dices, Settings } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { GuessRow } from './components/GuessRow'
import { SymbolIcon } from './components/SymbolIcon'
import { ResultPanel } from './components/ResultPanel'
import { SolutionRow } from './components/SolutionRow'
import { RulesSheet } from './components/RulesSheet'
import { SettingsSheet } from './components/SettingsSheet'
import { ShareSheet } from './components/ShareSheet'
import { StageShards } from './components/StageShards'
import { SymbolTray } from './components/SymbolTray'
import { CODE_LENGTH, DEFAULT_TIMER_SECONDS, MAX_ATTEMPTS, TIMER_OPTIONS, evaluateGuess, randomSecret } from './game/logic'
import type { GameSymbol, Guess, TimerSeconds } from './game/logic'
import { installIphoneHaptics, vibrate } from './haptics'
import { STRINGS } from './i18n'
import type { Lang } from './i18n'
import { captureBoardCard, shareBoardImage } from './share'

type GameStatus = 'playing' | 'won' | 'lost' | 'timeout'

type Settings = {
  lang: Lang
  timerEnabled: boolean
  timerSeconds: TimerSeconds
}

const SETTINGS_KEY = 'skocko-settings'
const TIMER_TICK_MS = 200

function readSettings(): Settings {
  const fallback: Settings = { lang: 'sr', timerEnabled: false, timerSeconds: DEFAULT_TIMER_SECONDS }
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    const settings = raw ? { ...fallback, ...(JSON.parse(raw) as Partial<Settings>) } : fallback
    if (!(TIMER_OPTIONS as readonly number[]).includes(settings.timerSeconds)) {
      settings.timerSeconds = DEFAULT_TIMER_SECONDS
    }
    return settings
  } catch {
    return fallback
  }
}

function saveSettings(settings: Settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
}

export function App() {
  const [settings, setSettings] = useState(readSettings)
  const [secret, setSecret] = useState(randomSecret)
  const [guesses, setGuesses] = useState<Guess[]>([])
  const [current, setCurrent] = useState<GameSymbol[]>([])
  const [status, setStatus] = useState<GameStatus>('playing')
  const [remainingMs, setRemainingMs] = useState(settings.timerSeconds * 1_000)
  const [shake, setShake] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [rulesOpen, setRulesOpen] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)
  const [shareCard, setShareCard] = useState<Blob | null>(null)
  const boardRef = useRef<HTMLDivElement>(null)
  const shareCardRef = useRef<Promise<Blob> | null>(null)

  const strings = STRINGS[settings.lang]
  const timerRunning = settings.timerEnabled && status === 'playing'

  useEffect(() => {
    if (!timerRunning) return
    const id = setInterval(() => {
      setRemainingMs((ms) => Math.max(0, ms - TIMER_TICK_MS))
    }, TIMER_TICK_MS)
    return () => clearInterval(id)
  }, [timerRunning])

  useEffect(() => {
    if (timerRunning && remainingMs === 0) setStatus('timeout')
  }, [timerRunning, remainingMs])

  // one global listener instead of wiring every button — covers header, tray,
  // result panel and radix controls rendered in portals
  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (event.pointerType !== 'touch') return
      if (event.target instanceof Element && event.target.closest('button')) vibrate()
    }
    document.addEventListener('pointerdown', handlePointerDown)
    const uninstallHaptics = installIphoneHaptics()
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      uninstallHaptics?.()
    }
  }, [])

  // capture the share card as soon as the game ends — doing it on tap is too
  // slow on phones and navigator.share loses the tap's user activation
  useEffect(() => {
    if (status === 'playing' || !boardRef.current) {
      shareCardRef.current = null
      return
    }
    const card = captureBoardCard(boardRef.current)
    card.catch(() => {
      if (shareCardRef.current === card) shareCardRef.current = null
    })
    shareCardRef.current = card
  }, [status])

  function updateSettings(patch: Partial<Settings>) {
    const next = { ...settings, ...patch }
    setSettings(next)
    saveSettings(next)
  }

  function startNewGame() {
    setSecret(randomSecret())
    setGuesses([])
    setCurrent([])
    setStatus('playing')
    setRemainingMs(settings.timerSeconds * 1_000)
  }

  // picking a new duration restarts the countdown for the current round
  function changeTimerSeconds(timerSeconds: TimerSeconds) {
    updateSettings({ timerSeconds })
    setRemainingMs(timerSeconds * 1_000)
  }

  function pickSymbol(symbol: GameSymbol) {
    if (status !== 'playing' || current.length >= CODE_LENGTH) return
    setCurrent([...current, symbol])
  }

  function clearLast() {
    setCurrent(current.slice(0, -1))
  }

  function confirmGuess() {
    if (status !== 'playing') return
    if (current.length < CODE_LENGTH) {
      setShake(true)
      setTimeout(() => setShake(false), 450)
      return
    }
    const feedback = evaluateGuess(secret, current)
    setGuesses([...guesses, { symbols: current, feedback }])
    setCurrent([])
    if (feedback.red === CODE_LENGTH) {
      setStatus('won')
    } else if (guesses.length + 1 >= MAX_ATTEMPTS) {
      setStatus('lost')
    }
  }

  async function shareResult() {
    if (!boardRef.current) return
    shareCardRef.current ??= captureBoardCard(boardRef.current)
    const text = status === 'won' ? strings.shareWon : strings.shareLost
    const outcome = await shareBoardImage(shareCardRef.current, text, location.origin)
    if (outcome === 'modal') {
      setShareCard(await shareCardRef.current)
      setShareOpen(true)
    }
  }

  const timerRatio = remainingMs / (settings.timerSeconds * 1_000)

  return (
    <div className="relative min-h-dvh overflow-hidden bg-[radial-gradient(120%_80%_at_50%_-10%,#1a47d6,#0e2a8f_55%,#0a1b5e)] font-body text-ink">
      <StageShards />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_100%_at_50%_110%,transparent_55%,rgba(2,6,40,0.45))]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-[radial-gradient(80%_60%_at_50%_100%,rgba(255,201,60,0.09),transparent_70%)]" />
      <div className="relative mx-auto flex h-dvh max-w-md flex-col">

      <header className="z-10 flex items-center justify-between px-4 pt-3.5 pb-1">
        <h1 aria-label="SKOČKO" className="flex items-center gap-[3px]">
          <span
            aria-hidden="true"
            className="hidden h-7 w-7 place-items-center rounded-lg border-[1.5px] border-cell-edge/70 bg-linear-to-b from-cell-hi to-cell-lo shadow-[0_2px_0_#081444] min-[400px]:grid"
          >
            <SymbolIcon symbol="skocko" className="h-5 w-5" />
          </span>
          {[...'SKOČKO'].map((letter, i) => (
            <span
              key={i}
              aria-hidden="true"
              className="grid h-7 w-7 place-items-center rounded-lg border-[1.5px] border-cell-edge/70 bg-linear-to-b from-cell-hi to-cell-lo font-display text-[17px] font-bold shadow-[0_2px_0_#081444] [text-shadow:0_2px_0_rgba(0,0,0,0.35)]"
            >
              {letter}
            </span>
          ))}
        </h1>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onPointerDown={startNewGame}
            aria-label={strings.newGame}
            className="grid h-9 w-9 place-items-center rounded-xl border-[1.5px] border-[#5a7df0]/50 bg-linear-to-b from-[#1d3cae] to-panel-lo text-ink-dim shadow-[0_3px_0_#0a1a5c] transition-transform duration-150 active:translate-y-[2px] active:shadow-none active:duration-0"
          >
            <Dices className="h-4.5 w-4.5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onPointerDown={() => setRulesOpen(true)}
            aria-label={strings.rulesTitle}
            className="grid h-9 w-9 place-items-center rounded-xl border-[1.5px] border-[#5a7df0]/50 bg-linear-to-b from-[#1d3cae] to-panel-lo text-ink-dim shadow-[0_3px_0_#0a1a5c] transition-transform duration-150 active:translate-y-[2px] active:shadow-none active:duration-0"
          >
            <CircleHelp className="h-4.5 w-4.5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onPointerDown={() => setSettingsOpen(true)}
            aria-label={strings.settings}
            className="grid h-9 w-9 place-items-center rounded-xl border-[1.5px] border-[#5a7df0]/50 bg-linear-to-b from-[#1d3cae] to-panel-lo text-ink-dim shadow-[0_3px_0_#0a1a5c] transition-transform duration-150 active:translate-y-[2px] active:shadow-none active:duration-0"
          >
            <Settings className="h-4.5 w-4.5" aria-hidden="true" />
          </button>
        </div>
      </header>
      <p className="z-10 px-4 pb-1 text-[13px] font-bold text-ink-dim">{strings.subtitle}</p>

      <main className="z-10 flex flex-1 items-center px-4 py-2">
        <div ref={boardRef} className="flex w-full flex-col gap-[7px]">
          <div className="flex items-stretch gap-3">
            {settings.timerEnabled && (
              <div className="relative w-2.5 overflow-hidden rounded-full bg-[#081444] shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]">
                <div
                  style={{ height: `${timerRatio * 100}%` }}
                  className={`absolute inset-x-0 bottom-0 rounded-full transition-[height] duration-200 ease-linear ${
                    timerRatio < 0.2 ? 'bg-peg-red' : 'bg-gold'
                  }`}
                />
              </div>
            )}
            <div className="flex flex-1 flex-col gap-[7px]">
              {Array.from({ length: MAX_ATTEMPTS }, (_, i) => {
                const guess = guesses[i]
                const isActive = status === 'playing' && i === guesses.length
                return (
                  <div key={i} style={{ animationDelay: `${i * 55}ms` }} className="animate-rise">
                    <GuessRow
                      symbols={guess ? guess.symbols : isActive ? current : []}
                      feedback={guess?.feedback}
                      active={isActive}
                      shake={isActive && shake}
                    />
                  </div>
                )
              })}
            </div>
          </div>
          <div className={settings.timerEnabled ? 'pl-[22px]' : undefined}>
            {status !== 'playing' ? (
              <SolutionRow secret={secret} label={strings.solution} />
            ) : (
              <div aria-hidden="true" className="invisible grid grid-cols-[repeat(4,1fr)_144px] gap-2">
                <div className="aspect-square" />
              </div>
            )}
          </div>
        </div>
      </main>

      <div style={{ animationDelay: '360ms' }} className="z-10 animate-rise px-4 pb-[calc(16px+env(safe-area-inset-bottom))]">
        <div className="relative">
          <div className={status === 'playing' ? undefined : 'invisible'}>
            <SymbolTray
              ready={current.length === CODE_LENGTH}
              confirmLabel={strings.confirm}
              clearLabel={strings.clear}
              clearText={strings.clearShort}
              onPick={pickSymbol}
              onClear={clearLast}
              onConfirm={confirmGuess}
            />
          </div>
          {status !== 'playing' && (
            <div className="absolute inset-0 flex flex-col justify-end">
              <ResultPanel status={status} strings={strings} onNewGame={startNewGame} onShare={shareResult} />
            </div>
          )}
        </div>
      </div>

      <SettingsSheet
        open={settingsOpen}
        lang={settings.lang}
        timerEnabled={settings.timerEnabled}
        timerSeconds={settings.timerSeconds}
        strings={strings}
        onOpenChange={setSettingsOpen}
        onLangChange={(lang) => updateSettings({ lang })}
        onTimerChange={(timerEnabled) => updateSettings({ timerEnabled })}
        onTimerSecondsChange={changeTimerSeconds}
      />

      <RulesSheet open={rulesOpen} strings={strings} onOpenChange={setRulesOpen} />

      <ShareSheet
        open={shareOpen}
        card={shareCard}
        text={status === 'won' ? strings.shareWon : strings.shareLost}
        url={location.origin}
        strings={strings}
        onOpenChange={setShareOpen}
      />
      </div>
    </div>
  )
}
