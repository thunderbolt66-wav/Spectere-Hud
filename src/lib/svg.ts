export const polar = (r: number, deg: number): [number, number] => {
  const a = ((deg - 90) * Math.PI) / 180;
  return [r * Math.cos(a), r * Math.sin(a)];
};

export const arcPath = (r: number, start: number, end: number) => {
  const [x1, y1] = polar(r, start);
  const [x2, y2] = polar(r, end);
  const large = end - start > 180 ? 1 : 0;
  return `M ${x1.toFixed(3)} ${y1.toFixed(3)} A ${r} ${r} 0 ${large} 1 ${x2.toFixed(3)} ${y2.toFixed(3)}`;
};

export const sectorPath = (r: number, start: number, end: number) => {
  const [x1, y1] = polar(r, start);
  const [x2, y2] = polar(r, end);
  const large = end - start > 180 ? 1 : 0;
  return `M 0 0 L ${x1.toFixed(3)} ${y1.toFixed(3)} A ${r} ${r} 0 ${large} 1 ${x2.toFixed(3)} ${y2.toFixed(3)} Z`;
};

export const polygonPoints = (r: number, n: number, rot = 0) =>
  Array.from({ length: n }, (_, i) =>
    polar(r, rot + (i * 360) / n)
      .map((v) => v.toFixed(3))
      .join(','),
  ).join(' ');

export const pad = (n: number, w = 2) => String(Math.floor(n)).padStart(w, '0');

export const fmtTime = (d: Date) => `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}`;

export const fmtDate = (d: Date) => {
  const m = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'][d.getUTCMonth()];
  return `${pad(d.getUTCDate())} ${m} ${d.getUTCFullYear()}`;
};

export const fmtUptime = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
};
