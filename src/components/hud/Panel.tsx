import type { ReactNode } from 'react';

interface PanelProps {
  title?: string;
  meta?: string;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}

export function Panel({ title, meta, children, className = '', bodyClassName = '' }: PanelProps) {
  return (
    <section className={`hud-panel relative min-h-0 min-w-0 overflow-hidden flex flex-col ${className}`}>
      {(title || meta) && (
        <header className="flex items-center justify-between gap-2 px-2.5 pt-1.5 text-[9px] leading-none tracking-[0.28em] uppercase font-display text-hud/80 shrink-0">
          <span className="flex items-center gap-1.5 truncate">
            <span className="inline-block w-1 h-1 bg-hud blink shrink-0" />
            {title}
          </span>
          {meta && <span className="font-mono tracking-normal text-hud/60 normal-case shrink-0 tabular-nums">{meta}</span>}
        </header>
      )}
      <div className={`relative flex-1 min-h-0 p-2 ${bodyClassName}`}>{children}</div>
    </section>
  );
}
