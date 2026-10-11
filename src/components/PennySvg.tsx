/** Hand-drawn style curled-up Penny (white with ginger patches), used on the loader and 404 page. */
export function PennySvg({ className, awake = false }: { className?: string; awake?: boolean }) {
  return (
    <svg viewBox="0 0 220 140" className={className} role="img" aria-label="Penny the cat curled up asleep">
      <g stroke="#1d1b3a" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round">
        <g className="penny-breathe">
          {/* tail wrapping round */}
          <path d="M40 112 C 10 110, 12 70, 46 76" fill="none" stroke="#1d1b3a" strokeWidth="16" />
          <path d="M40 112 C 10 110, 12 70, 46 76" fill="none" stroke="#fffdf8" strokeWidth="9" />
          <path d="M22 100 C 14 92, 16 84, 24 80" fill="none" stroke="#f0a14a" strokeWidth="9" />
          {/* body */}
          <ellipse cx="110" cy="96" rx="78" ry="38" fill="#fffdf8" />
          {/* ginger patches */}
          <path d="M92 60 C 120 52, 150 62, 150 82 C 130 92, 104 86, 92 60 Z" fill="#f0a14a" stroke="none" />
          <path d="M120 96 C 140 92, 162 100, 160 118 C 140 124, 122 116, 120 96 Z" fill="#f0a14a" stroke="none" />
          <ellipse cx="110" cy="96" rx="78" ry="38" fill="none" />
        </g>
        {/* head */}
        <g transform="translate(160 78)">
          <path d="M-20 -16 L-26 -42 L-4 -26 Z" fill="#f0a14a" />
          <path d="M14 -24 L30 -44 L30 -14 Z" fill="#f0a14a" />
          <ellipse cx="4" cy="0" rx="34" ry="28" fill="#fffdf8" />
          <path d="M-26 -8 C -20 -30, 26 -32, 34 -6 C 18 -14, -10 -16, -26 -8 Z" fill="#f0a14a" />
          {awake ? (
            <>
              <circle cx="-8" cy="2" r="4.5" fill="#5a8f3a" />
              <circle cx="16" cy="2" r="4.5" fill="#5a8f3a" />
            </>
          ) : (
            <>
              <path d="M-14 2 Q -8 7, -2 2" fill="none" strokeWidth="3" />
              <path d="M10 2 Q 16 7, 22 2" fill="none" strokeWidth="3" />
            </>
          )}
          <path d="M3 12 L 7 12 L 5 15 Z" fill="#ff9fb5" strokeWidth="2" />
          <path d="M-30 12 L -46 10 M -30 17 L -46 20 M 36 12 L 52 10 M 36 17 L 52 20" strokeWidth="2" />
        </g>
        {/* front paws */}
        <ellipse cx="150" cy="122" rx="14" ry="8" fill="#fffdf8" />
        <ellipse cx="128" cy="126" rx="14" ry="8" fill="#fffdf8" />
      </g>
    </svg>
  )
}
