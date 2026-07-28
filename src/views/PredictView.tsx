import { useState } from 'react';
import {
  Plane,
  Loader2,
  RotateCcw,
  ArrowUpRight,
  ArrowDownRight,
  Info,
  History,
  Trash2,
  Clock,
  Calendar,
  Building2,
  MapPin,
} from 'lucide-react';
import { AIRLINES } from '@/lib/data/airlines';
import { AIRPORTS } from '@/lib/data/airports';
import { predictDelay } from '@/lib/model';
import type { PredictionResult, SavedPrediction } from '@/lib/types';
import { Gauge } from '@/components/charts/Gauge';
import { Waterfall } from '@/components/charts/Waterfall';
import { supabase } from '@/lib/supabase';

interface PredictViewProps {
  history: SavedPrediction[];
  onPredictionSaved: () => void;
}

const CATEGORY_STYLES = {
  'on-time': { label: 'On time', color: '#10b981', bg: 'bg-success-500/15', text: 'text-success-400' },
  slight: { label: 'Slight delay', color: '#f59e0b', bg: 'bg-warning-500/15', text: 'text-warning-400' },
  moderate: { label: 'Moderate delay', color: '#f97316', bg: 'bg-orange-500/15', text: 'text-orange-400' },
  severe: { label: 'Severe delay', color: '#ef4444', bg: 'bg-danger-500/15', text: 'text-danger-400' },
} as const;

export function PredictView({ history, onPredictionSaved }: PredictViewProps) {
  const [airline, setAirline] = useState('');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [flightDate, setFlightDate] = useState('');
  const [departure, setDeparture] = useState('12:00');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [submitted, setSubmitted] = useState<{
    airline: string;
    origin: string;
    destination: string;
    date: string;
    dep: string;
  } | null>(null);
  const [error, setError] = useState('');

  const canPredict = airline && origin && destination && flightDate && departure;

  async function handlePredict() {
    if (!canPredict) return;
    setLoading(true);
    setError('');
    const res = predictDelay(airline, origin, destination, flightDate, departure);
    setResult(res);
    setSubmitted({ airline, origin, destination, date: flightDate, dep: departure });

    try {
      const date = new Date(flightDate + 'T00:00:00');
      await supabase.from('flight_predictions').insert({
        airline,
        origin,
        destination,
        flight_date: flightDate,
        scheduled_departure: departure,
        day_of_week: date.getDay(),
        delay_minutes: res.delayMinutes,
        delay_probability: res.delayProbability,
        delay_category: res.delayCategory,
        top_factors: res.factors.slice(0, 6),
      });
      onPredictionSaved();
    } catch {
      setError('Prediction computed, but could not save to history. Your result is still shown below.');
    }

    setLoading(false);
  }

  function handleReset() {
    setAirline('');
    setOrigin('');
    setDestination('');
    setFlightDate('');
    setDeparture('12:00');
    setResult(null);
    setSubmitted(null);
    setError('');
  }

  async function handleClearHistory() {
    await supabase.from('flight_predictions').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    onPredictionSaved();
  }

  const cat = result ? CATEGORY_STYLES[result.delayCategory] : null;

  return (
    <div className="animate-fade-in mx-auto max-w-7xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-ink-50">Predict a flight delay</h1>
        <p className="mt-2 text-ink-400">
          Enter the flight details below. The model returns a delay probability
          and an exact breakdown of why.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[420px_1fr]">
        {/* Form */}
        <div className="card h-fit p-6">
          <div className="mb-5 flex items-center gap-2">
            <Plane className="h-5 w-5 text-accent-400" />
            <h2 className="font-semibold text-ink-100">Flight details</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="label">
                <Building2 className="mr-1.5 inline h-3.5 w-3.5" />
                Airline
              </label>
              <select
                className="input"
                value={airline}
                onChange={(e) => setAirline(e.target.value)}
              >
                <option value="">Select airline</option>
                {AIRLINES.map((a) => (
                  <option key={a.code} value={a.code}>
                    {a.name} ({a.code})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">
                  <MapPin className="mr-1.5 inline h-3.5 w-3.5" />
                  Origin
                </label>
                <select
                  className="input"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                >
                  <option value="">From</option>
                  {AIRPORTS.map((a) => (
                    <option key={a.code} value={a.code}>
                      {a.code} — {a.city}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">
                  <MapPin className="mr-1.5 inline h-3.5 w-3.5" />
                  Destination
                </label>
                <select
                  className="input"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                >
                  <option value="">To</option>
                  {AIRPORTS.map((a) => (
                    <option key={a.code} value={a.code}>
                      {a.code} — {a.city}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="label">
                <Calendar className="mr-1.5 inline h-3.5 w-3.5" />
                Flight date
              </label>
              <input
                type="date"
                className="input"
                value={flightDate}
                onChange={(e) => setFlightDate(e.target.value)}
              />
            </div>

            <div>
              <label className="label">
                <Clock className="mr-1.5 inline h-3.5 w-3.5" />
                Scheduled departure
              </label>
              <input
                type="time"
                className="input"
                value={departure}
                onChange={(e) => setDeparture(e.target.value)}
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={handlePredict}
                disabled={!canPredict || loading}
                className="btn-primary flex-1"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Predicting…
                  </>
                ) : (
                  <>
                    <Plane className="h-5 w-5 -rotate-45" />
                    Predict
                  </>
                )}
              </button>
              {result && (
                <button onClick={handleReset} className="btn-ghost">
                  <RotateCcw className="h-5 w-5" />
                </button>
              )}
            </div>
            {error && (
              <p className="rounded-lg bg-warning-500/10 px-3 py-2 text-sm text-warning-400">
                {error}
              </p>
            )}
          </div>

          {/* History */}
          {history.length > 0 && (
            <div className="mt-8 border-t border-ink-800 pt-6">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <History className="h-4 w-4 text-ink-500" />
                  <h3 className="text-sm font-semibold text-ink-300">
                    Recent predictions
                  </h3>
                </div>
                <button
                  onClick={handleClearHistory}
                  className="text-ink-600 transition-colors hover:text-danger-400"
                  title="Clear history"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {history.slice(0, 10).map((h) => {
                  const hc = CATEGORY_STYLES[h.delay_category as keyof typeof CATEGORY_STYLES] ?? CATEGORY_STYLES['on-time'];
                  return (
                    <div
                      key={h.id}
                      className="flex items-center justify-between rounded-lg bg-ink-800/40 px-3 py-2 text-sm"
                    >
                      <div className="min-w-0">
                        <div className="font-medium text-ink-200">
                          {h.airline} · {h.origin}→{h.destination}
                        </div>
                        <div className="text-xs text-ink-500">
                          {h.flight_date} · {h.scheduled_departure}
                        </div>
                      </div>
                      <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${hc.bg} ${hc.text}`}>
                        {Math.round(h.delay_probability * 100)}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Result */}
        <div>
          {!result && (
            <div className="card flex h-full min-h-[500px] flex-col items-center justify-center p-10 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-ink-800/50">
                <Plane className="h-8 w-8 -rotate-45 text-ink-600" />
              </div>
              <h3 className="text-lg font-semibold text-ink-300">
                Your prediction will appear here
              </h3>
              <p className="mt-2 max-w-sm text-sm text-ink-500">
                Fill in the flight details and hit Predict to see the delay
                probability and a full explanation.
              </p>
            </div>
          )}

          {result && cat && submitted && (
            <div className="animate-slide-up space-y-6">
              {/* Top result card */}
              <div className="card p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-sm text-ink-400">
                      <span className="font-mono font-semibold text-accent-400">
                        {submitted.airline}
                      </span>
                      <span>{submitted.origin}</span>
                      <ArrowUpRight className="h-4 w-4 text-ink-600" />
                      <span>{submitted.destination}</span>
                    </div>
                    <div className="mt-1 text-sm text-ink-500">
                      {submitted.date} · departing {submitted.dep}
                    </div>
                  </div>
                  <div
                    className={`rounded-xl px-4 py-2 text-sm font-bold ${cat.bg} ${cat.text}`}
                  >
                    {cat.label}
                  </div>
                </div>

                <div className="mt-6 grid gap-6 sm:grid-cols-[auto_1fr] sm:items-center">
                  <Gauge
                    value={result.delayProbability}
                    label="Delay probability"
                    sublabel={`> 15 min delay`}
                    color={cat.color}
                    size={200}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <StatBox
                      label="Expected delay"
                      value={`${result.delayMinutes} min`}
                      tone={result.delayMinutes > 15 ? 'danger' : 'warning'}
                    />
                    <StatBox
                      label="Baseline prob."
                      value={`${Math.round(result.baseProbability * 100)}%`}
                      tone="neutral"
                    />
                    <StatBox
                      label="Final log-odds"
                      value={result.finalLogit.toFixed(2)}
                      tone="neutral"
                    />
                    <StatBox
                      label="Risk change"
                      value={`${result.delayProbability - result.baseProbability >= 0 ? '+' : ''}${Math.round((result.delayProbability - result.baseProbability) * 100)} pts`}
                      tone={result.delayProbability - result.baseProbability >= 0 ? 'danger' : 'success'}
                    />
                  </div>
                </div>
              </div>

              {/* XAI: Waterfall */}
              <div className="card p-6">
                <div className="mb-2 flex items-center gap-2">
                  <Info className="h-5 w-5 text-accent-400" />
                  <h3 className="font-semibold text-ink-100">
                    SHAP waterfall — how the prediction is built
                  </h3>
                </div>
                <p className="mb-4 text-sm text-ink-400">
                  Starts from the average flight baseline, then each factor
                  pushes the log-odds up (red) or down (green). The final bar is
                  the model's output for this flight.
                </p>
                <Waterfall
                  base={result.baseLogit}
                  baseLabel="Baseline"
                  factors={result.factors}
                  final={result.finalLogit}
                  finalLabel="Prediction"
                />
              </div>

              {/* XAI: Factor list */}
              <div className="card p-6">
                <h3 className="mb-4 font-semibold text-ink-100">
                  Factor-by-factor explanation
                </h3>
                <div className="space-y-3">
                  {result.factors.map((f, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-4 rounded-xl bg-ink-800/40 p-4 transition-colors hover:bg-ink-800/60"
                    >
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                          f.direction === 'increases'
                            ? 'bg-danger-500/15 text-danger-400'
                            : 'bg-success-500/15 text-success-400'
                        }`}
                      >
                        {f.direction === 'increases' ? (
                          <ArrowUpRight className="h-5 w-5" />
                        ) : (
                          <ArrowDownRight className="h-5 w-5" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-medium text-ink-100">
                            {f.label}
                          </span>
                          <span
                            className={`font-mono text-sm font-bold ${
                              f.direction === 'increases'
                                ? 'text-danger-400'
                                : 'text-success-400'
                            }`}
                          >
                            {f.contribution >= 0 ? '+' : ''}
                            {f.contribution.toFixed(3)}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-ink-400">{f.detail}</p>
                        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ink-700">
                          <div
                            className={`h-full rounded-full ${
                              f.direction === 'increases'
                                ? 'bg-danger-500'
                                : 'bg-success-500'
                            }`}
                            style={{
                              width: `${Math.min(100, Math.abs(f.contribution) * 80)}%`,
                              transition: 'width 0.6s ease-out',
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatBox({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: 'neutral' | 'danger' | 'success' | 'warning';
}) {
  const toneClass = {
    neutral: 'text-ink-100',
    danger: 'text-danger-400',
    success: 'text-success-400',
    warning: 'text-warning-400',
  }[tone];
  return (
    <div className="rounded-xl bg-ink-800/40 p-4">
      <div className="text-xs text-ink-500">{label}</div>
      <div className={`mt-1 text-xl font-bold ${toneClass}`}>{value}</div>
    </div>
  );
}
