interface Props {
  label: string;
  value: number;
  segments?: number;
  compact?: boolean;
  unit?: string;
}

export function SegmentBar({ label, value, segments = 20, compact = false, unit = '%' }: Props) {
  const filled = Math.round((Math.max(0, Math.min(100, value)) / 100) * segments);
  return (
    <div className="flex items-center gap-2 w-full">
      <span className={`font-display font-bold text-hud shrink-0 ${compact ? 'text-[9px] w-7' : 'text-xs w-8'}`}>{label}</span>
      <div className={`flex-1 flex gap-[2px] border border-hud/40 p-[2px] ${compact ? 'h-2.5' : 'h-3.5'}`}>
        {Array.from({ length: segments }, (_, i) => (
          <div
            key={i}
            className={`flex-1 transition-colors duration-300 ${i < filled ? 'bg-hud' : 'bg-hud/10'}`}
            style={{ opacity: i < filled ? 0.45 + (0.55 * i) / segments : 1 }}
          />
        ))}
      </div>
      <span className={`font-mono text-hud tabular-nums shrink-0 ${compact ? 'text-[9px] w-8' : 'text-[10px] w-9'} text-right`}>
        {Math.round(value)}
        {unit}
      </span>
    </div>
  );
}
