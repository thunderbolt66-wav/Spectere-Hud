import { useState } from 'react';
import { Cpu, Wifi, Shield, Zap, Thermometer, Crosshair, ScanLine, Pause, Play, AlertTriangle } from 'lucide-react';
import { useTelemetry, useClock, type SubKey } from './hooks/useTelemetry';
import { fmtDate, fmtTime, fmtUptime } from './lib/svg';
import { StatusBar } from './components/hud/StatusBar';
import { Panel } from './components/hud/Panel';
import { RingGauge } from './components/hud/RingGauge';
import { CoreReticle } from './components/hud/CoreReticle';
import { Radar } from './components/hud/Radar';
import { Waveform } from './components/hud/Waveform';
import { Equalizer } from './components/hud/Equalizer';
import { PieChart } from './components/hud/PieChart';
import { SegmentBar } from './components/hud/SegmentBar';
import { Battery } from './components/hud/Battery';
import { DataStream } from './components/hud/DataStream';
import { Cone3D } from './components/hud/Cone3D';
import { Connectors } from './components/hud/Connectors';
import { HexDots, ShapeArrow, DotRing, MiniReticle, TextBlock, Chevrons, StripeBars, DotMatrix, Sparkline, PerspectiveFloor } from './components/hud/Decor';

const SUBSYSTEMS: { key: SubKey; label: string; name: string; icon: typeof Cpu }[] = [
  { key: 'cpu', label: 'CPU', name: 'PROCESSOR', icon: Cpu },
  { key: 'net', label: 'NET', name: 'UPLINK', icon: Wifi },
  { key: 'shield', label: 'SHD', name: 'SHIELD', icon: Shield },
  { key: 'energy', label: 'PWR', name: 'REACTOR', icon: Zap },
  { key: 'temp', label: 'TMP', name: 'THERMAL', icon: Thermometer },
];

const delay = (i: number) => ({ animationDelay: `${i * 60}ms` });

export default function App() {
  const [paused, setPaused] = useState(false);
  const [locked, setLocked] = useState(false);
  const [alertManual, setAlertManual] = useState(false);
  const [sub, setSub] = useState<SubKey>('cpu');
  const { data, scanning, scan, tickMs } = useTelemetry(paused);
  const now = useClock();

  const thermal = data.temp > 88;
  const alert = alertManual || thermal;
  const active = SUBSYSTEMS.find((s) => s.key === sub)!;
  const uptime = fmtUptime((data.tick * tickMs) / 1000 + 3600 * 4 + 1380);
  const hexline = data.stream[data.stream.length - 1]?.slice(6) ?? '';

  return (
    <div className={`hud-root min-h-screen text-hud font-mono selection:bg-hud/30 relative ${alert ? 'hud-alert' : ''}`}>
      <div className="fixed inset-0 hud-grid-bg pointer-events-none" />
      <div className="fixed inset-0 vignette pointer-events-none" />

      <StatusBar alert={alert} paused={paused} locked={locked} thermal={thermal} />

      <main className="relative p-2">
        <div className="absolute inset-0 hidden lg:block">
          <Connectors />
        </div>

        <div className="relative grid grid-cols-2 gap-2 auto-rows-[190px] lg:grid-cols-12 lg:grid-rows-6 lg:auto-rows-auto lg:h-[calc(100dvh-44px-16px)] lg:min-h-[660px]">
          {/* ===== CENTER CORE ===== */}
          <div className="relative col-span-2 row-span-2 lg:col-start-4 lg:col-span-6 lg:row-start-2 lg:row-span-4 min-h-0 fade-up" style={delay(0)}>
            <div className="absolute inset-0 flex items-center justify-center p-1">
              <CoreReticle value={data.core} label={`${active.name} ${Math.round(data[active.key])}%`} locked={locked} scanning={scanning} />
            </div>
            {/* overlays */}
            <div className="absolute top-2 left-2 text-[9px] leading-tight">
              <div className="font-display tracking-[0.3em] text-hud/70">CORE INTEGRITY</div>
              <div className="font-display text-xl text-glow tabular-nums">{data.core.toFixed(1)}%</div>
            </div>
            <div className="absolute top-2 right-2 text-[9px] leading-tight text-right">
              <div className="font-display tracking-[0.3em] text-hud/70">SYNC</div>
              <div className="font-display text-xl text-glow tabular-nums">{Math.round(data.sync)}%</div>
            </div>
            <div className="absolute bottom-2 left-2 text-[9px] leading-tight">
              <div className="font-display tracking-[0.3em] text-hud/70">MODE</div>
              <div className="font-display text-sm">{scanning ? 'SCANNING' : locked ? 'TRACK' : paused ? 'STANDBY' : 'PASSIVE'}</div>
            </div>
            <div className="absolute bottom-2 right-2 text-[9px] leading-tight text-right">
              <div className="font-display tracking-[0.3em] text-hud/70">PKTS</div>
              <div className="font-display text-sm tabular-nums">{data.packets.toLocaleString()}</div>
            </div>
            {locked && (
              <div className="absolute left-1/2 -translate-x-1/2 bottom-5 font-display text-[10px] tracking-[0.4em] text-glow flicker px-3 py-1 border border-hud/60 bg-hud-bg/60">
                TARGET LOCKED
              </div>
            )}
            {thermal && (
              <div className="absolute left-1/2 -translate-x-1/2 top-5 font-display text-[10px] tracking-[0.4em] text-glow flicker px-3 py-1 border border-hud bg-hud/20 flex items-center gap-2">
                <AlertTriangle size={12} /> THERMAL WARNING {Math.round(data.temp)}°C
              </div>
            )}
          </div>

          {/* ===== ROW 1 ===== */}
          <Panel title="System Load" meta={`T+${uptime}`} className="col-span-2 lg:col-start-1 lg:col-span-3 lg:row-start-1 fade-up" bodyClassName="flex flex-col">
            <div className="flex-1 min-h-0 grid grid-cols-3 gap-2">
              {(
                [
                  ['CPU', data.cpu],
                  ['MEM', data.mem],
                  ['NET', data.net],
                ] as const
              ).map(([l, v]) => (
                <div key={l} className="flex flex-col items-center min-h-0">
                  <RingGauge value={v} className="flex-1 min-h-0 w-full" />
                  <span className="text-[8px] font-display tracking-[0.25em] text-hud/70 shrink-0">{l}</span>
                </div>
              ))}
            </div>
            <div className="shrink-0 flex items-center justify-between pt-1.5 text-[9px] gap-2">
              <span className="font-display tracking-[0.2em] text-hud/80 whitespace-nowrap">Hud interface technology</span>
              <span className="font-mono text-hud/50 truncate">{hexline}</span>
            </div>
          </Panel>

          <Panel title="Data Link" meta={`${Math.round(data.latency)}ms`} className="lg:col-start-4 lg:col-span-3 lg:row-start-1 fade-up" bodyClassName="flex gap-2" >
            <div className="h-full aspect-square shrink-0 max-w-[45%]">
              <MiniReticle />
            </div>
            <div className="flex-1 min-w-0">
              <DataStream lines={data.stream} />
            </div>
          </Panel>

          <Panel title="Vitals" meta={`HP ${Math.round(data.hp)}`} className="lg:col-start-7 lg:col-span-3 lg:row-start-1 fade-up" bodyClassName="flex flex-col gap-2">
            <SegmentBar label="HP" value={data.hp} segments={20} />
            <div className="flex-1 min-h-0 flex gap-3">
              <div className="h-full aspect-square shrink-0">
                <HexDots value={data.mem} />
              </div>
              <div className="flex-1 min-w-0 py-1">
                <TextBlock rows={6} tick={data.tick} />
              </div>
              <div className="w-16 shrink-0 hidden sm:block">
                <Equalizer values={data.bars.slice(0, 10)} />
              </div>
            </div>
          </Panel>

          <Panel title="Nav // Uplink" meta="SAT-7 LINK" className="col-span-2 lg:col-start-10 lg:col-span-3 lg:row-start-1 fade-up" bodyClassName="flex items-center gap-3">
            <div className="w-10 h-full shrink-0 flex flex-col items-center justify-center gap-2">
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-hud bob hud-glow-sm">
                <path d="M4 5 L12 16 L20 5 Z" fill="currentColor" fillOpacity={0.85} />
                <path d="M7 17 H17" stroke="currentColor" strokeWidth={1.5} />
                <path d="M9 20 H15" stroke="currentColor" strokeWidth={1.5} strokeOpacity={0.5} />
              </svg>
              <DotMatrix tick={data.tick} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-display text-2xl xl:text-3xl tabular-nums text-glow leading-none">{fmtTime(now)}</div>
              <div className="font-mono text-[10px] text-hud/60 mt-1">{fmtDate(now)} · UTC</div>
              <div className="font-mono text-[10px] mt-1 flex gap-3 tabular-nums">
                <span>LAT {data.lat.toFixed(4)}</span>
                <span>LON {data.lon.toFixed(4)}</span>
              </div>
            </div>
          </Panel>

          {/* ===== LEFT COLUMN ===== */}
          <Panel title="Vector Field" meta={`${Math.round(data.velocity)} m/s`} className="lg:col-start-1 lg:col-span-2 lg:row-start-2 lg:row-span-2 fade-up" bodyClassName="flex flex-col">
            <div className="flex-1 min-h-0">
              <Cone3D paused={paused} />
            </div>
            <div className="shrink-0 grid grid-cols-2 gap-2 text-[9px] font-mono pt-1">
              <div className="border-t border-hud/30 pt-1">
                <div className="text-hud/60 font-display tracking-[0.2em]">ALT</div>
                <div className="tabular-nums">{Math.round(data.altitude).toLocaleString()} m</div>
              </div>
              <div className="border-t border-hud/30 pt-1">
                <div className="text-hud/60 font-display tracking-[0.2em]">THR</div>
                <div className="tabular-nums">{Math.round(data.thrust)}%</div>
              </div>
            </div>
          </Panel>

          <Panel title="Shield" className="lg:col-start-3 lg:col-span-1 lg:row-start-2 lg:row-span-2 fade-up" bodyClassName="flex flex-col items-center justify-center">
            <RingGauge value={data.shield} className="w-full flex-1 min-h-0" thick={8} fontSize={17} sublabel="SHIELD" />
            <div className="shrink-0 w-full flex gap-1 mt-1">
              {Array.from({ length: 8 }, (_, i) => (
                <div key={i} className={`flex-1 h-1 ${i < Math.round(data.shield / 12.5) ? 'bg-hud' : 'bg-hud/15'}`} />
              ))}
            </div>
          </Panel>

          <Panel title="Bio-Signal // ECG" meta={`${Math.round(data.bpm)} BPM`} className="col-span-2 lg:col-start-1 lg:col-span-3 lg:row-start-4 fade-up" bodyClassName="flex gap-2 items-stretch">
            <div className="flex-1 min-w-0 border border-hud/20">
              <Waveform data={data.wave} />
            </div>
            <div className="h-full aspect-square shrink-0 max-w-[30%]">
              <DotRing value={data.sync} />
            </div>
          </Panel>

          <Panel title="Spectrum" meta="24 CH" className="lg:col-start-1 lg:col-span-2 lg:row-start-5 lg:row-span-2 fade-up" bodyClassName="flex flex-col gap-2">
            <div className="flex-1 min-h-0">
              <Equalizer values={data.bars} />
            </div>
            <div className="shrink-0 flex flex-col gap-1.5">
              <SegmentBar label="PWR" value={data.energy} segments={16} compact />
              <SegmentBar label="THR" value={data.thrust} segments={16} compact />
              <SegmentBar label="CLN" value={data.coolant} segments={16} compact />
            </div>
          </Panel>

          <Panel title="Subsys" className="lg:col-start-3 lg:col-span-1 lg:row-start-5 lg:row-span-2 fade-up" bodyClassName="flex flex-col items-center justify-around py-1">
            {SUBSYSTEMS.map((s) => {
              const Icon = s.icon;
              const on = s.key === sub;
              return (
                <button
                  key={s.key}
                  onClick={() => setSub(s.key)}
                  className="group flex flex-col items-center gap-0.5 cursor-pointer"
                  title={s.name}
                  aria-pressed={on}
                >
                  <span
                    className={`relative w-8 h-8 rounded-full border flex items-center justify-center transition-all ${
                      on ? 'border-hud bg-hud/20 hud-glow' : 'border-hud/40 group-hover:border-hud/80'
                    }`}
                  >
                    {on && <span className="absolute -inset-1 rounded-full border border-dashed border-hud/70 spin-el" />}
                    <Icon size={13} strokeWidth={1.75} />
                  </span>
                  <span className={`text-[7px] font-display tracking-[0.2em] ${on ? 'text-hud' : 'text-hud/50'}`}>
                    {s.label} {Math.round(data[s.key])}
                  </span>
                </button>
              );
            })}
          </Panel>

          {/* ===== RIGHT COLUMN ===== */}
          <Panel title="Alloc" meta={`${Math.round(data.sync)}%`} className="lg:col-start-10 lg:col-span-1 lg:row-start-2 fade-up" bodyClassName="flex flex-col">
            <div className="flex-1 min-h-0">
              <PieChart values={data.pie} />
            </div>
            <div className="shrink-0 flex justify-between text-[7px] font-display tracking-[0.15em] pt-1">
              {['SYS', 'USR', 'I/O'].map((l, i) => (
                <span key={l} className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-hud" style={{ opacity: [0.9, 0.55, 0.28][i] }} />
                  {l} {Math.round(data.pie[i] * 100)}
                </span>
              ))}
            </div>
          </Panel>

          <Panel title="Power" meta={`${Math.round(data.energy)}%`} className="lg:col-start-11 lg:col-span-2 lg:row-start-2 fade-up" bodyClassName="flex gap-3">
            <div className="h-full shrink-0">
              <Battery value={data.energy} />
            </div>
            <div className="flex-1 min-w-0 flex flex-col gap-1">
              <div className="flex justify-between text-[8px] text-hud/70 font-display tracking-[0.2em]">
                <span>CPU TREND</span>
                <span className="font-mono tabular-nums">{Math.round(data.cpu)}%</span>
              </div>
              <div className="flex-1 min-h-0 border border-hud/20">
                <Sparkline data={data.history} />
              </div>
              <SegmentBar label="SHD" value={data.shield} segments={12} compact />
            </div>
          </Panel>

          <Panel
            title="Proximity Radar"
            meta={`${data.targets.length} TGT`}
            className="lg:col-start-10 lg:col-span-2 lg:row-start-3 lg:row-span-2 fade-up"
            bodyClassName="flex flex-col"
          >
            <div className="flex-1 min-h-0">
              <Radar targets={data.targets} scanning={scanning} locked={locked} />
            </div>
            <div className="shrink-0 flex justify-between text-[8px] font-mono text-hud/60 pt-1">
              <span>SWEEP {scanning ? '0.9' : '3.2'}s</span>
              <span>RNG 45 KM</span>
              <span>{locked ? 'TRACKING TGT-0' : 'PASSIVE'}</span>
            </div>
          </Panel>

          <Panel title="Sensors" className="lg:col-start-12 lg:col-span-1 lg:row-start-3 lg:row-span-2 fade-up" bodyClassName="flex flex-col justify-around">
            {[
              { l: 'THRM', v: `${Math.round(data.temp)}°C`, p: data.temp },
              { l: 'LAT', v: `${Math.round(data.latency)}ms`, p: (data.latency / 60) * 100 },
              { l: 'ALT', v: `${(data.altitude / 1000).toFixed(1)}k`, p: (data.altitude / 15000) * 100 },
              { l: 'VEL', v: `${Math.round(data.velocity)}`, p: (data.velocity / 1100) * 100 },
              { l: 'MEM', v: `${Math.round(data.mem)}%`, p: data.mem },
              { l: 'CLN', v: `${Math.round(data.coolant)}%`, p: data.coolant },
            ].map((s) => (
              <div key={s.l} className="text-[8px]">
                <div className="flex justify-between font-mono">
                  <span className="font-display tracking-[0.15em] text-hud/70">{s.l}</span>
                  <span className="tabular-nums">{s.v}</span>
                </div>
                <div className="h-[3px] bg-hud/10 mt-0.5">
                  <div className="h-full bg-hud transition-all duration-300" style={{ width: `${Math.min(100, s.p)}%` }} />
                </div>
              </div>
            ))}
          </Panel>

          <Panel title="Thermal Vector" meta={`${Math.round(data.temp)}°C`} className="col-span-2 lg:col-start-10 lg:col-span-3 lg:row-start-5 lg:row-span-2 fade-up" bodyClassName="flex gap-3">
            <div className="h-full aspect-square shrink-0 max-w-[50%]">
              <ShapeArrow value={data.temp} label="THERMAL" />
            </div>
            <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
              <SegmentBar label="CELL" value={data.energy} segments={14} compact />
              <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[9px] font-mono">
                <div className="border-l-2 border-hud/50 pl-1.5">
                  <div className="text-hud/60 font-display tracking-[0.15em] text-[7px]">UPTIME</div>
                  <div className="tabular-nums">{uptime}</div>
                </div>
                <div className="border-l-2 border-hud/50 pl-1.5">
                  <div className="text-hud/60 font-display tracking-[0.15em] text-[7px]">LATENCY</div>
                  <div className="tabular-nums">{data.latency.toFixed(1)} ms</div>
                </div>
                <div className="border-l-2 border-hud/50 pl-1.5">
                  <div className="text-hud/60 font-display tracking-[0.15em] text-[7px]">COOLANT</div>
                  <div className="tabular-nums">{Math.round(data.coolant)}%</div>
                </div>
                <div className="border-l-2 border-hud/50 pl-1.5">
                  <div className="text-hud/60 font-display tracking-[0.15em] text-[7px]">STATUS</div>
                  <div className={thermal ? 'flicker' : ''}>{thermal ? 'CRITICAL' : data.temp > 78 ? 'ELEVATED' : 'NOMINAL'}</div>
                </div>
              </div>
              <StripeBars tick={data.tick} rows={2} cols={12} />
            </div>
          </Panel>

          {/* ===== BOTTOM CENTER: floor + controls ===== */}
          <div className="relative col-span-2 lg:col-start-4 lg:col-span-6 lg:row-start-6 min-h-0 overflow-hidden fade-up border-t border-hud/20">
            <PerspectiveFloor />
            <div className="relative h-full flex items-center justify-between gap-3 px-3">
              <div className="hidden md:flex flex-col gap-2 items-start">
                <StripeBars tick={data.tick} rows={3} cols={8} />
                <div className="flex items-center gap-2">
                  <Chevrons count={5} reverse />
                  <span className="text-[8px] font-display tracking-[0.25em] text-hud/60">RX</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2">
                <button className="hud-btn flex items-center gap-2" onClick={scan} disabled={scanning}>
                  <ScanLine size={12} /> {scanning ? 'SCANNING…' : 'SCAN'}
                </button>
                <button className={`hud-btn flex items-center gap-2 ${locked ? 'is-on' : ''}`} onClick={() => setLocked((v) => !v)}>
                  <Crosshair size={12} /> {locked ? 'UNLOCK' : 'LOCK'}
                </button>
                <button className={`hud-btn flex items-center gap-2 ${alertManual ? 'is-on' : ''}`} onClick={() => setAlertManual((v) => !v)}>
                  <AlertTriangle size={12} /> ALERT
                </button>
                <button className={`hud-btn flex items-center gap-2 ${paused ? 'is-on' : ''}`} onClick={() => setPaused((v) => !v)}>
                  {paused ? <Play size={12} /> : <Pause size={12} />} {paused ? 'RESUME' : 'PAUSE'}
                </button>
              </div>

              <div className="hidden md:flex flex-col gap-2 items-end">
                <div className="w-10 h-10">
                  <DotRing value={data.energy} dots={18} speed="8s" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[8px] font-display tracking-[0.25em] text-hud/60">TX</span>
                  <Chevrons count={5} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <div className="fixed inset-0 scanlines pointer-events-none z-40" />
    </div>
  );
}
