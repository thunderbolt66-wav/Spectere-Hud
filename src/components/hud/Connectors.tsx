const TRACES = [
  'M 0.6 2.5 H 20 L 23 5.5 H 33',
  'M 33 2.5 V 0.8 H 62',
  'M 66 1.5 H 80 L 83 4.5 H 99.4',
  'M 99.4 4.5 V 30',
  'M 0.6 20 V 45 L 2.5 47 V 80',
  'M 30 50 H 34',
  'M 66 50 H 70',
  'M 62 22 L 66 17 H 76',
  'M 62 78 L 66 83 H 76',
  'M 38 22 L 33 17 H 20',
  'M 38 78 L 33 83 H 14',
  'M 50 16 V 6',
  'M 50 84 V 96',
  'M 84 40 H 92 L 94 42 V 60',
  'M 84 99 H 99 V 90',
  'M 4 99 H 40 L 42 96.5 H 58 L 60 99 H 72',
  'M 25 34 H 31',
  'M 25 66 H 31',
  'M 75 34 H 69',
  'M 75 66 H 69',
];

const DOTS: [number, number][] = [
  [0.6, 2.5],
  [33, 5.5],
  [62, 0.8],
  [66, 1.5],
  [99.4, 30],
  [0.6, 20],
  [2.5, 80],
  [30, 50],
  [70, 50],
  [76, 17],
  [76, 83],
  [20, 17],
  [14, 83],
  [50, 6],
  [50, 96],
  [84, 40],
  [94, 60],
  [99, 90],
  [4, 99],
  [72, 99],
  [25, 34],
  [25, 66],
  [75, 34],
  [75, 66],
];

export function Connectors() {
  return (
    <svg className="absolute inset-0 w-full h-full text-hud pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
      <g fill="none" stroke="currentColor" strokeOpacity={0.4} strokeWidth={1}>
        {TRACES.map((d, i) => (
          <path key={i} d={d} vectorEffect="non-scaling-stroke" />
        ))}
      </g>
      <g fill="none" stroke="currentColor" strokeOpacity={0.9} strokeWidth={1.5} className="dash-run">
        {TRACES.map((d, i) => (
          <path key={i} d={d} vectorEffect="non-scaling-stroke" style={{ animationDelay: `${(i * 0.37) % 3}s` }} />
        ))}
      </g>
      <g stroke="currentColor" strokeWidth={5} strokeLinecap="round" strokeOpacity={0.9}>
        {DOTS.map(([x, y], i) => (
          <path key={i} d={`M ${x} ${y} h 0.001`} vectorEffect="non-scaling-stroke" />
        ))}
      </g>
    </svg>
  );
}
