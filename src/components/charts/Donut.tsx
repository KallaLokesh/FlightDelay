interface Slice {
  label: string;
  value: number;
  color: string;
}

interface DonutProps {
  slices: Slice[];
  centerLabel?: string;
  centerValue?: string;
  size?: number;
}

export function Donut({
  slices,
  centerLabel,
  centerValue,
  size = 200,
}: DonutProps) {
  const total = slices.reduce((s, x) => s + x.value, 0) || 1;
  const radius = size / 2 - 8;
  const cx = size / 2;
  const cy = size / 2;
  const inner = radius * 0.62;

  let angle = -90;
  const arcs = slices.map((s) => {
    const sweep = (s.value / total) * 360;
    const a0 = angle;
    const a1 = angle + sweep;
    angle = a1;

    const polar = (a: number, r: number) => {
      const rad = (a * Math.PI) / 180;
      return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
    };
    const [x0, y0] = polar(a0, radius);
    const [x1, y1] = polar(a1, radius);
    const [x2, y2] = polar(a1, inner);
    const [x3, y3] = polar(a0, inner);
    const large = sweep > 180 ? 1 : 0;
    return {
      ...s,
      path: `M ${x0} ${y0} A ${radius} ${radius} 0 ${large} 1 ${x1} ${y1} L ${x2} ${y2} A ${inner} ${inner} 0 ${large} 0 ${x3} ${y3} Z`,
      pct: (s.value / total) * 100,
    };
  });

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {arcs.map((a, i) => (
          <path
            key={i}
            d={a.path}
            fill={a.color}
            style={{ transition: 'all 0.6s ease-out' }}
          />
        ))}
        {centerValue && (
          <text
            x={cx}
            y={cy - 2}
            textAnchor="middle"
            className="fill-ink-50"
            style={{ fontSize: size * 0.16, fontWeight: 700 }}
          >
            {centerValue}
          </text>
        )}
        {centerLabel && (
          <text
            x={cx}
            y={cy + size * 0.1}
            textAnchor="middle"
            className="fill-ink-400"
            style={{ fontSize: size * 0.06, fontWeight: 500 }}
          >
            {centerLabel}
          </text>
        )}
      </svg>
      <div className="flex flex-col gap-2">
        {arcs.map((a, i) => (
          <div key={i} className="flex items-center gap-2.5">
            <span
              className="h-3 w-3 rounded-sm"
              style={{ background: a.color }}
            />
            <span className="text-sm text-ink-300">{a.label}</span>
            <span className="text-sm font-semibold text-ink-100">
              {a.pct.toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
