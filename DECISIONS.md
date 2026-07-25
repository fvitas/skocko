# Skočko — Decision Log

React implementation of Skočko (the Mastermind-style game from RTS TV Slagalica), mobile-first, deployed to Vercel. Reference: https://skocko-game-2023.netlify.app/

## Game rules (authentic TV Slagalica)

- 6 symbols: skočko (mascot), club, spade, heart, diamond, star
- Hidden combination of 4 symbols, **repeats allowed**
- 6 attempts to guess it
- Feedback per guess: red peg = right symbol on the right position, yellow peg = right symbol on the wrong position; pegs are sorted (reds first) and don't map to positions
- Scoring per [Wikipedia](https://sr.wikipedia.org/sr-el/%D0%A2%D0%92_%D1%81%D0%BB%D0%B0%D0%B3%D0%B0%D0%BB%D0%B8%D1%86%D0%B0): solved in attempt 1–2 → **20 pts**, 3–4 → **15 pts**, 5–6 → **10 pts**

## Product decisions

| Decision | Choice | Notes |
| --- | --- | --- |
| Timer | 90s per game, **off by default**, toggle in settings | Vertical bar on the LEFT of the board, drains top→bottom (TV-style); height matches the 6 rows exactly; timeout ends the round |
| Session model | One round at a time | No cumulative score, no stats; only settings persist (localStorage `skocko-settings`) |
| Points display | **Removed entirely** | Win shows only mascot + "SKOČKO!"; `scoreForAttempt`, its test, the `points` i18n key and the scoring rules line deleted. The TV 20/15/10 rule stays documented here if ever needed again |
| Language | Serbian latin + English, toggle in settings | SR default |
| Round end | **Inline, not modal** | Solution appears as a gold-bordered 7th row on the board with "REŠENJE" label; bottom panel (divider line + NOVA IGRA; win adds mascot + "SKOČKO!" + points). No "time is up" / lose titles |
| No layout shift on reveal | Solution slot is always reserved (invisible placeholder row, outside the timer-bar stretch container); ResultPanel overlays an invisibly-kept SymbolTray so bottom height never changes | Verified 0px jump with Playwright, timer on & off |
| Feedback pegs | Single horizontal row (not 2×2), 28px | Empty and filled pegs identical size/housing; no glow that inflates filled ones |
| Cell indicator | None | No pulsing dot in the next empty slot; active row is marked by gold border only |
| Clear button | Icon + text ("⌫ OBRIŠI" / "CLEAR"), ~42% of the action row | Grew from 56px → 96px → 128px → text button across iterations |
| Background | Static | Drift animation removed on request; studio streaks + vignette stay |
| Big screens | Full-bleed background, game column centered (max-w-md) | Settings: centered modal on desktop, bottom sheet on mobile |

## Design

- Direction: **"Studio"** — TV-inspired modernized (chosen from 3 mockups: Studio / Retro Broadcast / Midnight Stage; see `mockups/`)
- Deep royal-blue radial gradient + diagonal light streaks + bottom vignette/stage glow
- Fonts: **Baloo 2** (display), **Nunito Sans** (body) — picked from 8-variant pairing mockup (`mockups/fonts.html`; incl. single-family options), replacing Fredoka + Nunito. Baloo-2-only was considered viable but the pair keeps small text crisper
- Font loading: Google Fonts kept (preconnect to both origins), weights trimmed to the audited minimum — **Baloo 2 600/700 + Nunito Sans 400/500/700**. Weight roles: 700 titles/subtitle/REŠENJE/settings headings, 600 game buttons, 500 settings labels + SR/EN toggle, 400 rules/legend/hint. Bonus: only 3 files load on first paint (Baloo 600/700 + Nunito 700); Nunito 400/500 fetch lazily when settings opens
- Skočko mascot: generated full-body SVG (yellow head, purple round glasses, red nose, zigzag purple spring), replacing the initial hand-drawn face. Fine-tuned for small sizes: drop-shadow filter removed, strokes thickened, gradient IDs namespaced (`skocko-*`), viewBox tightened; glasses use flat bright-purple `#8e24aa` stroke — picked from 8-color mockup (`mockups/skocko-glasses.html`). **Face-only, no spring** everywhere incl. favicon — decided via side-by-side mockup (`mockups/skocko-spring.html`): the spring made the face unreadable at symbol sizes
- Suits: spade & club rendered dark/black with light outline (real card colors); heart/diamond red; star gold
- Settings surface styled shadcn-like (compact title + top-right X, justify-between rows, hairline separators); game buttons keep the custom gold game-show style
- Symbol icon set: after comparing 4 variants (`mockups/symbols.html` — hand-drawn / classic pips / chunky TV / lucide), **lucide won** with tweaks: club & spade at strokeWidth 1 (light outline on dark fill), heart/diamond/star fill-only with no stroke
- Caps/rounding variants were also explored (`mockups/symbols-caps.html` — sharp/soft/plump corners, outline widths, TV solid-white) and **the current set was kept as-is**

## Tech

| Decision | Choice |
| --- | --- |
| Stack | Vite + React 19 + TypeScript (strict) + Tailwind 4, frontend-only (no backend) |
| Package manager | pnpm; **all dependencies pinned exact** (no `^`) |
| UI libs | lucide-react (UI icons: Settings, Delete, X), Radix (`react-dialog`, `react-switch`, `react-toggle-group`) for the settings modal/sheet |
| Tests | Vitest — game logic only (`src/game/logic.test.ts`), incl. Mastermind duplicate-counting edge cases |
| DX | `code-inspector-plugin` (alt+hover → click jumps to source in WebStorm), gated to `mode === 'development'` — vitest runs with mode `test`, and the plugin's terminal runtime hangs the test process on exit if included |
| Target | Mobile Chrome first (390×844), works on desktop |
| Deploy | Vercel CLI direct (`pnpm dlx vercel`), **never deploy without Filip present** |

## Verification practice

Every UI change is verified by driving the real app with Playwright at mobile viewport (seeded `Math.random` for deterministic secrets, `page.clock` for timer/timeout), plus `pnpm test` and `pnpm build`.

When creating a mockup, immediately open it in the browser (`open <url>`) so Filip can review it live — don't just screenshot it.
