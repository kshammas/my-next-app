export function Logo({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 300 380"
      className={className}
      fill="none"
      aria-label="Rendezvous 26 logo"
      role="img"
    >
      <defs>
        <linearGradient id="logoRight" x1="0" y1="0.6" x2="1" y2="0.3">
          <stop offset="0" stopColor="#00702f" />
          <stop offset="1" stopColor="#00b83c" />
        </linearGradient>
        <linearGradient id="logoLeft" x1="0" y1="1" x2="1" y2="0.2">
          <stop offset="0" stopColor="#007a33" />
          <stop offset="1" stopColor="#00b83c" />
        </linearGradient>
      </defs>
      <g strokeLinejoin="round" strokeWidth="14">
        <path d="M133 10 L128 194 L16 148 L10 84 Z" fill="#00c43a" stroke="#00c43a" />
        <path d="M154 46 L250 88 L158 166 Z" fill="#00c43a" stroke="#00c43a" />
        <path d="M288 108 L290 224 L166 300 L160 208 Z" fill="url(#logoRight)" stroke="url(#logoRight)" />
        <path d="M289 261 L290 348 L168 338 Z" fill="#00c43a" stroke="#00c43a" />
        <path d="M10 168 L118 230 L115 296 L11 366 Z" fill="url(#logoLeft)" stroke="url(#logoLeft)" />
      </g>
    </svg>
  );
}
