export const SYMBOLS = ['skocko', 'club', 'spade', 'heart', 'diamond', 'star'] as const

export type GameSymbol = (typeof SYMBOLS)[number]

export type Feedback = {
  red: number
  yellow: number
}

export type Guess = {
  symbols: GameSymbol[]
  feedback: Feedback
}

export const CODE_LENGTH = 4
export const MAX_ATTEMPTS = 6
export const TIMER_SECONDS = 90

export function randomSecret(): GameSymbol[] {
  return Array.from({ length: CODE_LENGTH }, () => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)])
}

export function evaluateGuess(secret: GameSymbol[], guess: GameSymbol[]): Feedback {
  let red = 0
  const secretRest: GameSymbol[] = []
  const guessRest: GameSymbol[] = []

  secret.forEach((symbol, i) => {
    if (guess[i] === symbol) {
      red += 1
    } else {
      secretRest.push(symbol)
      guessRest.push(guess[i])
    }
  })

  let yellow = 0
  for (const symbol of guessRest) {
    const index = secretRest.indexOf(symbol)
    if (index !== -1) {
      yellow += 1
      secretRest.splice(index, 1)
    }
  }

  return { red, yellow }
}
