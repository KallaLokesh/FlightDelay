import type { Airline } from '../types';

export const AIRLINES: Airline[] = [
  { code: 'WN', name: 'Southwest Airlines', onTimeRate: 0.74, color: '#304cb2' },
  { code: 'DL', name: 'Delta Air Lines', onTimeRate: 0.83, color: '#c8102e' },
  { code: 'AA', name: 'American Airlines', onTimeRate: 0.78, color: '#0078d2' },
  { code: 'UA', name: 'United Airlines', onTimeRate: 0.79, color: '#1a4f8b' },
  { code: 'B6', name: 'JetBlue Airways', onTimeRate: 0.72, color: '#0033a0' },
  { code: 'AS', name: 'Alaska Airlines', onTimeRate: 0.85, color: '#01426a' },
  { code: 'NK', name: 'Spirit Airlines', onTimeRate: 0.68, color: '#f6c543' },
  { code: 'F9', name: 'Frontier Airlines', onTimeRate: 0.69, color: '#1a9a5c' },
  { code: 'HA', name: 'Hawaiian Airlines', onTimeRate: 0.87, color: '#e51937' },
  { code: 'OO', name: 'SkyWest Airlines', onTimeRate: 0.76, color: '#444f5a' },
];

export function getAirline(code: string): Airline | undefined {
  return AIRLINES.find((a) => a.code === code);
}
