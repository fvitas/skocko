import { Settings } from 'lucide-react'
import { useEffect, useState } from 'react'
import { GuessRow } from './components/GuessRow'
import { SymbolIcon } from './components/SymbolIcon'
import { ResultPanel } from './components/ResultPanel'
import { SolutionRow } from './components/SolutionRow'
import { SettingsSheet } from './components/SettingsSheet'
import { SymbolTray } from './components/SymbolTray'
import { CODE_LENGTH, MAX_ATTEMPTS, TIMER_SECONDS, evaluateGuess, randomSecret } from './game/logic'
import type { GameSymbol, Guess } from './game/logic'
import { STRINGS } from './i18n'
import type { Lang } from './i18n'

type GameStatus = 'playing' | 'won' | 'lost' | 'timeout'

type Settings = {
  lang: Lang
  timerEnabled: boolean
}

const SETTINGS_KEY = 'skocko-settings'
const TIMER_TICK_MS = 200

function readSettings(): Settings {
  const fallback: Settings = { lang: 'sr', timerEnabled: false }
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    return raw ? { ...fallback, ...(JSON.parse(raw) as Partial<Settings>) } : fallback
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
  const [remainingMs, setRemainingMs] = useState(TIMER_SECONDS * 1_000)
  const [shake, setShake] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)

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
    setRemainingMs(TIMER_SECONDS * 1_000)
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

  const timerRatio = remainingMs / (TIMER_SECONDS * 1_000)

  return (
    <div className="relative min-h-dvh overflow-hidden bg-[radial-gradient(120%_80%_at_50%_-10%,#1a47d6,#0e2a8f_55%,#0a1b5e)] font-body text-ink">
      <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(115deg,transparent_0_90px,rgba(255,255,255,0.045)_90px_140px,transparent_140px_260px)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_100%_at_50%_110%,transparent_55%,rgba(2,6,40,0.45))]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-[radial-gradient(80%_60%_at_50%_100%,rgba(255,201,60,0.09),transparent_70%)]" />
      <div className="relative mx-auto flex h-dvh max-w-md flex-col">

      <header className="z-10 flex items-center justify-between px-4 pt-3.5 pb-1">
        <h1 className="flex items-center gap-2 font-display text-2xl font-bold tracking-wide [text-shadow:0_2px_0_rgba(0,0,0,0.35)]">
          <SymbolIcon symbol="skocko" className="h-8 w-8 animate-bob drop-shadow-[0_3px_4px_rgba(0,0,0,0.4)]" />
          <span>
            SKO<span className="text-gold">Č</span>KO
          </span>
        </h1>
        <button
          type="button"
          onClick={() => setSettingsOpen(true)}
          aria-label={strings.settings}
          className="grid h-9 w-9 place-items-center rounded-xl border border-cell-edge bg-linear-to-b from-panel-hi to-panel-lo text-ink-dim"
        >
          <Settings className="h-4.5 w-4.5" aria-hidden="true" />
        </button>
      </header>
      <p className="z-10 px-4 pb-1 text-[13px] font-bold text-ink-dim">{strings.subtitle}</p>

      <main className="z-10 flex flex-1 items-center px-4 py-2">
        <div className="flex w-full flex-col gap-[7px]">
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
              <ResultPanel status={status} strings={strings} onNewGame={startNewGame} />
            </div>
          )}
        </div>
      </div>

      <SettingsSheet
        open={settingsOpen}
        lang={settings.lang}
        timerEnabled={settings.timerEnabled}
        strings={strings}
        onOpenChange={setSettingsOpen}
        onLangChange={(lang) => updateSettings({ lang })}
        onTimerChange={(timerEnabled) => updateSettings({ timerEnabled })}
      />
      </div>
    </div>
  )
}
