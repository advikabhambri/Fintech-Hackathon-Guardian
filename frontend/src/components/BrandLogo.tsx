type BrandLogoProps = {
  className?: string
}

export default function BrandLogo({ className = 'w-10 h-10' }: BrandLogoProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} role="img" aria-label="Guardian logo">
      <defs>
        <linearGradient id="walletGlow" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4FA8FF" />
          <stop offset="100%" stopColor="#1E90FF" />
        </linearGradient>
        <linearGradient id="handsGlow" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#D7EBFF" />
          <stop offset="100%" stopColor="#87C3FF" />
        </linearGradient>
      </defs>

      <rect x="18" y="17" width="28" height="20" rx="6" fill="url(#walletGlow)" />
      <rect x="37" y="22" width="8" height="10" rx="3" fill="#00356B" opacity="0.55" />
      <circle cx="40.5" cy="27" r="1.2" fill="#D7EBFF" />

      <path
        d="M9 33c0-7 5.4-12.2 12.1-12.2h2.1c3.3 0 5.6 2.7 5.6 5.9 0 3.2-2.4 5.8-5.6 5.8h-3.8c-2.2 0-4 1.8-4 4s1.8 4 4 4h17.7c2.3 0 4.1 1.8 4.1 4.1 0 2.3-1.8 4.1-4.1 4.1H22.6C15.1 48.7 9 42.5 9 35v-2z"
        fill="url(#handsGlow)"
        opacity="0.95"
      />
      <path
        d="M55 33c0-7-5.4-12.2-12.1-12.2h-2.1c-3.3 0-5.6 2.7-5.6 5.9 0 3.2 2.4 5.8 5.6 5.8h3.8c2.2 0 4 1.8 4 4s-1.8 4-4 4H26.9c-2.3 0-4.1 1.8-4.1 4.1 0 2.3 1.8 4.1 4.1 4.1h14.5c7.5 0 13.6-6.2 13.6-13.7v-2z"
        fill="url(#handsGlow)"
        opacity="0.95"
      />
    </svg>
  )
}