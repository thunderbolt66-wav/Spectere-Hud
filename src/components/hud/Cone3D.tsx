import { useEffect, useState } from 'react';

const N = 16;

interface P {
  x: number;
  y: number;
  z: number;
}

export function Cone3D({ paused }: { paused: boolean }) {
  const [t, setT] = useState(0);

  useEffect(() => {
    if (paused) return;
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      setT((v) => v + dt);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [paused]);

  const theta = t * 0.7;
  const tilt = 0.42;
  const S = 38;
  const proj = (x: number, y: number, z: number): P => {
    const x1 = x * Math.cos(theta) + z * Math.sin(theta);
    const z1 = -x * Math.sin(theta) + z * Math.cos(theta);
    const y2 = y * Math.cos(tilt) + z1 * Math.sin(tilt);
    const z2 = -y * Math.sin(tilt) + z1 * Math.cos(tilt);
    return { x: x1 * S, y: y2 * S, z: z2 };
  };

  const apex = proj(0, -1.25, 0);
  const baseC = proj(0, 0.55, 0);
  const base = Array.from({ length: N }, (_, i) => {
    const a = (i / N) * Math.PI * 2;
    return proj(Math.cos(a), 0.55, Math.sin(a));
  });
  const mid = Array.from({ length: N }, (_, i) => {
    const a = (i / N) * Math.PI * 2;
    return proj(Math.cos(a) * 0.5, -0.35, Math.sin(a) * 0.5);
  });
  const faces = base
    .map((p, i) => {
      const q = base[(i + 1) % N];
      const f = (p.z + q.z) / 2;
      return { d: `M ${apex.x.toFixed(2)} ${apex.y.toFixed(2)} L ${p.x.toFixed(2)} ${p.y.toFixed(2)} L ${q.x.toFixed(2)} ${q.y.toFixed(2)} Z`, f };
    })
    .sort((a, b) => a.f - b.f);
  const toPts = (arr: P[]) => arr.map((p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' ');

  return (
    <svg viewBox="-52 -58 104 100" className="w-full h-full text-hud">
      <ellipse cx={0} cy={baseC.y + 6} rx={44} ry={7} fill="currentColor" fillOpacity={0.05} />
      <ellipse cx={0} cy={baseC.y + 6} rx={44} ry={7} fill="none" stroke="currentColor" strokeOpacity={0.3} strokeWidth={0.5} strokeDasharray="2 2" />
      {faces.map((f, i) => {
        const front = i === faces.length - 1;
        return (
          <path
            key={i}
            d={f.d}
            fill="currentColor"
            fillOpacity={front ? 0.6 : Math.max(0, f.f) * 0.22}
            stroke="currentColor"
            strokeOpacity={f.f > 0 ? 0.75 : 0.2}
            strokeWidth={0.5}
            strokeLinejoin="round"
          />
        );
      })}
      <polygon points={toPts(base)} fill="none" stroke="currentColor" strokeWidth={0.9} />
      <polygon points={toPts(mid)} fill="none" stroke="currentColor" strokeWidth={0.5} strokeDasharray="1.5 1.5" strokeOpacity={0.7} />
      <line x1={apex.x} y1={apex.y} x2={baseC.x} y2={baseC.y} stroke="currentColor" strokeOpacity={0.4} strokeWidth={0.5} strokeDasharray="1 2" />
      <circle cx={apex.x} cy={apex.y} r={1.6} fill="#fff" className="core-pulse" />
    </svg>
  );
}
