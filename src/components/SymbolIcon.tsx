import { Club, Diamond, Heart, Spade, Star } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { GameSymbol } from '../game/logic'

const SUIT_ICONS: Record<Exclude<GameSymbol, 'skocko'>, LucideIcon> = {
  spade: Spade,
  club: Club,
  heart: Heart,
  diamond: Diamond,
  star: Star,
}

const SUIT_STYLE: Record<Exclude<GameSymbol, 'skocko'>, { fill: string; stroke: string; strokeWidth: number }> = {
  spade: { fill: '#10141f', stroke: '#dbe4ff', strokeWidth: 1 },
  club: { fill: '#10141f', stroke: '#dbe4ff', strokeWidth: 1 },
  heart: { fill: '#ff4d64', stroke: 'none', strokeWidth: 0 },
  diamond: { fill: '#ff4d64', stroke: 'none', strokeWidth: 0 },
  star: { fill: '#ffc93c', stroke: 'none', strokeWidth: 0 },
}

type SymbolIconProps = {
  symbol: GameSymbol
  className?: string
}

export function SymbolIcon({ symbol, className }: SymbolIconProps) {
  if (symbol === 'skocko') {
    return (
      <svg viewBox="58 20 384 350" className={className} aria-hidden="true">
        <defs>
          <radialGradient id="skocko-head" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#ffde17" />
            <stop offset="85%" stopColor="#f2a900" />
            <stop offset="100%" stopColor="#d98200" />
          </radialGradient>
          <radialGradient id="skocko-nose" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#ff4d4d" />
            <stop offset="100%" stopColor="#b30000" />
          </radialGradient>
        </defs>
        <path d="M235 125C215 70 160 25 135 5" fill="none" stroke="#0d1b2a" strokeWidth="9" strokeLinecap="round" />
        <path d="M265 125C285 70 340 25 365 5" fill="none" stroke="#0d1b2a" strokeWidth="9" strokeLinecap="round" />
        <ellipse cx="250" cy="240" rx="145" ry="95" fill="url(#skocko-head)" stroke="#b77900" strokeWidth="4" />
        <path d="M150 115C165 80 210 75 225 110" fill="none" stroke="#003366" strokeWidth="8" strokeLinecap="round" />
        <path d="M350 115C335 80 290 75 275 110" fill="none" stroke="#003366" strokeWidth="8" strokeLinecap="round" />
        <ellipse cx="190" cy="165" rx="30" ry="45" fill="#fff" />
        <ellipse cx="310" cy="165" rx="30" ry="45" fill="#fff" />
        <ellipse cx="195" cy="170" rx="16" ry="28" fill="#0f172a" />
        <ellipse cx="305" cy="170" rx="16" ry="28" fill="#0f172a" />
        <circle cx="188" cy="158" r="5" fill="#fff" />
        <circle cx="298" cy="158" r="5" fill="#fff" />
        <circle cx="160" cy="170" r="90" fill="none" stroke="#8e24aa" strokeWidth="14" />
        <circle cx="340" cy="170" r="90" fill="none" stroke="#8e24aa" strokeWidth="14" />
        <ellipse cx="250" cy="225" rx="28" ry="20" fill="url(#skocko-nose)" />
        <path d="M220 270Q250 292 280 270" fill="none" stroke="#0f172a" strokeWidth="7" strokeLinecap="round" />
      </svg>
    )
  }

  const Icon = SUIT_ICONS[symbol]
  const { fill, stroke, strokeWidth } = SUIT_STYLE[symbol]
  return <Icon className={className} fill={fill} stroke={stroke} strokeWidth={strokeWidth} aria-hidden="true" />
}
