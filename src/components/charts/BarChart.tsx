interface Bar {
  label: string;
  value: number;
  color?: string;
}

interface BarChartProps {
  bars: Bar[];
  unit?: string;
  height?: number;
  highlightIndex?: number;
}

export function BarChart({
  bars,
  unit = '',
  height = 260,
  highlightIndex,
}: BarChartProps) {
  const width = 720;
  const padding = { top: 20, right: 16, bottom: 70, left: 40 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;
  const maxVal = Math.max(...bars.map((b) => b.value), 0.1);
  const barW = chartW / bars.length - 12;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full">
      {[0, 0.25, 0.5, 0.75, 1].map((t) => {
        const y = padding.top + chartH * (1 - t);
        const val = maxVal * t;
        return (
          <g key={t}>
            <line
              x1={padding.left}
              y1={y}
              x2={width - padding.right}
              y2={y}
              stroke="#1c2d40"
              strokeWidth="1"
            />
            <text
              x={padding.left - 6}
              y={y + 3}
              textAnchor="end"
              className="fill-ink-500"
              style={{ fontSize: 10 }}
            >
              {val.toFixed(0)}
            </text>
          </g>
        );
      })}
      {bars.map((b, i) => {
        const x = padding.left + i * (chartW / bars.length) + 6;
        const h = (b.value / maxVal) * chartH;
        const y = padding.top + chartH - h;
        const isHi = highlightIndex === i;
        return (
          <g key={i}>
            <rect
              x={x}
              y={y}
              width={barW}
              height={Math.max(h, 1)}
              rx="4"
              fill={b.color ?? '#0aa5f0'}
              opacity={isHi ? 1 : 0.75}
              style={{ transition: 'all 0.6s ease-out' }}
            />
            <text
              x={x + barW / 2}
              y={y - 5}
              textAnchor="middle"
              className="fill-ink-300"
              style={{ fontSize: 10, fontWeight: 600 }}
            >
              {b.value.toFixed(b.value < 10 ? 1 : 0)}
            </text>
            <text
              x={x + barW / 2}
              y={height - padding.bottom + 14}
              textAnchor="middle"
              className="fill-ink-400"
              style={{ fontSize: 10 }}
            >
              {b.label}
            </text>
          </g>
        );
      })}
      {unit && (
        <text
          x={padding.left}
          y={14}
          className="fill-ink-500"
          style={{ fontSize: 10 }}
        >
          {unit}
        </text>
      )}
    </svg>
  );
}
