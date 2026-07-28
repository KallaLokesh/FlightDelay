import { AIRLINES } from './data/airlines';
import { AIRPORTS } from './data/airports';

export interface EDAFlight {
  airline: string;
  origin: string;
  destination: string;
  month: number;
  dayOfWeek: number;
  hour: number;
  delay: number;
  delayed: boolean;
}

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rng = mulberry32(42);

function seasonBase(month: number): number {
  if (month === 11 || month === 0) return 14;
  if (month === 5 || month === 6 || month === 7) return 9;
  if (month >= 2 && month <= 4) return 4;
  return 3;
}

export function generateDataset(n = 4000): EDAFlight[] {
  const flights: EDAFlight[] = [];
  for (let i = 0; i < n; i++) {
    const al = AIRLINES[Math.floor(rng() * AIRLINES.length)];
    const orig = AIRPORTS[Math.floor(rng() * AIRPORTS.length)];
    let dest = AIRPORTS[Math.floor(rng() * AIRPORTS.length)];
    while (dest.code === orig.code) dest = AIRPORTS[Math.floor(rng() * AIRPORTS.length)];
    const month = Math.floor(rng() * 12);
    const dow = Math.floor(rng() * 7);
    const hour = 5 + Math.floor(rng() * 19);

    const base = seasonBase(month);
    const airlineEffect = (0.8 - al.onTimeRate) * 30;
    const origEffect = (orig.congestion - 0.65) * 22;
    const destEffect = (dest.congestion - 0.65) * 14;
    const hourEffect = hour >= 16 && hour <= 21 ? 6 : hour <= 6 ? -3 : 1;
    const dowEffect = dow === 5 ? 4 : dow === 0 || dow === 6 ? -2 : 0;
    const noise = (rng() - 0.5) * 16;

    const delay = Math.max(
      0,
      base + airlineEffect + origEffect + destEffect + hourEffect + dowEffect + noise,
    );
    flights.push({
      airline: al.code,
      origin: orig.code,
      destination: dest.code,
      month,
      dayOfWeek: dow,
      hour,
      delay: Math.round(delay * 10) / 10,
      delayed: delay > 15,
    });
  }
  return flights;
}

export const DATASET: EDAFlight[] = generateDataset();
