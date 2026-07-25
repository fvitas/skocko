import { describe, expect, it } from 'vitest'
import { SYMBOLS, evaluateGuess } from './logic'
import type { GameSymbol } from './logic'

// canonical Mastermind feedback (Knuth): reds = exact; yellow = Σ min(counts) − reds
function referenceFeedback(secret: GameSymbol[], guess: GameSymbol[]) {
  const red = secret.filter((s, i) => guess[i] === s).length
  let matches = 0
  for (const symbol of SYMBOLS) {
    const inSecret = secret.filter((s) => s === symbol).length
    const inGuess = guess.filter((s) => s === symbol).length
    matches += Math.min(inSecret, inGuess)
  }
  return { red, yellow: matches - red }
}

function allCodes(): GameSymbol[][] {
  const codes: GameSymbol[][] = []
  for (const a of SYMBOLS)
    for (const b of SYMBOLS)
      for (const c of SYMBOLS)
        for (const d of SYMBOLS) codes.push([a, b, c, d])
  return codes
}

describe('evaluateGuess matches canonical Mastermind feedback', () => {
  it('agrees on all 1296 × 1296 secret/guess pairs', () => {
    const codes = allCodes()
    let mismatches = 0
    for (const secret of codes) {
      for (const guess of codes) {
        const ours = evaluateGuess(secret, guess)
        const ref = referenceFeedback(secret, guess)
        if (ours.red !== ref.red || ours.yellow !== ref.yellow) {
          mismatches += 1
          if (mismatches === 1) {
            expect.fail(`mismatch for secret=${secret.join(',')} guess=${guess.join(',')}: ours=${JSON.stringify(ours)} ref=${JSON.stringify(ref)}`)
          }
        }
      }
    }
    expect(mismatches).toBe(0)
  })
})
