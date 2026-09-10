import { useCallback, useEffect, useRef, useState } from 'react';

export interface Target {
  id: number;
  a: number;
  d: number;
  v: number;
}

export interface Telemetry {
  tick: number;
  cpu: number;
  mem: number;
  net: number;
  temp: number;
  hp: number;
  shield: number;
  energy: number;
  core: number;
  sync: number;
  bpm: number;
  latency: number;
  packets: number;
  altitude: number;
  velocity: number;
  lat: number;
  lon: number;
  thrust: number;
  coolant: number;
  wave: number[];
  bars: number[];
  history: number[];
  pie: [number, number, number];
  targets: Target[];
  stream: string[];
}

export type SubKey = 'cpu' | 'net' | 'shield' | 'energy' | 'temp';

const WAVE_LEN = 140;
const TICK_MS = 60;

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const walk = (v: number, step: number, lo: number, hi: number) => clamp(v + (Math.random() - 0.5) * step, lo, hi);
const hex2 = (n: number) => n.toString(16).toUpperCase().padStart(2, '0');
const streamLine = (addr: number) =>
  `${addr.toString(16).toUpperCase().padStart(4, '0')}  ${Array.from({ length: 5 }, () => hex2(Math.floor(Math.random() * 256))).join(' ')}`;

/** Synthetic ECG waveform, p in [0,1) */
function ecg(p: number) {
  if (p < 0.08) return Math.sin((p / 0.08) * Math.PI) * 0.12;
  if (p < 0.18) return 0;
  if (p < 0.21) return -((p - 0.18) / 0.03) * 0.2;
  if (p < 0.25) return -0.2 + ((p - 0.21) / 0.04) * 1.2;
  if (p < 0.29) return 1.0 - ((p - 0.25) / 0.04) * 1.35;
  if (p < 0.33) return -0.35 + ((p - 0.29) / 0.04) * 0.35;
  if (p < 0.45) return 0;
  if (p < 0.6) return Math.sin(((p - 0.45) / 0.15) * Math.PI) * 0.3;
  return 0;
}

const makeTargets = (): Target[] =>
  Array.from({ length: 6 }, (_, i) => ({
    id: i,
    a: Math.random() * 360,
    d: 12 + Math.random() * 30,
    v: Math.random(),
  }));

const initial = (): Telemetry => ({
  tick: 0,
  cpu: 42,
  mem: 61,
  net: 35,
  temp: 64,
  hp: 88,
  shield: 72,
  energy: 81,
  core: 98.4,
  sync: 96,
  bpm: 68,
  latency: 12,
  packets: 184201,
  altitude: 12400,
  velocity: 842,
  lat: 37.7749,
  lon: -122.4194,
  thrust: 64,
  coolant: 78,
  wave: Array.from({ length: WAVE_LEN }, (_, i) => ecg(((i / WAVE_LEN) * 4) % 1)),
  bars: Array.from({ length: 24 }, () => 20 + Math.random() * 60),
  history: Array.from({ length: 40 }, () => 35 + Math.random() * 25),
  pie: [0.55, 0.3, 0.15],
  targets: makeTargets(),
  stream: Array.from({ length: 8 }, (_, i) => streamLine(0x4a00 + i * 16)),
});

export function useTelemetry(paused: boolean) {
  const [data, setData] = useState<Telemetry>(initial);
  const [scanning, setScanning] = useState(false);
  const phase = useRef(0);
  const addr = useRef(0x4a80);

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => {
      phase.current = (phase.current + 0.06) % 1;
      const p = phase.current;
      setData((prev) => {
        const tick = prev.tick + 1;
        const wave = prev.wave.slice(1);
        wave.push(ecg(p) + (Math.random() - 0.5) * 0.05);
        const bars = prev.bars.map((b) => walk(b, 18, 6, 100));
        const cpu = walk(prev.cpu, 3, 8, 97);
        const history = tick % 4 === 0 ? [...prev.history.slice(1), cpu] : prev.history;
        addr.current = (addr.current + 16) & 0xffff;
        const stream = tick % 3 === 0 ? [...prev.stream.slice(1), streamLine(addr.current)] : prev.stream;
        const pieRaw = prev.pie.map((v) => walk(v, 0.012, 0.05, 0.9));
        const sum = pieRaw.reduce((a, b) => a + b, 0);
        const pie = pieRaw.map((v) => v / sum) as [number, number, number];
        const targets = prev.targets.map((t) => ({
          ...t,
          a: (t.a + 0.12 + t.v * 0.3) % 360,
          d: clamp(t.d + (Math.random() - 0.5) * 0.4, 8, 44),
        }));
        return {
          ...prev,
          tick,
          wave,
          bars,
          cpu,
          history,
          stream,
          pie,
          targets,
          mem: walk(prev.mem, 1, 20, 95),
          net: walk(prev.net, 6, 5, 100),
          temp: walk(prev.temp, 0.7, 40, 96),
          hp: tick % 10 === 0 ? walk(prev.hp, 2, 30, 100) : prev.hp,
          shield: walk(prev.shield, 1, 20, 100),
          energy: tick % 5 === 0 ? walk(prev.energy, 1.5, 10, 100) : prev.energy,
          core: walk(prev.core, 0.3, 94, 99.9),
          sync: walk(prev.sync, 0.5, 90, 100),
          bpm: tick % 8 === 0 ? walk(prev.bpm, 2, 58, 82) : prev.bpm,
          latency: walk(prev.latency, 2, 4, 60),
          packets: prev.packets + Math.floor(Math.random() * 40),
          altitude: walk(prev.altitude, 30, 9000, 15000),
          velocity: walk(prev.velocity, 6, 600, 1100),
          lat: walk(prev.lat, 0.0004, -90, 90),
          lon: walk(prev.lon, 0.0006, -180, 180),
          thrust: walk(prev.thrust, 2, 10, 100),
          coolant: walk(prev.coolant, 1, 20, 100),
        };
      });
    }, TICK_MS);
    return () => window.clearInterval(id);
  }, [paused]);

  const scan = useCallback(() => {
    setScanning(true);
    setData((prev) => ({ ...prev, targets: makeTargets() }));
    window.setTimeout(() => setScanning(false), 2400);
  }, []);

  return { data, scanning, scan, tickMs: TICK_MS };
}

export function useClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);
  return now;
}
