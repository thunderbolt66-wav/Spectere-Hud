interface Props {
  lines: string[];
}

export function DataStream({ lines }: Props) {
  return (
    <div className="font-mono text-[9px] leading-[1.4] text-hud overflow-hidden h-full flex flex-col justify-end">
      {lines.map((l, i) => (
        <div key={`${i}-${l}`} className="whitespace-nowrap flex gap-2" style={{ opacity: 0.25 + (0.75 * i) / (lines.length - 1) }}>
          <span className="text-hud/50">{'>'}</span>
          <span>{l}</span>
        </div>
      ))}
    </div>
  );
}
