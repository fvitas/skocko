import { toCanvas } from 'html-to-image'

const CARD_WIDTH = 1_080
const PADDING = 64
const HEADER_HEIGHT = 168

// called right when the result renders, so let the reveal animations settle first
async function animationsSettled(board: HTMLElement) {
  const finished = board.getAnimations({ subtree: true }).map((animation) => animation.finished.catch(() => {}))
  await Promise.race([Promise.all(finished), new Promise((resolve) => setTimeout(resolve, 1_000))])
}

// capture is slow on phones — run it as soon as the game ends, not on tap,
// or navigator.share loses the tap's user activation and rejects
export async function captureBoardCard(board: HTMLElement): Promise<Blob> {
  await animationsSettled(board)
  await document.fonts.load('700 92px "Baloo 2"')
  // data-capturing lets css strip the glows that webkit smears in foreignObject captures
  board.setAttribute('data-capturing', '')
  let capture: HTMLCanvasElement
  try {
    capture = await toCanvas(board, { pixelRatio: 3 })
  } finally {
    board.removeAttribute('data-capturing')
  }

  const boardWidth = CARD_WIDTH - PADDING * 2
  const boardHeight = (capture.height / capture.width) * boardWidth
  const cardHeight = Math.round(HEADER_HEIGHT + boardHeight + PADDING)

  const canvas = document.createElement('canvas')
  canvas.width = CARD_WIDTH
  canvas.height = cardHeight
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('canvas 2d context unavailable')

  const stage = ctx.createRadialGradient(CARD_WIDTH / 2, -cardHeight * 0.1, 0, CARD_WIDTH / 2, -cardHeight * 0.1, cardHeight * 1.3)
  stage.addColorStop(0, '#1a47d6')
  stage.addColorStop(0.55, '#0e2a8f')
  stage.addColorStop(1, '#0a1b5e')
  ctx.fillStyle = stage
  ctx.fillRect(0, 0, CARD_WIDTH, cardHeight)

  const glow = ctx.createRadialGradient(CARD_WIDTH / 2, cardHeight, 0, CARD_WIDTH / 2, cardHeight, cardHeight * 0.55)
  glow.addColorStop(0, 'rgba(255, 201, 60, 0.12)')
  glow.addColorStop(1, 'rgba(255, 201, 60, 0)')
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, CARD_WIDTH, cardHeight)

  ctx.font = '700 92px "Baloo 2"'
  ctx.textBaseline = 'alphabetic'
  ctx.textAlign = 'center'
  ctx.fillStyle = '#ffc93c'
  ctx.shadowColor = 'rgba(0, 0, 0, 0.35)'
  ctx.shadowOffsetY = 5
  ctx.fillText('SKOČKO', CARD_WIDTH / 2, 116)
  ctx.shadowColor = 'transparent'
  ctx.shadowOffsetY = 0

  ctx.drawImage(capture, PADDING, HEADER_HEIGHT, boardWidth, boardHeight)

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('canvas toBlob failed'))), 'image/png')
  })
}

// twitter:// (no x:// exists) opens the app composer directly; if the app
// isn't installed nothing happens and the page stays visible, so fall back
function openXApp(message: string, fallback: string) {
  location.href = `twitter://post?message=${encodeURIComponent(message)}`
  setTimeout(() => {
    if (!document.hidden) location.href = fallback
  }, 1_500)
}

export function downloadBlob(blob: Blob, filename: string) {
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = filename
  link.click()
  URL.revokeObjectURL(link.href)
}

export function xIntentUrl(text: string, url: string) {
  return `https://x.com/intent/post?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
}

export type ShareOutcome = 'shared' | 'app' | 'modal'

// mobile: native share sheet posts the image straight into the X app; desktop:
// chess.com-style preview modal with download + composer buttons ('modal' tells
// the caller to open it — an intent url can't carry an image, that needs the X api)
export async function shareBoardImage(card: Blob | Promise<Blob>, text: string, url: string): Promise<ShareOutcome> {
  const touch = matchMedia('(hover: none) and (pointer: coarse)').matches
  const blob = await card
  const file = new File([blob], 'skocko.png', { type: 'image/png' })
  const shareData: ShareData = { files: [file], text, url }

  // desktop chrome/safari also pass canShare, but their os share sheets can't post to X
  if (touch && !!navigator.canShare && navigator.canShare(shareData)) {
    try {
      await navigator.share(shareData)
      return 'shared'
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return 'shared'
    }
  }

  if (touch) {
    // no share sheet (insecure context or share failed) — app composer, text only
    openXApp(`${text} ${url}`, xIntentUrl(text, url))
    return 'app'
  }

  return 'modal'
}
