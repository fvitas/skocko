// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { act } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { App } from './App'
import { SYMBOLS } from './game/logic'
import type { GameSymbol } from './game/logic'

// jsdom can't run html-to-image; the capture effect fires on every game end
vi.mock('./share', () => ({
  captureBoardCard: vi.fn(async () => new Blob()),
  shareBoardImage: vi.fn(async () => 'shared'),
}))

function stubMatchMedia() {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
    }) as unknown as MediaQueryList
}

// tray symbol buttons are icon-only and render in SYMBOLS order inside the 6-col grid
function trayButton(symbol: GameSymbol): HTMLButtonElement {
  const grid = document.querySelector('.grid-cols-6')
  if (!grid) throw new Error('symbol tray not rendered')
  return grid.querySelectorAll('button')[SYMBOLS.indexOf(symbol)]
}

function confirmButton() {
  return screen.getByRole('button', { name: 'CHECK' })
}

// symbols rendered on the board — the header/tray/result icons live outside <main>
function boardSymbolCount() {
  const main = document.querySelector('main')
  if (!main) throw new Error('board not rendered')
  return main.querySelectorAll('svg').length
}

function submitGuess(symbols: GameSymbol[]) {
  for (const symbol of symbols) fireEvent.pointerDown(trayButton(symbol))
  fireEvent.pointerDown(confirmButton())
}

// Math.random pinned to 0 makes randomSecret() return four of SYMBOLS[0] ('skocko')
const SECRET = Array.from({ length: 4 }, () => 'skocko' as GameSymbol)
const WRONG = Array.from({ length: 4 }, () => 'club' as GameSymbol)

// the header dice button is also named NEW GAME — the SHARE button only exists in the result panel
function resultPanelOpen() {
  return screen.queryByText('SHARE') !== null
}

const END_TITLES = { won: 'SKOČKO!', lost: 'BETTER LUCK NEXT TIME', timeout: "TIME'S UP" }

function expectGameOver(outcome: keyof typeof END_TITLES) {
  expect(resultPanelOpen()).toBe(true)
  expect(screen.getByText('Solution')).toBeTruthy()
  expect(screen.getByText(END_TITLES[outcome])).toBeTruthy()
}

function tapNewGame() {
  const [headerButton] = screen.getAllByRole('button', { name: 'NEW GAME' })
  fireEvent.pointerDown(headerButton)
}

beforeEach(() => {
  stubMatchMedia()
  vi.spyOn(Math, 'random').mockReturnValue(0)
})

afterEach(() => {
  cleanup()
  localStorage.clear()
  vi.restoreAllMocks()
  vi.useRealTimers()
})

describe('game state machine', () => {
  it('starts with an empty board, tray visible, no result panel', () => {
    render(<App />)
    expect(boardSymbolCount()).toBe(0)
    expect(confirmButton()).toBeTruthy()
    expect(resultPanelOpen()).toBe(false)
    expect(screen.queryByText('Solution')).toBeNull()
  })

  it('caps the current guess at 4 symbols', () => {
    render(<App />)
    for (let i = 0; i < 5; i++) fireEvent.pointerDown(trayButton('heart'))
    expect(boardSymbolCount()).toBe(4)
  })

  it('removes the last symbol on clear', () => {
    render(<App />)
    fireEvent.pointerDown(trayButton('heart'))
    fireEvent.pointerDown(trayButton('star'))
    fireEvent.pointerDown(screen.getByRole('button', { name: 'Undo last symbol' }))
    expect(boardSymbolCount()).toBe(1)
  })

  it('rejects an incomplete guess with a shake instead of committing it', () => {
    render(<App />)
    fireEvent.pointerDown(trayButton('heart'))
    fireEvent.pointerDown(confirmButton())
    expect(document.querySelector('.animate-shake')).toBeTruthy()
    expect(screen.queryByText('Solution')).toBeNull()
    expect(boardSymbolCount()).toBe(1)
  })

  it('incomplete confirms consume no attempts', () => {
    render(<App />)
    for (let i = 0; i < 3; i++) fireEvent.pointerDown(confirmButton())
    for (let i = 0; i < 5; i++) submitGuess(WRONG)
    expect(resultPanelOpen()).toBe(false)
    submitGuess(WRONG)
    expectGameOver('lost')
  })

  it('wins on a correct guess: result panel, solution row, tray hidden', () => {
    render(<App />)
    submitGuess(SECRET)
    expectGameOver('won')
    expect(confirmButton().closest('.invisible')).toBeTruthy()
  })

  it('loses after 6 wrong guesses without a win heading', () => {
    render(<App />)
    for (let i = 0; i < 6; i++) submitGuess(WRONG)
    expectGameOver('lost')
  })

  it('a correct 6th guess wins instead of losing', () => {
    render(<App />)
    for (let i = 0; i < 5; i++) submitGuess(WRONG)
    submitGuess(SECRET)
    expectGameOver('won')
  })

  it('new game resets the board, solution and tray', () => {
    render(<App />)
    submitGuess(SECRET)
    tapNewGame()
    expect(screen.queryByText('SKOČKO!')).toBeNull()
    expect(screen.queryByText('Solution')).toBeNull()
    expect(boardSymbolCount()).toBe(0)
    expect(confirmButton().closest('.invisible')).toBeNull()
  })
})

describe('timer', () => {
  it('ends the game in timeout when enabled time runs out', () => {
    localStorage.setItem('skocko-settings', JSON.stringify({ timerEnabled: true, timerSeconds: 90 }))
    vi.useFakeTimers()
    render(<App />)
    act(() => vi.advanceTimersByTime(90_000))
    expectGameOver('timeout')
  })

  it('does not end the game when the timer is disabled', () => {
    vi.useFakeTimers()
    render(<App />)
    act(() => vi.advanceTimersByTime(300_000))
    expect(resultPanelOpen()).toBe(false)
    expect(confirmButton()).toBeTruthy()
  })

  it('new game restarts the countdown instead of staying in timeout', () => {
    localStorage.setItem('skocko-settings', JSON.stringify({ timerEnabled: true, timerSeconds: 60 }))
    vi.useFakeTimers()
    render(<App />)
    act(() => vi.advanceTimersByTime(60_000))
    tapNewGame()
    act(() => vi.advanceTimersByTime(30_000))
    expect(resultPanelOpen()).toBe(false)
    act(() => vi.advanceTimersByTime(30_000))
    expectGameOver('timeout')
  })
})
