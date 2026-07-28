import type { FactorContribution } from '@/lib/types';

interface WaterfallProps {
  base: number;
  baseLabel: string;
  factors: FactorContribution[];
  final: number;
  finalLabel: string;
}

export function Waterfall({
  base,
  baseLabel,
  factors,
  final,
  finalLabel,
}: WaterfallProps) {
  const items: { label: string; value: number; isTotal?: boolean }[] = [
    { label: baseLabel, value: base },
    ...factors.map((f) => ({ label: f.label, value: f.contribution })),
    { label: finalLabel, value: final, isTotal: true },
  ];

  const width = 760;
  const height = 300;
  const padding = { top: 30, right: 20, bottom: 90, left: 20 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const allVals = [base, ...factors.map((f) => f.contribution), final];
  const maxVal = Math.max(...allVals, 0.5);
  const minVal = Math.min(...allVals, -0.5);
  const range = maxVal - minVal;
  const zeroY = padding.top + (maxVal / range) * chartH;
  const barW = chartW / items.length - 16;

  const running: number[] = [];
  let acc = 0;
  items.forEach((it) => {
    if (it.isTotal) {
      running.push(it.value);
    } else if (it === items[0]) {
      running.push(0);
    } else {
      running.push(acc);
    }
    if (!it.isTotal && it !== items[0]) acc += it.value;
  });

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full">
      <line
        x1={padding.left}
        y1={zeroY}
        x2={width - padding.right}
        y2={zeroY}
        stroke="#283c54"
        strokeWidth="1"
        strokeDasharray="4 4"
      />
      {items.map((it, i) => {
        const x = padding.left + i * (chartW / items.length) + 8;
        const val = it.value;
        const startVal = running[i];
        const yTop =
          padding.top + ((maxVal - Math.max(val, startVal)) / range) * chartH;
        const yBottom =
          padding.top + ((maxVal - Math.min(val, startVal)) / range) * chartH;
        const barH = Math.abs(yBottom - yTop);
        const isPos = it.isTotal
          ? true
          : it === items[0]
            ? val >= 0
            : val >= 0;
        const fill = it.isTotal
          ? '#0aa5f0'
          : isPos
            ? '#ef4444'
            : '#10b981';

        return (
          <g key={i}>
            {i > 0 && !it.isTotal && (
              <line
                x1={x - 8}
                y1={
                  padding.top +
                  ((maxVal - running[i]) / range) * chartH
                }
                x2={x}
                y2={
                  padding.top +
                  ((maxVal - running[i]) / range) * chartH
                }
                stroke="#364e6b"
                strokeWidth="1.5"
              />
            )}
            {it.isTotal && (
              <line
                x1={x - 8}
                y1={padding.top + ((maxVal - running[i - 1] + 0) / range) * chartH}
                x2={x}
                y2={zeroY}
                stroke="#364e6b"
                strokeWidth="1.5"
              />
            )}
            <rect
              x={x}
              y={yTop}
              width={barW}
              height={Math.max(barH, 2)}
              rx="4"
              fill={fill}
              opacity={it.isTotal ? 1 : 0.85}
              style={{ transition: 'all 0.6s ease-out' }}
            />
            <text
              x={x + barW / 2}
              y={yTop - 6}
              textAnchor="middle"
              className="fill-ink-300"
              style={{ fontSize: 11, fontWeight: 600 }}
            >
              {(val >= 0 ? '+' : '') + val.toFixed(2)}
            </text>
            <text
              x={x + barW / 2}
              y={height - padding.bottom + 16}
              textAnchor="middle"
              className="fill-ink-400"
              style={{ fontSize: 10 }}
            >
              {wrapLabel(it.label, 14).map((line, li) => (
                <tspan key={li} x={x + barW / 2} dy={li === 0 ? 0 : 11}>
                  {line}
                </tspan>
              ))}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function wrapLabel(s: string, max: number): string[] {
  if (s.length <= max) return [s];
  const words = s.split(' ');
  const lines: string[] = [];
  let cur = '';
  for (const w of words) {
    if ((cur + ' ' + w).trim().length > max) {
      if (cur) lines.push(cur);
      cur = w;
    } else {
      cur = (cur + ' ' + w).trim();
    }
  }
  if (cur) lines.push(cur);
  return lines.slice(0, 3);
}
