import type { Target } from '../../hooks/useTelemetry';
import { polar, sectorPath } from '../../lib/svg';

interface Props {
  targets: Target[];
  scanning: boolean;
  locked: boolean;
}

export function Radar({ targets, scanning, locked }: Props) {
  return (
    <svg viewBox="-50 -50 100 100" className="w-full h-full text-hud">
      <defs>
        <linearGradient id="sweep" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" style={{ stopColor: 'var(--color-hud)' }} stopOpacity="0" />
          <stop offset="100%" style={{ stopColor: 'var(--color-hud)' }} stopOpacity="0.55" />
        </linearGradient>
      </defs>
      {[15, 30, 45].map((r) => (
        <circle
          key={r}
          r={r}
          fill="none"
          stroke="currentColor"
          strokeOpacity={r === 45 ? 0.8 : 0.3}
          strokeWidth={r === 45 ? 1 : 0.5}
          strokeDasharray={r === 30 ? '2 2' : undefined}
        />
      ))}
      <line x1={-45} y1={0} x2={45} y2={0} stroke="currentColor" strokeOpacity={0.3} strokeWidth={0.5} />
      <line x1={0} y1={-45} x2={0} y2={45} stroke="currentColor" strokeOpacity={0.3} strokeWidth={0.5} />
      <line x1={-32} y1={-32} x2={32} y2={32} stroke="currentColor" strokeOpacity={0.15} strokeWidth={0.5} />
      <line x1={-32} y1={32} x2={32} y2={-32} stroke="currentColor" strokeOpacity={0.15} strokeWidth={0.5} />
      {Array.from({ length: 36 }, (_, i) => (
        <line key={i} x1={0} y1={-45} x2={0} y2={i % 9 === 0 ? -41 : -43} stroke="currentColor" strokeWidth={0.6} transform={`rotate(${i * 10})`} />
      ))}
      <g className="spin" style={{ animationDuration: scanning ? '0.9s' : '3.2s' }}>
        <path d={sectorPath(45, 300, 360)} fill="url(#sweep)" />
        <line x1={0} y1={0} x2={0} y2={-45} stroke="currentColor" strokeWidth={1} />
      </g>
      {targets.map((t, i) => {
        const [x, y] = polar(t.d, t.a);
        const primary = locked && i === 0;
        return (
          <g key={t.id}>
            <circle cx={x} cy={y} r={primary ? 2.4 : 1.7} fill={primary ? '#fff' : 'currentColor'} className="blink" style={{ animationDelay: `${t.v}s` }} />
            <circle cx={x} cy={y} r={primary ? 6 : 4} fill="none" stroke="currentColor" strokeOpacity={primary ? 0.9 : 0.5} strokeWidth={primary ? 0.9 : 0.5} />
            {primary && (
              <g stroke="currentColor" strokeWidth={0.8} fill="none">
                <path d={`M ${x - 8} ${y - 5} V ${y - 8} H ${x - 5}`} />
                <path d={`M ${x + 5} ${y - 8} H ${x + 8} V ${y - 5}`} />
                <path d={`M ${x + 8} ${y + 5} V ${y + 8} H ${x + 5}`} />
                <path d={`M ${x - 5} ${y + 8} H ${x - 8} V ${y + 5}`} />
              </g>
            )}
          </g>
        );
      })}
      <circle r={1.5} fill="#fff" />
    </svg>
  );
}
