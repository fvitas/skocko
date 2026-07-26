// android chrome only — ios safari has no vibration api, so this is a silent no-op there
export function vibrate(ms = 10) {
  navigator.vibrate?.(ms)
}

const IS_IPHONE = /iPhone|iPod/.test(navigator.userAgent)

// ios can't vibrate from js, but a real tap on a native `<input type="checkbox" switch>`
// (safari 17.4+) fires a haptic tick. an invisible switch overlaid inside each button
// catches the tap, clicks, and lets the event bubble to the button underneath.
// programmatic switch.click() haptics were patched in ios 26.5 — only real taps work.
function overlaySwitch(button: HTMLButtonElement) {
  if (button.querySelector('[data-haptic]')) return
  const el = document.createElement('input')
  el.type = 'checkbox'
  el.setAttribute('switch', '')
  el.setAttribute('data-haptic', '')
  el.setAttribute('aria-hidden', 'true')
  el.tabIndex = -1
  Object.assign(el.style, {
    position: 'absolute',
    inset: '0',
    width: '100%',
    height: '100%',
    margin: '0',
    opacity: '0',
    touchAction: 'manipulation',
  })
  if (getComputedStyle(button).position === 'static') button.style.position = 'relative'
  button.append(el)
}

export function installIphoneHaptics(): (() => void) | undefined {
  if (!IS_IPHONE) return
  const apply = () => document.querySelectorAll('button').forEach(overlaySwitch)
  apply()
  // portals (settings drawer, share modal) mount buttons later
  const observer = new MutationObserver(apply)
  observer.observe(document.body, { childList: true, subtree: true })
  return () => observer.disconnect()
}
