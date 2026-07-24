type SheepMarkProps = {
  className?: string;
  size?: number;
};

/** Minimal sheep face — reads at tiny sizes (app-icon friendly). */
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
      <circle cx="32" cy="34" r="22" fill="#FFFDF5" />
      <circle cx="18" cy="22" r="8" fill="#FFFDF5" />
      <circle cx="32" cy="16" r="9" fill="#FFFDF5" />
      <circle cx="46" cy="22" r="8" fill="#FFFDF5" />
      <circle cx="16" cy="36" r="7" fill="#FFFDF5" />
      <circle cx="48" cy="36" r="7" fill="#FFFDF5" />
      <ellipse cx="32" cy="38" rx="14" ry="12" fill="#1F8F3A" />
      <circle cx="26" cy="36" r="3.2" fill="#0C120D" />
      <circle cx="38" cy="36" r="3.2" fill="#0C120D" />
      <circle cx="27.2" cy="35" r="1" fill="#FFFDF5" />
      <circle cx="39.2" cy="35" r="1" fill="#FFFDF5" />
      <ellipse cx="32" cy="42" rx="3.5" ry="2.5" fill="#FFE14A" />
      <path
        d="M27 46c1.8 2.2 8.2 2.2 10 0"
        stroke="#0C120D"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
