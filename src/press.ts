import type { MouseEvent, PointerEvent } from 'react'

type PressHandlers = {
  onPointerDown: (event: PointerEvent<HTMLButtonElement>) => void
  onClick: (event: MouseEvent<HTMLButtonElement>) => void
}

// Fires on pointerdown for instant taps; onClick only handles keyboard (detail 0), pointer clicks already fired
export function press(action: () => void): PressHandlers {
  return {
    onPointerDown: (event: PointerEvent<HTMLButtonElement>) => {
      if (event.button === 0) action()
    },
    onClick: (event: MouseEvent<HTMLButtonElement>) => {
      if (event.detail === 0) action()
    },
  }
}
