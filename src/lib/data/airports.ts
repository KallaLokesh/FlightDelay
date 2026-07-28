import type { Airport } from '../types';

export const AIRPORTS: Airport[] = [
  { code: 'JFK', name: 'John F. Kennedy Intl', city: 'New York', congestion: 0.82, region: 'Northeast' },
  { code: 'LGA', name: 'LaGuardia', city: 'New York', congestion: 0.78, region: 'Northeast' },
  { code: 'EWR', name: 'Newark Liberty Intl', city: 'Newark', congestion: 0.81, region: 'Northeast' },
  { code: 'BOS', name: 'Logan Intl', city: 'Boston', congestion: 0.64, region: 'Northeast' },
  { code: 'PHL', name: 'Philadelphia Intl', city: 'Philadelphia', congestion: 0.66, region: 'Northeast' },
  { code: 'ATL', name: 'Hartsfield-Jackson', city: 'Atlanta', congestion: 0.84, region: 'Southeast' },
  { code: 'MCO', name: 'Orlando Intl', city: 'Orlando', congestion: 0.70, region: 'Southeast' },
  { code: 'MIA', name: 'Miami Intl', city: 'Miami', congestion: 0.72, region: 'Southeast' },
  { code: 'CLT', name: 'Charlotte Douglas', city: 'Charlotte', congestion: 0.69, region: 'Southeast' },
  { code: 'FLL', name: 'Fort Lauderdale', city: 'Fort Lauderdale', congestion: 0.61, region: 'Southeast' },
  { code: 'ORD', name: 'O’Hare Intl', city: 'Chicago', congestion: 0.83, region: 'Midwest' },
  { code: 'DTW', name: 'Detroit Metro', city: 'Detroit', congestion: 0.58, region: 'Midwest' },
  { code: 'MSP', name: 'Minneapolis-St. Paul', city: 'Minneapolis', congestion: 0.60, region: 'Midwest' },
  { code: 'MDW', name: 'Midway Intl', city: 'Chicago', congestion: 0.55, region: 'Midwest' },
  { code: 'DFW', name: 'Dallas/Fort Worth', city: 'Dallas', congestion: 0.80, region: 'Southwest' },
  { code: 'IAH', name: 'George Bush Intl', city: 'Houston', congestion: 0.71, region: 'Southwest' },
  { code: 'AUS', name: 'Austin-Bergstrom', city: 'Austin', congestion: 0.62, region: 'Southwest' },
  { code: 'DEN', name: 'Denver Intl', city: 'Denver', congestion: 0.73, region: 'West' },
  { code: 'LAX', name: 'Los Angeles Intl', city: 'Los Angeles', congestion: 0.79, region: 'West' },
  { code: 'SFO', name: 'San Francisco Intl', city: 'San Francisco', congestion: 0.77, region: 'West' },
  { code: 'SEA', name: 'Seattle-Tacoma', city: 'Seattle', congestion: 0.65, region: 'West' },
  { code: 'SAN', name: 'San Diego Intl', city: 'San Diego', congestion: 0.56, region: 'West' },
  { code: 'LAS', name: 'Harry Reid Intl', city: 'Las Vegas', congestion: 0.67, region: 'West' },
  { code: 'PHX', name: 'Phoenix Sky Harbor', city: 'Phoenix', congestion: 0.63, region: 'West' },
];

export function getAirport(code: string): Airport | undefined {
  return AIRPORTS.find((a) => a.code === code);
}
