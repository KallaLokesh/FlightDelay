interface HeatmapProps {
  rows: string[];
  cols: string[];
  values: number[][];
  unit?: string;
}

export function Heatmap({ rows, cols, values, unit = '' }: HeatmapProps) {
  const max = Math.max(...values.flat(), 0.1);

  const colorFor = (v: number) => {
    const t = v / max;
    const r = Math.round(10 + t * 239);
    const g = Math.round(165 - t * 121);
    const b = Math.round(240 - t * 196);
    return `rgb(${r},${g},${b})`;
  };

  return (
    <div className="w-full overflow-x-auto">
      <div className="inline-block min-w-full">
        <div
          className="grid gap-1"
          style={{
            gridTemplateColumns: `100px repeat(${cols.length}, 1fr)`,
          }}
        >
          <div />
          {cols.map((c) => (
            <div
              key={c}
              className="pb-1 text-center text-[10px] font-medium text-ink-400"
            >
              {c}
            </div>
          ))}
          {rows.map((r, ri) => (
            <FragmentRow key={r}>
              <div className="flex items-center pr-2 text-right text-[10px] font-medium text-ink-400">
                {r}
              </div>
              {values[ri].map((v, ci) => (
                <div
                  key={ci}
                  className="group relative flex h-10 items-center justify-center rounded text-[10px] font-semibold transition-transform hover:scale-105"
                  style={{
                    background: colorFor(v),
                    color: v / max > 0.5 ? '#0a1520' : '#e9eef5',
                  }}
                  title={`${r} ${cols[ci]}: ${v.toFixed(1)}${unit}`}
                >
                  {v.toFixed(0)}
                </div>
              ))}
            </FragmentRow>
          ))}
        </div>
      </div>
    </div>
  );
}

function FragmentRow({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
