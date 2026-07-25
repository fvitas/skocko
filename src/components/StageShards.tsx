// Slagalica-intro style faceted slabs with LED edge strips, kept subtle behind the board
export function StageShards() {
  return (
    <svg
      viewBox="0 0 390 620"
      preserveAspectRatio="xMidYMid slice"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.15] mask-[radial-gradient(50%_50%_at_50%_40%,transparent_50%,black_100%)]"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="stage-light" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#9dc0ff" />
          <stop offset="55%" stopColor="#5e92ff" />
          <stop offset="100%" stopColor="#3b6ae0" />
        </linearGradient>
        <linearGradient id="stage-mid" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#6d9cff" />
          <stop offset="55%" stopColor="#3b6ae0" />
          <stop offset="100%" stopColor="#1e44c0" />
        </linearGradient>
        <linearGradient id="stage-deep" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3f6ee8" />
          <stop offset="100%" stopColor="#142e9a" />
        </linearGradient>
        <linearGradient id="stage-dark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2a52d0" />
          <stop offset="100%" stopColor="#0e2178" />
        </linearGradient>
        <linearGradient id="stage-ext" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0a1750" />
          <stop offset="100%" stopColor="#040a28" />
        </linearGradient>
        <filter id="stage-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="1.6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* whole composition scaled up so facets stay large on small screens */}
      <g transform="translate(195 310) scale(1.3) translate(-195 -310)">
      <polygon points="102,94 -38,124 -28,142 112,112" fill="url(#stage-ext)" />
      <polygon points="-28,-20 152,-42 102,94 -38,124" fill="url(#stage-mid)" />
      <polygon points="242,192 92,122 104,140 254,210" fill="url(#stage-ext)" />
      <polygon points="122,-12 302,38 242,192 92,122" fill="url(#stage-light)" />
      <polygon points="312,-32 432,-12 422,152 332,92" fill="url(#stage-deep)" />
      <polygon points="332,92 422,152 434,168 344,108" fill="url(#stage-ext)" />
      <polygon points="282,162 422,222 332,332" fill="url(#stage-mid)" />
      <polygon points="-42,152 112,132 72,302 -52,332" fill="url(#stage-deep)" />
      <polygon points="72,302 -52,332 -44,348 80,318" fill="url(#stage-ext)" />
      <polygon points="332,382 162,422 172,440 342,400" fill="url(#stage-ext)" />
      <polygon points="122,262 292,222 332,382 162,422" fill="url(#stage-dark)" />
      <polygon points="-32,382 142,342 102,522 -42,542" fill="url(#stage-mid)" />
      <polygon points="302,402 442,382 432,602 252,562" fill="url(#stage-deep)" />
      <polygon points="92,482 282,452 322,642 62,662" fill="url(#stage-dark)" />
      <polygon points="202,122 262,92 242,172" fill="url(#stage-light)" />
      <g stroke="#e8f2ff" fill="none" strokeLinecap="round" filter="url(#stage-glow)">
        <line x1="152" y1="-42" x2="102" y2="94" strokeWidth="2.5" opacity="0.9" strokeDasharray="9 6" />
        <line x1="122" y1="-12" x2="302" y2="38" strokeWidth="2.5" opacity="0.95" />
        <line x1="302" y1="38" x2="242" y2="192" strokeWidth="2" opacity="0.6" />
        <line x1="282" y1="162" x2="422" y2="222" strokeWidth="2.5" opacity="0.85" strokeDasharray="9 6" />
        <line x1="112" y1="132" x2="72" y2="302" strokeWidth="2" opacity="0.5" />
        <line x1="122" y1="262" x2="292" y2="222" strokeWidth="2.5" opacity="0.8" />
        <line x1="-32" y1="382" x2="142" y2="342" strokeWidth="2.5" opacity="0.7" strokeDasharray="9 6" />
        <line x1="302" y1="402" x2="442" y2="382" strokeWidth="2" opacity="0.6" />
        <line x1="92" y1="482" x2="282" y2="452" strokeWidth="2.5" opacity="0.75" strokeDasharray="9 6" />
        <line x1="202" y1="122" x2="262" y2="92" strokeWidth="2" opacity="0.9" />
      </g>
      </g>
    </svg>
  )
}
