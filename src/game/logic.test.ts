import { describe, expect, it } from 'vitest'
import { CODE_LENGTH, SYMBOLS, evaluateGuess, randomSecret } from './logic'
import type { GameSymbol } from './logic'

const g = (...symbols: GameSymbol[]) => symbols

describe('evaluateGuess', () => {
  it('returns 4 red for an exact match', () => {
    const secret = g('skocko', 'heart', 'star', 'club')
    expect(evaluateGuess(secret, secret)).toEqual({ red: 4, yellow: 0 })
  })

  it('returns 0 red 0 yellow when nothing matches', () => {
    expect(evaluateGuess(g('heart', 'heart', 'heart', 'heart'), g('club', 'spade', 'star', 'diamond'))).toEqual({
      red: 0,
      yellow: 0,
    })
  })

  it('returns 4 yellow for a full anagram', () => {
    expect(evaluateGuess(g('heart', 'star', 'club', 'spade'), g('star', 'heart', 'spade', 'club'))).toEqual({
      red: 0,
      yellow: 4,
    })
  })

  it('does not double-count a guessed duplicate present once in secret', () => {
    // secret has one heart; guessing two hearts must yield only one hit
    expect(evaluateGuess(g('heart', 'club', 'club', 'club'), g('heart', 'heart', 'spade', 'spade'))).toEqual({
      red: 1,
      yellow: 0,
    })
  })

  it('counts duplicates in secret matched by duplicates in guess', () => {
    expect(evaluateGuess(g('heart', 'heart', 'club', 'club'), g('club', 'club', 'heart', 'heart'))).toEqual({
      red: 0,
      yellow: 4,
    })
  })

  it('red consumes the secret symbol before yellow can claim it', () => {
    // second heart in guess is red; first heart must not also score yellow
    expect(evaluateGuess(g('club', 'heart', 'star', 'star'), g('heart', 'heart', 'diamond', 'diamond'))).toEqual({
      red: 1,
      yellow: 0,
    })
  })

  it('mixes red and yellow correctly', () => {
    expect(evaluateGuess(g('skocko', 'heart', 'star', 'club'), g('skocko', 'star', 'heart', 'diamond'))).toEqual({
      red: 1,
      yellow: 2,
    })
  })
})

describe('randomSecret', () => {
  it('produces 4 valid symbols', () => {
    const secret = randomSecret()
    expect(secret).toHaveLength(CODE_LENGTH)
    for (const symbol of secret) {
      expect(SYMBOLS).toContain(symbol)
    }
  })
})
