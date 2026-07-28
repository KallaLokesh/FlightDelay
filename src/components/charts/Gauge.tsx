interface GaugeProps {
  value: number;
  max?: number;
  label: string;
  sublabel?: string;
  color?: string;
  size?: number;
}

export function Gauge({
  value,
  max = 1,
  label,
  sublabel,
  color = '#0aa5f0',
  size = 220,
}: GaugeProps) {
  const pct = Math.min(1, Math.max(0, value / max));
  const radius = size / 2 - 20;
  const cx = size / 2;
  const cy = size / 2;
  const startAngle = -220;
  const sweep = 260;
  const endAngle = startAngle + sweep * pct;

  const polar = (angle: number, r: number) => {
    const rad = (angle * Math.PI) / 180;
    return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
  };

  const [sx, sy] = polar(startAngle, radius);
  const [ex, ey] = polar(endAngle, radius);
  const largeArc = sweep * pct > 180 ? 1 : 0;
  const [trackEx, trackEy] = polar(startAngle + sweep, radius);

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <path
          d={`M ${sx} ${sy} A ${radius} ${radius} 0 1 1 ${trackEx} ${trackEy}`}
          fill="none"
          stroke="#1c2d40"
          strokeWidth="14"
          strokeLinecap="round"
        />
        <path
          d={`M ${sx} ${sy} A ${radius} ${radius} 0 ${largeArc} 1 ${ex} ${ey}`}
          fill="none"
          stroke={color}
          strokeWidth="14"
          strokeLinecap="round"
          style={{ transition: 'all 0.8s ease-out' }}
        />
        <text
          x={cx}
          y={cy - 4}
          textAnchor="middle"
          className="fill-ink-50"
          style={{ fontSize: size * 0.2, fontWeight: 700 }}
        >
          {Math.round(pct * 100)}%
        </text>
        <text
          x={cx}
          y={cy + size * 0.13}
          textAnchor="middle"
          className="fill-ink-400"
          style={{ fontSize: size * 0.075, fontWeight: 500 }}
        >
          {label}
        </text>
      </svg>
      {sublabel && <p className="-mt-1 text-sm text-ink-500">{sublabel}</p>}
    </div>
  );
}
