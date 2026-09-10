import { sectorPath } from '../../lib/svg';

interface Props {
  values: [number, number, number];
}

const OPS = [0.9, 0.55, 0.28];

export function PieChart({ values }: Props) {
  let start = 0;
  const slices = values.map((v, i) => {
    const end = start + v * 360;
    const d = sectorPath(38, start + 1, Math.max(start + 1.5, end - 1));
    start = end;
    return { d, op: OPS[i] };
  });
  return (
    <svg viewBox="-50 -50 100 100" className="w-full h-full text-hud">
      <g className="spin" style={{ animationDuration: '40s' }}>
        <circle r={46} fill="none" stroke="currentColor" strokeOpacity={0.45} strokeWidth={0.75} strokeDasharray="2 3" />
      </g>
      {slices.map((s, i) => (
        <path key={i} d={s.d} fill="currentColor" fillOpacity={s.op} style={{ transition: 'd 0.3s' }} />
      ))}
      <circle r={14} style={{ fill: 'var(--color-hud-bg)' }} />
      <circle r={14} fill="none" stroke="currentColor" strokeOpacity={0.6} strokeWidth={0.75} />
      <circle r={3} fill="currentColor" className="core-pulse" />
    </svg>
  );
}
