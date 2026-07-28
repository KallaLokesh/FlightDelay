import { useMemo } from 'react';
import {
  TrendingUp,
  Clock,
  Building2,
  Calendar,
  Layers,
  Activity,
  Plane,
  ArrowUpRight,
} from 'lucide-react';
import { DATASET, type EDAFlight } from '@/lib/dataset';
import { AIRLINES } from '@/lib/data/airlines';
import { AIRPORTS } from '@/lib/data/airports';
import type { SavedPrediction } from '@/lib/types';
import { BarChart } from '@/components/charts/BarChart';
import { LineChart } from '@/components/charts/LineChart';
import { Donut } from '@/components/charts/Donut';
import { Heatmap } from '@/components/charts/Heatmap';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const HOURS = ['5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22'];

interface DashboardViewProps {
  history: SavedPrediction[];
}

export function DashboardView({ history }: DashboardViewProps) {
  const stats = useMemo(() => {
    const savedFlights: EDAFlight[] = history.map((h) => {
      const hour = parseInt(h.scheduled_departure.split(':')[0] || '12', 10);
      const month = new Date(h.flight_date + 'T00:00:00').getMonth();
      return {
        airline: h.airline,
        origin: h.origin,
        destination: h.destination,
        month,
        dayOfWeek: h.day_of_week,
        hour,
        delay: h.delay_minutes,
        delayed: h.delay_minutes > 15,
      };
    });

    const ALL = [...DATASET, ...savedFlights];

    const total = ALL.length;
    const delayed = ALL.filter((f) => f.delayed).length;
    const avgDelay = ALL.reduce((s, f) => s + f.delay, 0) / total;
    const delayRate = (delayed / total) * 100;

    const byAirline = AIRLINES.map((al) => {
      const flights = ALL.filter((f) => f.airline === al.code);
      const avg = flights.reduce((s, f) => s + f.delay, 0) / (flights.length || 1);
      return { code: al.code, name: al.name, avg, count: flights.length };
    }).sort((a, b) => b.avg - a.avg);

    const byMonth = MONTHS.map((_, m) => {
      const flights = ALL.filter((f) => f.month === m);
      return flights.reduce((s, f) => s + f.delay, 0) / (flights.length || 1);
    });

    const byHour = HOURS.map((h) => {
      const hour = parseInt(h, 10);
      const flights = ALL.filter((f) => f.hour === hour);
      return flights.reduce((s, f) => s + f.delay, 0) / (flights.length || 1);
    });

    const byDow = DOW.map((_, d) => {
      const flights = ALL.filter((f) => f.dayOfWeek === d);
      return flights.reduce((s, f) => s + f.delay, 0) / (flights.length || 1);
    });

    const topAirports = AIRPORTS.map((ap) => {
      const flights = ALL.filter((f) => f.origin === ap.code);
      const avg = flights.reduce((s, f) => s + f.delay, 0) / (flights.length || 1);
      return { code: ap.code, city: ap.city, avg };
    }).sort((a, b) => b.avg - a.avg).slice(0, 10);

    const heatValues = DOW.map((_, d) =>
      HOURS.map((h) => {
        const hour = parseInt(h, 10);
        const flights = ALL.filter((f) => f.dayOfWeek === d && f.hour === hour);
        return flights.length > 0
          ? flights.reduce((s, f) => s + f.delay, 0) / flights.length
          : 0;
      }),
    );

    const onTime = total - delayed;
    const slight = ALL.filter((f) => f.delay > 15 && f.delay <= 30).length;
    const moderate = ALL.filter((f) => f.delay > 30 && f.delay <= 60).length;
    const severe = ALL.filter((f) => f.delay > 60).length;

    return {
      total,
      delayed,
      avgDelay,
      delayRate,
      onTime,
      slight,
      moderate,
      severe,
      byAirline,
      byMonth,
      byHour,
      byDow,
      topAirports,
      heatValues,
      savedCount: savedFlights.length,
    };
  }, [history]);

  const userStats = useMemo(() => {
    if (history.length === 0) return null;
    const total = history.length;
    const avgProb =
      history.reduce((s, h) => s + h.delay_probability, 0) / total;
    const avgDelay =
      history.reduce((s, h) => s + h.delay_minutes, 0) / total;
    const delayed = history.filter((h) => h.delay_minutes > 15).length;
    const byCat: Record<string, number> = {};
    history.forEach((h) => {
      byCat[h.delay_category] = (byCat[h.delay_category] || 0) + 1;
    });
    return { total, avgProb, avgDelay, delayed, byCat };
  }, [history]);

  return (
    <div className="animate-fade-in mx-auto max-w-7xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-ink-50">Delay analytics dashboard</h1>
        <p className="mt-2 text-ink-400">
          Exploratory analysis of {stats.total.toLocaleString()} flights across
          10 airlines and 24 airports — synthetic data modeled on real-world
          delay patterns
          {stats.savedCount > 0 && (
            <span className="text-accent-400">
              {' '}· {stats.savedCount} of your prediction{stats.savedCount === 1 ? '' : 's'} included
            </span>
          )}.
        </p>
      </div>

      {/* Your predictions section */}
      {userStats ? (
        <div className="mb-8 rounded-2xl border border-accent-500/20 bg-accent-500/5 p-6">
          <div className="mb-4 flex items-center gap-2">
            <Plane className="h-5 w-5 text-accent-400" />
            <h2 className="font-semibold text-ink-100">Your predictions</h2>
            <span className="rounded-full bg-accent-500/15 px-2 py-0.5 text-xs font-semibold text-accent-300">
              {userStats.total} saved
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KpiCard
              icon={Layers}
              label="Predictions made"
              value={userStats.total.toString()}
            />
            <KpiCard
              icon={TrendingUp}
              label="Avg delay probability"
              value={`${(userStats.avgProb * 100).toFixed(0)}%`}
              tone="warning"
            />
            <KpiCard
              icon={Activity}
              label="Avg predicted delay"
              value={`${userStats.avgDelay.toFixed(0)} min`}
              tone="warning"
            />
            <KpiCard
              icon={Clock}
              label="Predicted delayed"
              value={`${userStats.delayed}/${userStats.total}`}
              tone={userStats.delayed > 0 ? 'danger' : 'success'}
            />
          </div>

          {/* Recent prediction list */}
          <div className="mt-6 space-y-2">
            {history.slice(0, 6).map((h) => {
              const prob = Math.round(h.delay_probability * 100);
              const tone =
                h.delay_category === 'severe'
                  ? 'text-danger-400 bg-danger-500/15'
                  : h.delay_category === 'moderate'
                    ? 'text-orange-400 bg-orange-500/15'
                    : h.delay_category === 'slight'
                      ? 'text-warning-400 bg-warning-500/15'
                      : 'text-success-400 bg-success-500/15';
              return (
                <div
                  key={h.id}
                  className="flex items-center justify-between rounded-xl bg-ink-800/40 px-4 py-3 transition-colors hover:bg-ink-800/60"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-semibold text-accent-400">
                      {h.airline}
                    </span>
                    <span className="text-sm text-ink-300">
                      {h.origin}
                      <ArrowUpRight className="mx-0.5 inline h-3 w-3 text-ink-600" />
                      {h.destination}
                    </span>
                    <span className="text-xs text-ink-500">
                      {h.flight_date} · {h.scheduled_departure}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-ink-400">
                      {Math.round(h.delay_minutes)} min
                    </span>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${tone}`}>
                      {prob}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="mb-8 rounded-2xl border border-dashed border-ink-700 bg-ink-900/30 p-8 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-ink-800/50">
            <Plane className="h-6 w-6 -rotate-45 text-ink-600" />
          </div>
          <h3 className="font-semibold text-ink-300">No predictions yet</h3>
          <p className="mt-1 text-sm text-ink-500">
            Make predictions on the Predict page and they'll show up here in
            real time.
          </p>
        </div>
      )}

      {/* KPI cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          icon={Layers}
          label="Total flights"
          value={stats.total.toLocaleString()}
        />
        <KpiCard
          icon={TrendingUp}
          label="Delay rate (>15 min)"
          value={`${stats.delayRate.toFixed(1)}%`}
          tone="warning"
        />
        <KpiCard
          icon={Activity}
          label="Average delay"
          value={`${stats.avgDelay.toFixed(1)} min`}
          tone="warning"
        />
        <KpiCard
          icon={Building2}
          label="Worst carrier"
          value={stats.byAirline[0]?.code ?? '—'}
          sub={stats.byAirline[0]?.name}
          tone="danger"
        />
      </div>

      {/* Delay distribution donut + monthly trend */}
      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <h3 className="mb-1 font-semibold text-ink-100">Delay distribution</h3>
          <p className="mb-5 text-sm text-ink-500">
            Share of flights by delay severity
          </p>
          <Donut
            slices={[
              { label: 'On time (≤15 min)', value: stats.onTime, color: '#10b981' },
              { label: 'Slight (16–30 min)', value: stats.slight, color: '#f59e0b' },
              { label: 'Moderate (31–60 min)', value: stats.moderate, color: '#f97316' },
              { label: 'Severe (>60 min)', value: stats.severe, color: '#ef4444' },
            ]}
            centerValue={`${stats.delayRate.toFixed(0)}%`}
            centerLabel="delayed"
          />
        </div>

        <div className="card p-6">
          <h3 className="mb-1 font-semibold text-ink-100">
            Average delay by month
          </h3>
          <p className="mb-5 text-sm text-ink-500">
            Seasonality drives the strongest delay swings
          </p>
          <LineChart
            points={MONTHS.map((m, i) => ({ label: m, value: stats.byMonth[i] }))}
            color="#0aa5f0"
            unit="minutes"
          />
        </div>
      </div>

      {/* Airline comparison */}
      <div className="mb-8 card p-6">
        <h3 className="mb-1 font-semibold text-ink-100">
          Average delay by airline
        </h3>
        <p className="mb-5 text-sm text-ink-500">
          Lower is better — carrier on-time performance is a top predictor
        </p>
        <BarChart
          bars={stats.byAirline.map((a) => ({
            label: a.code,
            value: a.avg,
            color: a.avg > 12 ? '#ef4444' : a.avg > 8 ? '#f59e0b' : '#10b981',
          }))}
          unit="minutes"
        />
      </div>

      {/* Hour of day + Day of week */}
      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <h3 className="mb-1 flex items-center gap-2 font-semibold text-ink-100">
            <Clock className="h-4 w-4 text-accent-400" />
            Delay by hour of day
          </h3>
          <p className="mb-5 text-sm text-ink-500">
            Delays accumulate through the afternoon and peak in the evening
          </p>
          <LineChart
            points={HOURS.map((h, i) => ({ label: `${h}:00`, value: stats.byHour[i] }))}
            color="#f59e0b"
            unit="minutes"
          />
        </div>

        <div className="card p-6">
          <h3 className="mb-1 flex items-center gap-2 font-semibold text-ink-100">
            <Calendar className="h-4 w-4 text-accent-400" />
            Delay by day of week
          </h3>
          <p className="mb-5 text-sm text-ink-500">
            Fridays carry the highest delay risk of the week
          </p>
          <BarChart
            bars={DOW.map((d, i) => ({
              label: d,
              value: stats.byDow[i],
              color: i === 5 ? '#ef4444' : '#0aa5f0',
              }))}
              unit="minutes"
              highlightIndex={5}
            />
        </div>
      </div>

      {/* Top airports */}
      <div className="mb-8 card p-6">
        <h3 className="mb-1 font-semibold text-ink-100">
          Top 10 airports by average departure delay
        </h3>
        <p className="mb-5 text-sm text-ink-500">
          Congested hubs like JFK, ORD, and EWR consistently top the list
        </p>
        <BarChart
          bars={stats.topAirports.map((a) => ({
            label: a.code,
            value: a.avg,
            color: a.avg > 12 ? '#ef4444' : a.avg > 9 ? '#f59e0b' : '#0aa5f0',
          }))}
          unit="minutes"
        />
      </div>

      {/* Heatmap */}
      <div className="card p-6">
        <h3 className="mb-1 font-semibold text-ink-100">
          Delay heatmap — day of week × hour of day
        </h3>
        <p className="mb-5 text-sm text-ink-500">
          Darker blue means higher average delay. The Friday-evening block
          stands out clearly.
        </p>
        <Heatmap
          rows={DOW}
          cols={HOURS.map((h) => `${h}h`)}
          values={stats.heatValues}
          unit=" min"
        />
      </div>
    </div>
  );
}

function KpiCard({
  icon: Icon,
  label,
  value,
  sub,
  tone = 'neutral',
}: {
  icon: typeof Layers;
  label: string;
  value: string;
  sub?: string;
  tone?: 'neutral' | 'danger' | 'warning' | 'success';
}) {
  const toneColor = {
    neutral: 'text-accent-400',
    danger: 'text-danger-400',
    warning: 'text-warning-400',
    success: 'text-success-400',
  }[tone];
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-ink-400">{label}</span>
        <Icon className={`h-4 w-4 ${toneColor}`} />
      </div>
      <div className={`mt-2 text-2xl font-bold ${toneColor}`}>{value}</div>
      {sub && <div className="mt-0.5 text-xs text-ink-500">{sub}</div>}
    </div>
  );
}
