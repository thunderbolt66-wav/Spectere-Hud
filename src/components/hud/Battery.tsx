interface Props {
  value: number;
  cells?: number;
}

export function Battery({ value, cells = 6 }: Props) {
  const filled = Math.round((value / 100) * cells);
  return (
    <div className="flex flex-col items-center h-full">
      <div className="w-3 h-1 bg-hud/70" />
      <div className="flex-1 w-9 border border-hud/70 p-[3px] flex flex-col-reverse gap-[3px] min-h-0">
        {Array.from({ length: cells }, (_, i) => (
          <div
            key={i}
            className={`flex-1 transition-colors duration-500 ${i < filled ? 'bg-hud' : 'bg-hud/10'}`}
            style={{ opacity: i < filled ? 0.5 + (i / cells) * 0.5 : 1 }}
          />
        ))}
      </div>
      <span className="font-display text-[10px] mt-1 tabular-nums">{Math.round(value)}%</span>
    </div>
  );
}
