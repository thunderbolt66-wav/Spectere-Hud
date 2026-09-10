interface Props {
  values: number[];
}

export function Equalizer({ values }: Props) {
  const n = values.length;
  const H = 40;
  return (
    <div className="relative w-full h-full">
      <svg viewBox={`0 0 ${n * 4} ${H}`} preserveAspectRatio="none" className="w-full h-full text-hud">
        {values.map((v, i) => (
          <rect
            key={i}
            x={i * 4 + 0.5}
            width={3}
            y={H - (v / 100) * H}
            height={(v / 100) * H}
            fill="currentColor"
            fillOpacity={0.35 + v / 180}
            style={{ transition: 'y 0.12s linear, height 0.12s linear' }}
          />
        ))}
        <line x1={0} x2={n * 4} y1={H} y2={H} stroke="currentColor" strokeWidth={1} vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="seg-mask absolute inset-0 pointer-events-none" />
    </div>
  );
}
