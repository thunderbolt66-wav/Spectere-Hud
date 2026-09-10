import { useClock } from '../../hooks/useTelemetry';
import { fmtDate, fmtTime, polygonPoints } from '../../lib/svg';

interface Props {
  alert: boolean;
  paused: boolean;
  locked: boolean;
  thermal: boolean;
}

export function StatusBar({ alert, paused, locked, thermal }: Props) {
  const now = useClock();
  const status = thermal ? 'THERMAL WARN' : alert ? 'ALERT' : paused ? 'STANDBY' : locked ? 'LOCKED' : 'NOMINAL';
  return (
    <header className="h-11 shrink-0 flex items-center justify-between px-3 sm:px-4 border-b border-hud/25 bg-hud-bg/60 backdrop-blur relative z-10">
      <div className="flex items-center gap-3 min-w-0">
        <svg viewBox="-50 -50 100 100" className="w-6 h-6 text-hud hud-glow-sm shrink-0">
          <g className="spin" style={{ animationDuration: '12s' }}>
            <polygon points={polygonPoints(44, 6, 30)} fill="none" stroke="currentColor" strokeWidth={5} />
          </g>
          <g className="spin-rev" style={{ animationDuration: '8s' }}>
            <polygon points={polygonPoints(28, 6)} fill="currentColor" fillOpacity={0.25} stroke="currentColor" strokeWidth={3} />
          </g>
          <circle r={8} fill="#fff" className="core-pulse" />
        </svg>
        <div className="font-display text-[10px] sm:text-[11px] tracking-[0.35em] text-hud text-glow truncate">HUD INTERFACE TECHNOLOGY</div>
        <span className="hidden md:inline font-mono text-[10px] text-hud/50 whitespace-nowrap">// TACTICAL OVERLAY v4.2.1</span>
      </div>
      <div className="flex items-center gap-3 sm:gap-4 font-mono text-[10px] shrink-0">
        <span className="hidden sm:inline text-hud/60">{fmtDate(now)}</span>
        <span className="text-hud text-glow text-sm tabular-nums">{fmtTime(now)}</span>
        <span
          className={`px-2 py-0.5 border text-[9px] font-display tracking-[0.2em] ${
            alert ? 'border-hud bg-hud/20 flicker' : paused ? 'border-hud/40 text-hud/60' : 'border-hud/50'
          }`}
        >
          {status}
        </span>
      </div>
    </header>
  );
}
