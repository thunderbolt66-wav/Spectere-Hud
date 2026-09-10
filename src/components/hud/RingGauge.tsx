interface Props {
  value: number;
  className?: string;
  thick?: number;
  fontSize?: number;
  sublabel?: string;
}

export function RingGauge({ value, className = '', thick = 6, fontSize = 16, sublabel }: Props) {
  const r = 38;
  const c = 2 * Math.PI * r;
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg viewBox="-50 -50 100 100" className="w-full h-full text-hud hud-glow-sm">
        <circle r={r} fill="none" stroke="currentColor" strokeOpacity={0.15} strokeWidth={thick} />
        <circle
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth={thick}
          strokeDasharray={`${(c * v) / 100} ${c}`}
          transform="rotate(-90)"
          style={{ transition: 'stroke-dasharray 0.4s ease' }}
        />
        <g className="spin-rev" style={{ animationDuration: '18s' }}>
          <circle r={r - thick - 3} fill="none" stroke="currentColor" strokeOpacity={0.5} strokeWidth={1} strokeDasharray="3 5" />
        </g>
        <circle r={r + 6} fill="none" stroke="currentColor" strokeOpacity={0.35} strokeWidth={0.75} />
        <g className="spin" style={{ animationDuration: '30s' }}>
          <path d="M 0 -49 L 3 -44 L -3 -44 Z" fill="currentColor" />
          <path d="M 0 49 L 3 44 L -3 44 Z" fill="currentColor" fillOpacity={0.5} />
        </g>
        <text
          textAnchor="middle"
          dominantBaseline="central"
          y={sublabel ? -3 : 0}
          fontSize={fontSize}
          fill="currentColor"
          className="font-display"
          fontWeight={600}
        >
          {Math.round(v)}%
        </text>
        {sublabel && (
          <text textAnchor="middle" y={11} fontSize={6} fill="currentColor" fillOpacity={0.7} className="font-display" letterSpacing={1.5}>
            {sublabel}
          </text>
        )}
      </svg>
    </div>
  );
}
