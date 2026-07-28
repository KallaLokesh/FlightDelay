import {
  Plane,
  Brain,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  Gauge as GaugeIcon,
  Activity,
  Sparkles,
} from 'lucide-react';
import type { View } from '@/components/Navbar';
import { Gauge } from '@/components/charts/Gauge';

interface HomeViewProps {
  onNavigate: (v: View) => void;
}

const FEATURES = [
  {
    icon: Brain,
    title: 'Transparent by design',
    desc: 'Every prediction comes with an exact SHAP decomposition — no black box. See precisely which factors push a flight toward or away from a delay.',
  },
  {
    icon: GaugeIcon,
    title: 'Probability + severity',
    desc: 'Get a calibrated delay probability, an expected delay in minutes, and a severity category from on-time to severe.',
  },
  {
    icon: TrendingUp,
    title: '4,000-flight analytics',
    desc: 'Explore a synthetic dataset of 4,000 flights across 10 airlines and 24 airports to discover delay patterns by season, hour, and carrier.',
  },
  {
    icon: ShieldCheck,
    title: 'Interpretable model',
    desc: 'A logistic regression on interpretable features — hour, season, airline, airport congestion, day of week — where SHAP = coefficient × value, exactly.',
  },
];

const STATS = [
  { value: '10', label: 'Airlines' },
  { value: '24', label: 'Airports' },
  { value: '4,000', label: 'Flights analyzed' },
  { value: '6', label: 'Explanation factors' },
];

export function HomeView({ onNavigate }: HomeViewProps) {
  return (
    <div className="animate-fade-in">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-60" />
        <div className="absolute left-1/2 top-0 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-accent-500/10 blur-[120px]" />

        <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-20 sm:pt-28">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-accent-500/30 bg-accent-500/10 px-4 py-1.5 text-sm font-medium text-accent-300">
                <Sparkles className="h-3.5 w-3.5" />
                Explainable AI for aviation
              </div>
              <h1 className="text-balance text-4xl font-extrabold leading-tight text-ink-50 sm:text-5xl lg:text-6xl">
                Know <span className="text-accent-400">why</span> your flight
                will be delayed — before it happens.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-300">
                SkyDelay predicts flight delay probability using a transparent
                logistic model and explains every prediction with exact SHAP
                value decomposition. No black boxes — just clear, auditable
                reasoning.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <button
                  onClick={() => onNavigate('predict')}
                  className="btn-primary"
                >
                  <Plane className="h-5 w-5 -rotate-45" />
                  Predict a flight
                </button>
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="btn-ghost"
                >
                  <Activity className="h-5 w-5" />
                  Explore the data
                </button>
              </div>

              <div className="mt-12 grid grid-cols-4 gap-4">
                {STATS.map((s) => (
                  <div key={s.label}>
                    <div className="text-2xl font-bold text-accent-400 sm:text-3xl">
                      {s.value}
                    </div>
                    <div className="text-xs text-ink-500">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative flex justify-center">
              <div className="card glow w-full max-w-md p-8">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm font-medium text-ink-400">
                    Sample prediction
                  </span>
                  <span className="rounded-full bg-danger-500/15 px-3 py-1 text-xs font-semibold text-danger-400">
                    Severe risk
                  </span>
                </div>
                <Gauge
                  value={0.82}
                  label="Delay probability"
                  sublabel="Spirit NK · ORD → LGA · Dec 23 · 17:30"
                  color="#ef4444"
                  size={200}
                />
                <div className="mt-6 space-y-3">
                  {[
                    { l: 'Holiday season', v: '+0.55', up: true },
                    { l: 'Evening departure', v: '+0.42', up: true },
                    { l: 'Airline on-time 68%', v: '+0.22', up: true },
                    { l: 'Origin congestion 83', v: '+0.25', up: true },
                  ].map((f) => (
                    <div
                      key={f.l}
                      className="flex items-center justify-between rounded-lg bg-ink-800/40 px-3 py-2"
                    >
                      <span className="text-sm text-ink-300">{f.l}</span>
                      <span
                        className={`font-mono text-sm font-semibold ${
                          f.up ? 'text-danger-400' : 'text-success-400'
                        }`}
                      >
                        {f.v}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-center text-xs text-ink-500">
                  Each value is an exact SHAP contribution to the log-odds
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-ink-50 sm:text-4xl">
            Why SkyDelay is different
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-ink-400">
            Most delay predictors are black boxes. SkyDelay is built on a model
            where every prediction is fully decomposable.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="card group p-6 transition-all hover:border-accent-500/40 hover:bg-ink-800/30"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-accent-500/10 text-accent-400 transition-colors group-hover:bg-accent-500/20">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mb-2 font-semibold text-ink-100">{f.title}</h3>
                <p className="text-sm leading-relaxed text-ink-400">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="card relative overflow-hidden p-10 text-center sm:p-16">
          <div className="absolute inset-0 grid-bg opacity-40" />
          <div className="relative">
            <h2 className="text-balance text-3xl font-bold text-ink-50 sm:text-4xl">
              Try it on your next flight
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-ink-400">
              Pick an airline, route, date, and departure time. Get an instant
              prediction with a full explanation in seconds.
            </p>
            <button
              onClick={() => onNavigate('predict')}
              className="btn-primary mt-8"
            >
              Start predicting
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
