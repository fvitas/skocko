export type Lang = 'sr' | 'en'

export type Strings = {
  subtitle: string
  confirm: string
  clear: string
  clearShort: string
  newGame: string
  winTitle: string
  solution: string
  settings: string
  timer: string
  timerHint: string
  language: string
  rulesTitle: string
  rules: string[]
  legendRed: string
  legendYellow: string
  close: string
}

export const STRINGS: Record<Lang, Strings> = {
  sr: {
    subtitle: 'Pogodi kombinaciju od 4 znaka',
    confirm: 'POTVRDI',
    clear: 'Obriši poslednji znak',
    clearShort: 'OBRIŠI',
    newGame: 'NOVA IGRA',
    winTitle: 'SKOČKO!',
    solution: 'Rešenje',
    settings: 'Podešavanja',
    timer: 'Tajmer',
    timerHint: '90 sekundi po igri, kao u emisiji',
    language: 'Jezik',
    rulesTitle: 'Pravila',
    rules: [
      'Računar zadaje skrivenu kombinaciju od 4 znaka — znakovi mogu da se ponavljaju.',
      'Imaš 6 pokušaja da je pogodiš.',
    ],
    legendRed: 'pogođen znak na pravom mestu',
    legendYellow: 'pogođen znak, pogrešno mesto',
    close: 'Zatvori',
  },
  en: {
    subtitle: 'Guess the combination of 4 symbols',
    confirm: 'CONFIRM',
    clear: 'Delete last symbol',
    clearShort: 'CLEAR',
    newGame: 'NEW GAME',
    winTitle: 'SKOČKO!',
    solution: 'Solution',
    settings: 'Settings',
    timer: 'Timer',
    timerHint: '90 seconds per game, like on the show',
    language: 'Language',
    rulesTitle: 'How to play',
    rules: [
      'The computer sets a hidden combination of 4 symbols — repeats are allowed.',
      'You have 6 attempts to crack it.',
    ],
    legendRed: 'right symbol, right position',
    legendYellow: 'right symbol, wrong position',
    close: 'Close',
  },
}
