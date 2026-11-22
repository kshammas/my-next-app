export function Logo({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 300 380"
      className={className}
      fill="none"
      aria-label="Rendezvous 26 logo"
      role="img"
    >
      <g strokeLinejoin="round" strokeWidth="14" fill="#18BB46" stroke="#18BB46">
        <path d="M133 10 L128 194 L16 148 L10 84 Z" />
        <path d="M154 46 L250 88 L158 166 Z" />
        <path d="M288 108 L290 224 L166 300 L160 208 Z" fill="#16A83E" stroke="#16A83E" />
        <path d="M289 261 L290 348 L168 338 Z" />
        <path d="M10 168 L118 230 L115 296 L11 366 Z" fill="#16A83E" stroke="#16A83E" />
      </g>
    </svg>
  );
}
