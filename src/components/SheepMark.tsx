type SheepMarkProps = {
  className?: string;
  size?: number;
};

/** Sheep with glasses + beer — Duolingo-energy mascot. */
export function SheepMark({ className = "", size = 48 }: SheepMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle cx="32" cy="34" r="22" fill="#F4F7F4" />
      <circle cx="18" cy="22" r="8" fill="#F4F7F4" />
      <circle cx="32" cy="16" r="9" fill="#F4F7F4" />
      <circle cx="46" cy="22" r="8" fill="#F4F7F4" />
      <circle cx="16" cy="36" r="7" fill="#F4F7F4" />
      <circle cx="48" cy="36" r="7" fill="#F4F7F4" />
      <ellipse cx="32" cy="38" rx="14" ry="12" fill="#2FD65A" />
      {/* glasses */}
      <rect
        x="18"
        y="30"
        width="12"
        height="10"
        rx="2"
        stroke="#0A0C0B"
        strokeWidth="2"
        fill="rgba(255,255,255,0.25)"
      />
      <rect
        x="34"
        y="30"
        width="12"
        height="10"
        rx="2"
        stroke="#0A0C0B"
        strokeWidth="2"
        fill="rgba(255,255,255,0.25)"
      />
      <path d="M30 35h4" stroke="#0A0C0B" strokeWidth="2" />
      <circle cx="24" cy="35" r="2.2" fill="#0A0C0B" />
      <circle cx="40" cy="35" r="2.2" fill="#0A0C0B" />
      <circle cx="24.8" cy="34.2" r="0.7" fill="#F4F7F4" />
      <circle cx="40.8" cy="34.2" r="0.7" fill="#F4F7F4" />
      {/* beer mug */}
      <rect x="44" y="42" width="10" height="12" rx="1.5" fill="#E8FF6A" stroke="#0A0C0B" strokeWidth="1.5" />
      <path d="M54 45h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-3" stroke="#0A0C0B" strokeWidth="1.5" fill="none" />
      <path d="M46 44c1-.8 2-.8 3 0s2 .8 3 0" stroke="#F4F7F4" strokeWidth="1.2" strokeLinecap="round" />
      <ellipse cx="32" cy="43" rx="3.2" ry="2.2" fill="#E8FF6A" />
      <path
        d="M27 47c1.8 2 8.2 2 10 0"
        stroke="#0A0C0B"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
