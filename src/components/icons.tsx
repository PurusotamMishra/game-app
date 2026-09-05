interface IconProps {
  size?: number
}

export function SudokuIcon({ size = 48 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      role="presentation"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="44" height="44" rx="4" stroke="var(--accent)" strokeWidth="2" />
      <line x1="17" y1="2" x2="17" y2="46" stroke="var(--accent)" strokeWidth="2" />
      <line x1="31" y1="2" x2="31" y2="46" stroke="var(--accent)" strokeWidth="2" />
      <line x1="2" y1="17" x2="46" y2="17" stroke="var(--accent)" strokeWidth="2" />
      <line x1="2" y1="31" x2="46" y2="31" stroke="var(--accent)" strokeWidth="2" />
      <text x="24" y="13" textAnchor="middle" fontSize="9" fill="var(--accent)" fontFamily="var(--mono)">5</text>
      <text x="38" y="27" textAnchor="middle" fontSize="9" fill="var(--accent)" fontFamily="var(--mono)">9</text>
      <text x="10" y="41" textAnchor="middle" fontSize="9" fill="var(--accent)" fontFamily="var(--mono)">2</text>
    </svg>
  )
}

export function TicTacToeIcon({ size = 48 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      role="presentation"
      aria-hidden="true"
    >
      <line x1="17" y1="4" x2="17" y2="44" stroke="var(--accent)" strokeWidth="2" />
      <line x1="31" y1="4" x2="31" y2="44" stroke="var(--accent)" strokeWidth="2" />
      <line x1="4" y1="17" x2="44" y2="17" stroke="var(--accent)" strokeWidth="2" />
      <line x1="4" y1="31" x2="44" y2="31" stroke="var(--accent)" strokeWidth="2" />
      <path d="M7 7 L14 14 M14 7 L7 14" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" />
      <circle cx="24" cy="24" r="4" stroke="var(--accent)" strokeWidth="2" />
      <path d="M34 34 L41 41 M41 34 L34 41" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}
