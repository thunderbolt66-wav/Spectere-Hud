interface Props {
  data: number[];
}

export function Waveform({ data }: Props) {
  const w = 200;
  const h = 60;
  const pts = data.map((v, i) => `${((i / (data.length - 1)) * w).toFixed(1)},${(h / 2 - v * 22 + 5).toFixed(1)}`).join(' ');
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="w-full h-full text-hud">
      {[0.25, 0.5, 0.75].map((f) => (
        <line key={f} x1={0} x2={w} y1={h * f} y2={h * f} stroke="currentColor" strokeOpacity={0.12} strokeWidth={0.5} vectorEffect="non-scaling-stroke" />
      ))}
      {Array.from({ length: 11 }, (_, i) => (
        <line key={i} x1={(i * w) / 10} x2={(i * w) / 10} y1={0} y2={h} stroke="currentColor" strokeOpacity={0.12} strokeWidth={0.5} vectorEffect="non-scaling-stroke" />
      ))}
      <polyline points={pts} fill="none" stroke="currentColor" strokeOpacity={0.25} strokeWidth={4} vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
      <polyline points={pts} fill="none" stroke="currentColor" strokeWidth={1.4} vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
    </svg>
  );
}
