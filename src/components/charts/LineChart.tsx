interface LinePoint {
  label: string;
  value: number;
}

interface LineChartProps {
  points: LinePoint[];
  color?: string;
  height?: number;
  unit?: string;
}

export function LineChart({
  points,
  color = '#0aa5f0',
  height = 240,
  unit,
}: LineChartProps) {
  const width = 720;
  const padding = { top: 20, right: 20, bottom: 50, left: 40 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;
  const maxVal = Math.max(...points.map((p) => p.value), 0.1);
  const minVal = Math.min(...points.map((p) => p.value), 0);
  const range = maxVal - minVal || 1;

  const xStep = chartW / (points.length - 1 || 1);
  const coords = points.map((p, i) => ({
    x: padding.left + i * xStep,
    y: padding.top + chartH - ((p.value - minVal) / range) * chartH,
  }));

  const linePath = coords
    .map((c, i) => (i === 0 ? `M ${c.x} ${c.y}` : `L ${c.x} ${c.y}`))
    .join(' ');
  const areaPath = `${linePath} L ${coords[coords.length - 1].x} ${
    padding.top + chartH
  } L ${coords[0].x} ${padding.top + chartH} Z`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full">
      <defs>
        <linearGradient id={`area-${color.slice(1)}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 0.25, 0.5, 0.75, 1].map((t) => {
        const y = padding.top + chartH * (1 - t);
        return (
          <line
            key={t}
            x1={padding.left}
            y1={y}
            x2={width - padding.right}
            y2={y}
            stroke="#1c2d40"
            strokeWidth="1"
          />
        );
      })}
      <path d={areaPath} fill={`url(#area-${color.slice(1)})`} />
      <path
        d={linePath}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {coords.map((c, i) => (
        <g key={i}>
          <circle
            cx={c.x}
            cy={c.y}
            r="4"
            fill="#0a1520"
            stroke={color}
            strokeWidth="2"
          />
          {(points.length <= 12 || i % 2 === 0) && (
            <text
              x={c.x}
              y={height - padding.bottom + 16}
              textAnchor="middle"
              className="fill-ink-400"
              style={{ fontSize: 10 }}
            >
              {points[i].label}
            </text>
          )}
        </g>
      ))}
      {unit && (
        <text
          x={padding.left}
          y={12}
          className="fill-ink-500"
          style={{ fontSize: 10 }}
        >
          {unit}
        </text>
      )}
    </svg>
  );
}
