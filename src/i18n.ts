import type { GameSymbol } from './game/logic'

export type Lang = 'sr' | 'en'

export type Strings = {
  symbolNames: Record<GameSymbol, string>
  subtitle: string
  confirm: string
  clear: string
  clearShort: string
  newGame: string
  share: string
  shareTitle: string
  shareDownload: string
  sharePost: string
  shareWon: string
  shareLost: string
  winTitle: string
  loseTitle: string
  timeoutTitle: string
  solution: string
  settings: string
  timer: string
  timerHint: string
  language: string
  rulesTitle: string
  rules: string[]
  rulesSymbols: string
  rulesFeedback: string
  rulesGotchas: string
  gotchasIntro: string
  gotchaSorted: string
  gotchaOnce: string
  guessLabel: string
  legendRed: string
  legendYellow: string
  close: string
}

export const STRINGS: Record<Lang, Strings> = {
  sr: {
    symbolNames: { skocko: 'Skočko', club: 'Tref', spade: 'Pik', heart: 'Srce', diamond: 'Karo', star: 'Zvezda' },
    subtitle: 'Pogodi kombinaciju od 4 znaka',
    confirm: 'POTVRDI',
    clear: 'Obriši poslednji znak',
    clearShort: 'OBRIŠI',
    newGame: 'NOVA IGRA',
    share: 'PODELI',
    shareTitle: 'Podeli',
    shareDownload: 'PREUZMI',
    sharePost: 'OBJAVI',
    shareWon: 'Rešio sam ga! 🎯',
    shareLost: 'Nisam mogao da ga rešim…',
    winTitle: 'SKOČKO!',
    loseTitle: 'VIŠE SREĆE DRUGI PUT',
    timeoutTitle: 'VREME JE ISTEKLO',
    solution: 'Rešenje',
    settings: 'Podešavanja',
    timer: 'Tajmer',
    timerHint: 'Ograničeno vreme po igri',
    language: 'Jezik',
    rulesTitle: 'Pravila',
    rules: [
      'Računar zadaje skrivenu kombinaciju od 4 znaka — znakovi mogu da se ponavljaju, a redosled je bitan.',
      'Imaš 6 pokušaja da je pogodiš.',
    ],
    rulesSymbols: 'Znakovi',
    rulesFeedback: 'Kružići',
    rulesGotchas: 'Dobro je znati',
    gotchasIntro: 'Kružići ti kažu samo koliko je pogodaka — ne i koji su.',
    gotchaSorted: 'Kružići su sortirani — prvo crveni. Njihov redosled ne otkriva koja su mesta pogođena.',
    gotchaOnce: 'Svaki znak iz kombinacije računa se samo jednom, čak i ako ga pogodiš više puta.',
    guessLabel: 'Pokušaj',
    legendRed: 'pogođen znak na pravom mestu',
    legendYellow: 'pogođen znak, pogrešno mesto',
    close: 'Zatvori',
  },
  en: {
    symbolNames: { skocko: 'Skocko', club: 'Club', spade: 'Spade', heart: 'Heart', diamond: 'Diamond', star: 'Star' },
    subtitle: 'Guess the combination of 4 symbols',
    confirm: 'CHECK',
    clear: 'Undo last symbol',
    clearShort: 'UNDO',
    newGame: 'NEW GAME',
    share: 'SHARE',
    shareTitle: 'Share',
    shareDownload: 'DOWNLOAD',
    sharePost: 'POST',
    shareWon: 'I solved it! 🎯',
    shareLost: "I couldn't solve it this time…",
    winTitle: 'SKOČKO!',
    loseTitle: 'BETTER LUCK NEXT TIME',
    timeoutTitle: "TIME'S UP",
    solution: 'Solution',
    settings: 'Settings',
    timer: 'Timer',
    timerHint: 'Limited time per game',
    language: 'Language',
    rulesTitle: 'How to play',
    rules: [
      'The computer sets a hidden combination of 4 symbols — repeats are allowed and order matters.',
      'You have 6 attempts to crack it.',
    ],
    rulesSymbols: 'Symbols',
    rulesFeedback: 'Pegs',
    rulesGotchas: 'Good to know',
    gotchasIntro: 'Pegs only tell you how many symbols you got — not which ones.',
    gotchaSorted: "Pegs are sorted — reds first. Their order doesn't reveal which positions matched.",
    gotchaOnce: 'Each symbol in the combination counts only once, even if you guess it multiple times.',
    guessLabel: 'Guess',
    legendRed: 'right symbol, right position',
    legendYellow: 'right symbol, wrong position',
    close: 'Close',
  },
}
