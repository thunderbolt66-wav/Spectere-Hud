import { useMemo } from 'react';
import { arcPath, polar, polygonPoints } from '../../lib/svg';

/** Hexagon filled with a dot matrix — activity map */
export function HexDots({ value }: { value: number }) {
  const dots = useMemo(() => {
    const arr: [number, number][] = [];
    for (let r = -4; r <= 4; r++) {
      for (let c = -4; c <= 4; c++) {
        const x = c * 8 + (r % 2 ? 4 : 0);
        const y = r * 7;
        if (Math.hypot(x, y) < 33) arr.push([x, y]);
      }
    }
    return arr;
  }, []);
  const active = Math.round((dots.length * value) / 100);
  return (
    <svg viewBox="-50 -50 100 100" className="w-full h-full text-hud">
      <polygon points={polygonPoints(47, 6, 30)} fill="none" stroke="currentColor" strokeWidth={1.2} />
      <g className="spin-rev" style={{ animationDuration: '26s' }}>
        <polygon points={polygonPoints(41, 6, 30)} fill="currentColor" fillOpacity={0.05} stroke="currentColor" strokeWidth={0.5} strokeOpacity={0.5} strokeDasharray="3 3" />
      </g>
      {dots.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={1.6} fill="currentColor" fillOpacity={i < active ? 0.9 : 0.15} style={{ transition: 'fill-opacity 0.3s' }} />
      ))}
    </svg>
  );
}

/** Heptagon frame with an upward arrow — thermal / vector indicator */
export function ShapeArrow({ value, label }: { value: number; label: string }) {
  return (
    <svg viewBox="-50 -50 100 100" className="w-full h-full text-hud">
      <polygon points={polygonPoints(46, 7)} fill="none" stroke="currentColor" strokeWidth={1.2} />
      <g className="spin-rev" style={{ animationDuration: '30s' }}>
        <polygon points={polygonPoints(40, 7)} fill="currentColor" fillOpacity={0.05} stroke="currentColor" strokeWidth={0.5} strokeDasharray="4 4" strokeOpacity={0.6} />
      </g>
      <g className="bob">
        <path d="M 0 -24 L 16 4 L 6 4 L 6 16 L -6 16 L -6 4 L -16 4 Z" fill="currentColor" fillOpacity={0.85} />
        <path d="M 0 -24 L 16 4 L 0 0 Z" fill="#fff" fillOpacity={0.45} />
      </g>
      <text y={34} textAnchor="middle" fontSize={9} fill="currentColor" className="font-display" fontWeight={700}>
        {Math.round(value)}%
      </text>
      <text y={-33} textAnchor="middle" fontSize={5} fill="currentColor" fillOpacity={0.7} className="font-display" letterSpacing={1.5}>
        {label}
      </text>
    </svg>
  );
}

/** Ring of dots with centered percentage */
export function DotRing({ value, dots = 24, speed = '14s' }: { value: number; dots?: number; speed?: string }) {
  return (
    <svg viewBox="-50 -50 100 100" className="w-full h-full text-hud">
      <g className="spin" style={{ animationDuration: speed }}>
        {Array.from({ length: dots }, (_, i) => {
          const [x, y] = polar(42, (i * 360) / dots);
          return <circle key={i} cx={x} cy={y} r={i % 6 === 0 ? 3 : 1.8} fill="currentColor" fillOpacity={i < (dots * value) / 100 ? 0.9 : 0.22} />;
        })}
      </g>
      <circle r={31} fill="none" stroke="currentColor" strokeWidth={0.75} strokeOpacity={0.6} />
      <text textAnchor="middle" dominantBaseline="central" fontSize={15} fill="currentColor" className="font-display" fontWeight={600}>
        {Math.round(value)}%
      </text>
    </svg>
  );
}

/** Small spinning target reticle */
export function MiniReticle() {
  return (
    <svg viewBox="-50 -50 100 100" className="w-full h-full text-hud">
      <g className="spin" style={{ animationDuration: '9s' }}>
        {[0, 120, 240].map((a) => (
          <path key={a} d={arcPath(44, a, a + 80)} fill="none" stroke="currentColor" strokeWidth={3} />
        ))}
      </g>
      <g className="spin-rev" style={{ animationDuration: '6s' }}>
        <circle r={34} fill="none" stroke="currentColor" strokeWidth={1} strokeDasharray="6 4" />
      </g>
      <circle r={24} fill="none" stroke="currentColor" strokeWidth={0.75} strokeOpacity={0.6} />
      <line x1={-50} x2={50} y1={0} y2={0} stroke="currentColor" strokeWidth={0.5} strokeOpacity={0.5} />
      <line x1={0} x2={0} y1={-50} y2={50} stroke="currentColor" strokeWidth={0.5} strokeOpacity={0.5} />
      <circle r={5} fill="currentColor" className="core-pulse" />
    </svg>
  );
}

/** Redacted-text style bar rows */
export function TextBlock({ rows = 7, tick }: { rows?: number; tick: number }) {
  const widths = useMemo(
    () => Array.from({ length: rows }, () => Array.from({ length: 3 + Math.floor(Math.random() * 3) }, () => 8 + Math.random() * 26)),
    [rows],
  );
  const active = Math.floor(tick / 5) % rows;
  return (
    <div className="flex flex-col justify-between h-full">
      {widths.map((row, i) => (
        <div key={i} className="flex gap-1 h-[3px]">
          {row.map((w, j) => (
            <div key={j} className="h-full bg-hud transition-opacity duration-200" style={{ width: `${w}%`, opacity: i === active ? 0.95 : 0.28 }} />
          ))}
        </div>
      ))}
    </div>
  );
}

/** Marching chevrons */
export function Chevrons({ count = 7, reverse = false }: { count?: number; reverse?: boolean }) {
  return (
    <div className={`flex items-center gap-0.5 ${reverse ? 'flex-row-reverse' : ''}`}>
      {Array.from({ length: count }, (_, i) => (
        <svg
          key={i}
          viewBox="0 0 10 16"
          className={`w-2.5 h-4 text-hud march ${reverse ? 'rotate-180' : ''}`}
          style={{ animationDelay: `${i * 0.12}s` }}
        >
          <path d="M 1 1 L 8 8 L 1 15" fill="none" stroke="currentColor" strokeWidth={2} />
        </svg>
      ))}
    </div>
  );
}

/** Blinking striped segment rows */
export function StripeBars({ tick, rows = 3, cols = 10 }: { tick: number; rows?: number; cols?: number }) {
  return (
    <div className="flex flex-col gap-1">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="flex gap-[3px]">
          {Array.from({ length: cols }, (_, j) => {
            const on = Math.sin(tick * 0.08 + i * 1.7 + j * 0.9) > -0.1;
            return <div key={j} className="w-3 h-[3px] bg-hud transition-opacity duration-150" style={{ opacity: on ? 0.85 : 0.15 }} />;
          })}
        </div>
      ))}
    </div>
  );
}

/** 4x4 dot matrix that pulses */
export function DotMatrix({ tick }: { tick: number }) {
  return (
    <div className="grid grid-cols-4 gap-[3px]">
      {Array.from({ length: 16 }, (_, i) => {
        const on = ((tick >> 2) + i * 3) % 5 !== 0;
        return <div key={i} className="w-1 h-1 rounded-full bg-hud transition-opacity duration-200" style={{ opacity: on ? 0.9 : 0.15 }} />;
      })}
    </div>
  );
}

/** Sparkline area chart */
export function Sparkline({ data }: { data: number[] }) {
  const w = 100;
  const h = 40;
  const pts = data.map((v, i) => `${((i / (data.length - 1)) * w).toFixed(2)},${(h - (v / 100) * h).toFixed(2)}`);
  const area = `M 0 ${h} L ${pts.join(' L ')} L ${w} ${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="w-full h-full text-hud">
      <defs>
        <linearGradient id="spark" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" style={{ stopColor: 'var(--color-hud)' }} stopOpacity="0.45" />
          <stop offset="100%" style={{ stopColor: 'var(--color-hud)' }} stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map((f) => (
        <line key={f} x1={0} x2={w} y1={h * f} y2={h * f} stroke="currentColor" strokeOpacity={0.12} strokeWidth={0.5} vectorEffect="non-scaling-stroke" />
      ))}
      <path d={area} fill="url(#spark)" />
      <polyline points={pts.join(' ')} fill="none" stroke="currentColor" strokeWidth={1.2} vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

/** 3D perspective floor grid (CSS) */
export function PerspectiveFloor() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ perspective: '220px', perspectiveOrigin: '50% 0%' }}>
      <div className="floor absolute" style={{ left: '-60%', right: '-60%', top: '28%', bottom: '-80%' }} />
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to bottom, var(--color-hud-bg) 0%, transparent 55%, transparent 100%)' }}
      />
    </div>
  );
}
