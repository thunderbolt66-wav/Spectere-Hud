import { arcPath } from '../../lib/svg';

interface Props {
  value: number;
  label: string;
  locked: boolean;
  scanning: boolean;
}

const TICKS = Array.from({ length: 90 }, (_, i) => i);
const SEGMENTS = Array.from({ length: 8 }, (_, i) => i);

export function CoreReticle({ value, label, locked, scanning }: Props) {
  return (
    <svg viewBox="-210 -210 420 420" className="h-full w-full text-hud">
      <defs>
        <radialGradient id="core-glow">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
          <stop offset="30%" style={{ stopColor: 'var(--color-hud-bright)' }} stopOpacity="0.9" />
          <stop offset="70%" style={{ stopColor: 'var(--color-hud)' }} stopOpacity="0.25" />
          <stop offset="100%" style={{ stopColor: 'var(--color-hud)' }} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="core-halo">
          <stop offset="55%" style={{ stopColor: 'var(--color-hud)' }} stopOpacity="0" />
          <stop offset="100%" style={{ stopColor: 'var(--color-hud)' }} stopOpacity="0.14" />
        </radialGradient>
      </defs>

      <circle r={205} fill="url(#core-halo)" />

      {/* crosshair */}
      <g stroke="currentColor" strokeOpacity={0.55} strokeWidth={1}>
        <line x1={-210} y1={0} x2={-152} y2={0} />
        <line x1={152} y1={0} x2={210} y2={0} />
        <line x1={0} y1={-210} x2={0} y2={-152} />
        <line x1={0} y1={152} x2={0} y2={210} />
        <line x1={-190} y1={-6} x2={-190} y2={6} />
        <line x1={190} y1={-6} x2={190} y2={6} />
        <line x1={-6} y1={-190} x2={6} y2={-190} />
        <line x1={-6} y1={190} x2={6} y2={190} />
      </g>

      {/* outer dashed ring with floating petals */}
      <g className="spin" style={{ animationDuration: locked ? '12s' : '70s' }}>
        <circle r={198} fill="none" stroke="currentColor" strokeOpacity={0.35} strokeWidth={1} strokeDasharray="3 6" />
        {[45, 135, 225, 315].map((a) => (
          <g key={a} transform={`rotate(${a})`}>
            <path d="M -18 -200 L 18 -200 L 12 -180 L -12 -180 Z" fill="currentColor" fillOpacity={0.35} stroke="currentColor" strokeWidth={1} />
          </g>
        ))}
      </g>

      {/* segmented ring */}
      <g className="spin-rev" style={{ animationDuration: '45s' }}>
        {SEGMENTS.map((i) => (
          <path key={i} d={arcPath(182, i * 45 + 4, i * 45 + 32)} fill="none" stroke="currentColor" strokeWidth={5} strokeOpacity={0.7} />
        ))}
      </g>

      {/* tick ring */}
      <g stroke="currentColor">
        {TICKS.map((i) => {
          const long = i % 10 === 0;
          return (
            <line
              key={i}
              x1={0}
              y1={-170}
              x2={0}
              y2={long ? -159 : -165}
              strokeWidth={long ? 2 : 1}
              strokeOpacity={long ? 0.9 : 0.45}
              transform={`rotate(${i * 4})`}
            />
          );
        })}
      </g>
      <circle r={155} fill="none" stroke="currentColor" strokeOpacity={0.6} strokeWidth={0.75} />

      {/* thick arcs */}
      <g className="spin" style={{ animationDuration: '24s' }}>
        {[0, 120, 240].map((a) => (
          <path key={a} d={arcPath(142, a, a + 70)} fill="none" stroke="currentColor" strokeWidth={9} strokeOpacity={0.55} />
        ))}
        {[75, 195, 315].map((a) => (
          <path key={a} d={arcPath(142, a, a + 25)} fill="none" stroke="currentColor" strokeWidth={9} strokeOpacity={0.18} />
        ))}
      </g>

      <g className="spin-rev" style={{ animationDuration: '16s' }}>
        <circle r={126} fill="none" stroke="currentColor" strokeWidth={1.5} strokeDasharray="1 5" strokeOpacity={0.8} />
        <circle r={116} fill="none" stroke="currentColor" strokeWidth={14} strokeDasharray="70 22" strokeOpacity={0.16} />
      </g>

      <circle r={106} fill="none" stroke="currentColor" strokeOpacity={0.5} strokeWidth={0.75} />

      <g className="spin" style={{ animationDuration: '10s' }}>
        {[0, 90, 180, 270].map((a) => (
          <path key={a} d={arcPath(96, a + 10, a + 60)} fill="none" stroke="currentColor" strokeWidth={3} />
        ))}
        {[0, 90, 180, 270].map((a) => (
          <path key={`b${a}`} d={arcPath(88, a + 58, a + 85)} fill="none" stroke="currentColor" strokeWidth={1.5} strokeOpacity={0.6} />
        ))}
      </g>

      <g className="spin-rev" style={{ animationDuration: '7s' }}>
        <circle r={76} fill="none" stroke="currentColor" strokeWidth={6} strokeDasharray="12 6" strokeOpacity={0.45} />
      </g>

      {/* core */}
      <circle r={66} fill="url(#core-glow)" className="core-pulse" />
      <circle r={58} fill="none" stroke="currentColor" strokeWidth={1} strokeOpacity={0.9} />
      <g className="spin" style={{ animationDuration: '5s' }}>
        <path d={arcPath(50, 0, 100)} fill="none" stroke="#fff" strokeOpacity={0.8} strokeWidth={2} />
        <path d={arcPath(50, 180, 280)} fill="none" stroke="#fff" strokeOpacity={0.8} strokeWidth={2} />
      </g>
      <circle r={30} fill="none" stroke="#fff" strokeOpacity={0.5} strokeWidth={1} />
      <circle r={20} fill="#fff" fillOpacity={0.95} className="core-pulse" />

      {/* readout inside core ring */}
      <text y={44} textAnchor="middle" fontSize={8} fill="currentColor" className="font-display" letterSpacing={2}>
        {label}
      </text>
      <text y={-38} textAnchor="middle" fontSize={9} fill="currentColor" className="font-display" fontWeight={700} letterSpacing={1}>
        {value.toFixed(1)}%
      </text>

      {/* scanning ripples */}
      {scanning &&
        [0, 0.75, 1.5].map((d) => (
          <circle key={d} r={60} fill="none" stroke="currentColor" strokeWidth={2} className="ripple" style={{ animationDelay: `${d}s` }} />
        ))}

      {/* lock brackets */}
      {locked && (
        <g stroke="currentColor" strokeWidth={3} fill="none" className="lock-in hud-glow">
          <path d="M -150 -120 V -150 H -120" />
          <path d="M 120 -150 H 150 V -120" />
          <path d="M 150 120 V 150 H 120" />
          <path d="M -120 150 H -150 V 120" />
        </g>
      )}
    </svg>
  );
}
